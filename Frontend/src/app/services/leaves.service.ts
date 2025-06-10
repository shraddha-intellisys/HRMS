import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define the Leave interface if not already defined or import it from the correct location
export interface Leave {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  reason?: string;
  rejectionReason?: string;
  rejectedBy?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  constructor(private http: HttpClient) {}

  getAllLeaves(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5000/api/leave/all');
  }

  submitLeave(leaveData: any): Observable<any> {
    return this.http.post('http://localhost:5000/api/leave/submit', leaveData);
  }

  getHolidays(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5000/api/holidays');
  }

  approveLeave(id: string): Observable<any> {
    return this.http.patch(`http://localhost:5000/api/leave/approve/${id}`, {});
  }

  rejectLeave(id: string, rejectedBy: string, reason: string) {
  return this.http.patch(`http://localhost:5000/api/leave/reject/${id}`, {
    rejectedBy,
    rejectionReason: reason
  });
}
getRejectedLeaves() {
  return this.http.get<Leave[]>(`http://localhost:5000/api/leave/rejected`);
}

  getDashboardStats(): Observable<any> {
    return this.http.get<any>('http://localhost:5000/api/admin/stats');
  }

  getDashboardCharts(): Observable<any> {
    return this.http.get<any>('http://localhost:5000/api/admin/chart-data');
  }
}
