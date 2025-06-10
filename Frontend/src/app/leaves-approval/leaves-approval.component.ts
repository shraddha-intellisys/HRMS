import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Employee {
  id: string;
  name: string;
  leaveBalance: number;
}

interface LeaveRequest {
  _id?: string;
  empName: string;
  empId: string;
  expanded: boolean;
  applicationDate: Date;
  applicationType: string;
  leaveType: string;
  leaveBalance: number;
  fromDate: string;
  fromDateHalf: string;
  toDate: string;
  toDateHalf: string;
  reason: string;
  remarks: string;
  ccEmail: string;
  approvedBy: string;
}

interface ApprovedLeave {
  empName: string;
  empId: string;
  leaveType: string;
  fromDate: Date;
  fromDateHalf: string;
  toDate: Date;
  toDateHalf: string;
  approvedDate: Date;
  status: string;
  approvedBy: string;
}

interface RejectedLeave {
  empName: string;
  empId: string;
  leaveType: string;
  fromDate: Date;
  fromDateHalf: string;
  toDate: Date;
  toDateHalf: string;
  rejectedDate: Date;
  rejectionReason: string;
  rejectedBy?: string;
}

@Component({
  selector: 'app-leaves-approval',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './leaves-approval.component.html',
  styleUrls: ['./leaves-approval.component.css']
})
export class LeavesApprovalComponent {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchLeaveRequests();
    this.fetchApprovedLeaves();
    this.fetchRejectedLeaves();
  }

  leaveRequests: LeaveRequest[] = [];
  approvedLeaves: ApprovedLeave[] = [];
  rejectedLeaves: RejectedLeave[] = [];
  activeTab: 'approved' | 'rejected' = 'approved';

  fetchLeaveRequests(): void {
    this.http.get<LeaveRequest[]>('http://localhost:5000/api/leave/pending').subscribe(data => {
      this.leaveRequests = data.map(req => ({ ...req, expanded: false }));
    });
  }

  fetchApprovedLeaves(): void {
    this.http.get<ApprovedLeave[]>('http://localhost:5000/api/leave/approved').subscribe(data => {
      this.approvedLeaves = data;
    });
  }

  fetchRejectedLeaves(): void {
    this.http.get<RejectedLeave[]>('http://localhost:5000/api/leave/rejected').subscribe(data => {
      this.rejectedLeaves = data;
    });
  }

  toggleRequest(index: number): void {
    this.leaveRequests[index].expanded = !this.leaveRequests[index].expanded;
  }

  approveLeave(index: number): void {
    const request = this.leaveRequests[index];

    this.http.patch(`http://localhost:5000/api/leave/approve/${request._id}`, {
      approvedBy: request.approvedBy
    }).subscribe(() => {
      const approvedLeave: ApprovedLeave = {
        empName: request.empName,
        empId: request.empId,
        leaveType: request.leaveType,
        fromDate: new Date(request.fromDate),
        fromDateHalf: request.fromDateHalf,
        toDate: new Date(request.toDate),
        toDateHalf: request.toDateHalf,
        approvedDate: new Date(),
        status: 'Approved',
        approvedBy: request.approvedBy
      };
      this.approvedLeaves.push(approvedLeave);
      this.leaveRequests.splice(index, 1);
    });
  }

  rejectLeave(index: number): void {
    const request = this.leaveRequests[index];
    const rejectionReason = request.remarks || 'Rejected by manager';
    const rejectedBy = request.approvedBy || 'Admin';

    this.http.patch(`http://localhost:5000/api/leave/reject/${request._id}`, {
      rejectedBy,
      rejectionReason
    }).subscribe(() => {
      const rejectedLeave: RejectedLeave = {
        empName: request.empName,
        empId: request.empId,
        leaveType: request.leaveType,
        fromDate: new Date(request.fromDate),
        fromDateHalf: request.fromDateHalf,
        toDate: new Date(request.toDate),
        toDateHalf: request.toDateHalf,
        rejectedDate: new Date(),
        rejectionReason,
        rejectedBy
      };
      this.rejectedLeaves.push(rejectedLeave);
      this.leaveRequests.splice(index, 1);
    });
  }

  calculateLeaveDays(leave: ApprovedLeave | RejectedLeave): number {
    const from = new Date(leave.fromDate);
    const to = new Date(leave.toDate);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (leave.fromDateHalf !== leave.toDateHalf && diffDays === 1) {
      return 0.5;
    }
    if (leave.fromDateHalf === 'Second Half' || leave.toDateHalf === 'First Half') {
      return diffDays - 0.5;
    }
    return diffDays;
  }
}
