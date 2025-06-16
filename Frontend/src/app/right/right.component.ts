import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-right',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.css'],
})
export class RightComponent implements OnInit {

  // Employee basic fields
  username = '';
  employeeCode = '';
  employeeName = '';
  branch = '';
  department = '';
  email = '';
  projectType = '';
  joiningDate = '';
  imageUrl = '';
  dob: string = '';
  currentTime = '';
  currentDate = '';
   gender: string = '';
  showProfile = false;

  // Local employee data storage
  emp: any = {};
  upcomingBirthdays: any[] = [];
  allEmployees: any[] = [];
  filteredEmployees: any[] = [];

  // Admin dashboard data
  welcomeMessage = '';
  newsItems: string[] = [];
  feedItems: string[] = [];
  empDocuments: any[] = [];
  reminders: any[] = [];
  todoItems: any[] = [];
  newJoinees: any[] = [];

  private readonly API_URL = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.getEmployeeDetails();
    this.initClock();
    this.setCurrentDate();
    this.fetchEmployees();
    this.getUpcomingBirthdays();
    this.getAdminDashboardData();
  }

  private loadUserInfo(): void {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
    } else {
      this.fetchUserProfile();
    }
  }

  private fetchEmployees(): void {
    const headers = this.createAuthHeaders();
    // ✅ Corrected endpoint (IMPORTANT)
    this.http.get<any>(`${this.API_URL}/employees/all`, { headers }).subscribe({
      next: (res) => {
        const employees: any[] = res?.employees || [];
        const loggedInEmpID = this.authService.getEmployeeId();
        this.filteredEmployees = employees.filter((emp: any) => emp.empID !== loggedInEmpID);
      },
      error: (err) => console.error('❌ Error fetching employees for reminders:', err),
    });
  }

  private fetchUserProfile(): void {
    const headers = this.createAuthHeaders();
    this.http.get<any>(`${this.API_URL}/profile`, { headers }).subscribe({
      next: (data) => {
        if (data?.success && data.username) {
          this.username = data.username;
          localStorage.setItem('username', this.username);
        }
      },
      error: (err) => console.error('❌ Error fetching user profile:', err),
    });
  }

  private getEmployeeDetails(): void {
    const headers = this.createAuthHeaders();
    this.http.get<any>(`${this.API_URL}/employees/profile`, { headers }).subscribe({
      next: (res) => {
        const emp = res?.employee;
        if (!emp) {
          console.warn('⚠️ No employee data found.');
          return;
        }

        this.emp = emp;
        this.employeeName = emp.name || 'Employee';
        this.employeeCode = emp.employeeCode || 'N/A';
        this.branch = emp.branch || 'N/A';
        this.department = emp.department || 'N/A';
        this.email = emp.email || 'N/A';
        this.projectType = emp.projectType || 'N/A';
        this.joiningDate = this.formatDate(emp.joiningDate);
        this.dob = this.formatDate(emp.dateOfBirth);
         this.gender = emp.gender || ''; // Add this line to get gender
        this.imageUrl = emp.image?.startsWith('http')
          ? emp.image
          : emp.image
            ? `http://localhost:5000/${emp.image}`
            : 'assets/employee (1).png';
      },
      error: (err) => console.error('❌ Error fetching employee details:', err),
    });
  }

  private initClock(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  getTitlePrefix(): string {
    if (!this.gender) return '';

    const genderLower = this.gender.toLowerCase();
    if (genderLower === 'male') {
      return 'Mr.';
    } else if (genderLower === 'female') {
      return 'Ms.';
    }
    return '';
  }


  private updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private setCurrentDate(): void {
    const today = new Date();
    this.currentDate = today.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
  }

  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getUpcomingBirthdays() {
    const headers = this.createAuthHeaders();
    this.http.get(`${this.API_URL}/employees/upcoming-birthdays`, { headers }).subscribe({
      next: (response: any) => {
        if (response?.success) {
          this.upcomingBirthdays = this.filterUpcomingBirthdays(response.upcomingBirthdays || []);
        }
      },
      error: (err) => {
        console.error('❌ Error fetching upcoming birthdays:', err);
      }
    });
  }

  private filterUpcomingBirthdays(employees: any[]): any[] {
    const today = new Date();
    const upcoming = employees.filter(emp => {
      const empBirthday = new Date(emp.dateOfBirth);
      empBirthday.setFullYear(today.getFullYear());
      return empBirthday >= today;
    }).slice(0, 5);
    return upcoming;
  }

  private getAdminDashboardData(): void {
  this.http.get<any>(`${this.API_URL}/admin-dashboard/public`).subscribe({
    next: (data) => {
      this.welcomeMessage = data?.welcomeMessage ?? '';
      this.newsItems = data?.newsItems ?? [];
      this.feedItems = data?.feedItems ?? [];

      // Clean reminders before assigning
      this.reminders = (data?.reminders ?? []).map((r: any) => ({
        title: r.title,
        date: r.date,
        type: r.type,
        notes: r.notes
      }));

      // Clean todoItems before assigning
      this.todoItems = (data?.todoItems ?? []).map((t: any) => ({
        task: t.task,
        completed: t.completed
      }));

      // Clean empDocuments
      this.empDocuments = (data?.empDocuments ?? []).map((d: any) => ({
        name: d.name
      }));

      // Clean newJoinees
      this.newJoinees = (data?.newJoinees ?? []).map((j: any) => ({
        name: j.name,
        joinDate: j.joinDate,
        imageUrl: j.imageUrl
      }));
    },
    error: (err) => {
      console.error('Error fetching admin dashboard data:', err);
    }
  });
}
}
