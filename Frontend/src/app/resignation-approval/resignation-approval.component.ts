import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-resignation-approval',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './resignation-approval.component.html',
  styleUrls: ['./resignation-approval.component.css']
})
export class ResignationApprovalComponent implements OnInit {
  resignationRequests: any[] = [];

  activeTab: 'approved' | 'rejected' = 'approved';

  approvedResignations: any[] = [];
  rejectedResignations: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchPendingResignations();
  }

  fetchPendingResignations(): void {
    this.http.get<any[]>('http://localhost:5000/api/resignation/pending')
      .subscribe({
        next: (data) => {
          this.resignationRequests = data.map(r => ({ ...r, expanded: false }));
        },
        error: (err) => {
          console.error('❌ Error fetching resignations:', err);
        }
      });
  }

  toggleRequest(index: number) {
    this.resignationRequests[index].expanded = !this.resignationRequests[index].expanded;
  }

  approveResignation(index: number) {
    const request = this.resignationRequests[index];

    const approvedResignation = {
      ...request,
      approvedDate: new Date(),
      status: 'Approved'
    };

    this.http.put('http://localhost:5000/api/resignation/approve', {
      empCode: request.empCode
    }).subscribe({
      next: () => {
        this.approvedResignations.push(approvedResignation);
        this.resignationRequests.splice(index, 1);
        console.log('✅ Resignation approved:', approvedResignation);
      },
      error: (err) => {
        console.error('❌ Error approving resignation:', err);
      }
    });
  }

  rejectResignation(index: number) {
    const request = this.resignationRequests[index];

    const rejectedResignation = {
      ...request,
      rejectedDate: new Date(),
      rejectionReason: 'Manager rejected'
    };

    this.http.put('http://localhost:5000/api/resignation/reject', {
      empCode: request.empCode
    }).subscribe({
      next: () => {
        this.rejectedResignations.push(rejectedResignation);
        this.resignationRequests.splice(index, 1);
        console.log('❌ Resignation rejected:', rejectedResignation);
      },
      error: (err) => {
        console.error('❌ Error rejecting resignation:', err);
      }
    });
  }
}
