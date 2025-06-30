import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  // User properties
  username = 'Shraddha';
  employeeCode = 'EMP00123';
  employeeName = 'Shraddha Meshram';
  branch = 'Mumbai';
  department = 'HR';
  email = 'shraddha@intellisys.com';
  projectType = 'Admin Dashboard';
  joiningDate = '2020-01-15';
  imageUrl = 'assets/employee (1).png';
  dob = '1990-07-15';
  currentTime = '';
  currentDate = '';
  gender: string = '';
  showProfile = false;
  showNotifications = false;
  unreadNotificationsCount = 0;
  
  // Employee data
  emp: any = {
    name: 'Shraddha Meshram',
    imageUrl: '',
    empID: 'EMP00123',
    branch: 'Mumbai',
    department: 'HR',
    email: 'shraddha@intellisys.com',
    dateOfBirth: new Date('1990-07-15')
  };

  // Dashboard data
  upcomingBirthdays: any[] = [];
  birthdaysThisMonth: any[] = [];
  allEmployees: any[] = [];
  filteredEmployees: any[] = [];
  notifications: any[] = [];
  
  // Edit states
  editingWelcome = false;
  editingNews = false;
  editingDocuments = false;
  editingReminders = false;
  editingFeed = false;
  editingEmpDocuments = false;
  editingTodo = false;
  editingJoinee = false;
  editingEmployees = false;

  // Section content
  welcomeMessage = 'Hope you have a great day at work!';
  newsItems: string[] = [];
  newsText = '';
  documentSearch = '';
  documents: any[] = [];
  selectedDocuments: File[] = [];
  reminders: any[] = [];
  feedItems: {text: string, date: Date}[] = [];
  feedText = '';
  empDocumentSearch = '';
  empDocuments: any[] = [];
  selectedEmpDocuments: File[] = [];
  todoItems: any[] = [];
  newJoinees: any[] = [];
  selectedJoineeImages: File[] = [];
  employeeSearch = '';

  // Statistics
  stats = {
    employees: 125,
    present: 118,
    onLeave: 7,
    departments: 8
  };

  // Charts data
  employeeDistribution = {
    labels: ['Sales', 'Marketing', 'HR', 'Development', 'Finance', 'Operations', 'Support', 'R&D'],
    data: [15, 12, 8, 45, 10, 20, 10, 5]
  };

  employeeDistributionData = {
    labels: this.employeeDistribution.labels,
    datasets: [{
      data: this.employeeDistribution.data,
      backgroundColor: [
        '#4a90e2', '#57c87b', '#f4a261', '#a78bfa',
        '#ff6b6b', '#45aaf2', '#fd9644', '#26de81'
      ]
    }]
  };

  attendanceOverview: ChartConfiguration<'line'>['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Present',
        data: [110, 115, 105, 118, 112, 40, 5],
        borderColor: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Absent',
        data: [15, 10, 20, 7, 13, 85, 120],
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  // Employee list
  employeeList = [
    { name: 'Shraddha Meshram', dept: 'Development', title: 'Software Engineer', status: 'Active' },
    { name: 'Rani Sharma', dept: 'Marketing', title: 'Marketing Manager', status: 'Active' },
    { name: 'Ritesh Gupta', dept: 'HR', title: 'HR Specialist', status: 'Inactive' },
    { name: 'Akshay Kumar', dept: 'Sales', title: 'Sales Representative', status: 'Active' }
  ];

  private readonly API_URL = 'http://localhost:5000/api/employees';
  private readonly STORAGE_KEY = 'admin_dashboard_data';

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
    this.loadDashboardData();
    this.loadLocalData();
    this.loadNotifications();
  }

  private loadLocalData(): void {
    const savedData = localStorage.getItem(this.STORAGE_KEY);
    if (savedData) {
      const data = JSON.parse(savedData);
      this.feedItems = data.feedItems?.map((item: any) => ({
        text: item.text,
        date: new Date(item.date)
      })) || [];
      this.reminders = data.reminders?.map((reminder: any) => ({
        ...reminder,
        date: new Date(reminder.date)
      })) || [];
    }
  }

  private saveLocalData(): void {
    const data = {
      feedItems: this.feedItems,
      reminders: this.reminders
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  // Notification methods
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.markNotificationsAsRead();
    }
  }

  loadNotifications(): void {
    const headers = this.createAuthHeaders();
    this.http.get<any>(`${this.API_URL}/notifications`, { headers }).subscribe({
      next: (res) => {
        this.notifications = res?.notifications || [];
        this.unreadNotificationsCount = this.notifications.filter(n => !n.isRead).length;
      },
      error: (err) => console.error('Error loading notifications:', err),
    });
  }

  markNotificationsAsRead(): void {
    const headers = this.createAuthHeaders();
    this.http.post(`${this.API_URL}/notifications/mark-as-read`, {}, { headers }).subscribe({
      next: () => {
        this.notifications = this.notifications.map(notification => ({
          ...notification,
          isRead: true
        }));
        this.unreadNotificationsCount = 0;
      },
      error: (err) => console.error('Error marking notifications as read:', err),
    });
  }

  getTitlePrefix(): string {
    if (!this.gender) return '';
    const genderLower = this.gender.toLowerCase();
    if (genderLower === 'male') return 'Mr.';
    if (genderLower === 'female') return 'Ms.';
    return '';
  }

  private loadDashboardData(): void {
    this.http.get<any>('http://localhost:5000/api/admin-dashboard/public').subscribe({
      next: (data) => {
        this.welcomeMessage = data?.welcomeMessage || '';
        this.newsItems = data?.newsItems || [];
        this.empDocuments = data?.empDocuments || [];
        this.todoItems = data?.todoItems || [];
        this.newJoinees = data?.newJoinees || [];
        this.documents = data?.documents || [];
      },
      error: (err) => console.error('Error fetching dashboard data:', err)
    });
  }

  saveDashboardData(): void {
    const data = {
      welcomeMessage: this.welcomeMessage,
      newsItems: this.newsItems,
      empDocuments: this.empDocuments,
      todoItems: this.todoItems,
      newJoinees: this.newJoinees,
      documents: this.documents
    };

    this.http.put<any>('http://localhost:5000/api/admin-dashboard', data).subscribe({
      next: () => console.log('Dashboard data saved'),
      error: (err) => console.error('Error saving dashboard:', err)
    });
  }

  // Employee management
  get filteredEmployeeList() {
    return this.employeeSearch 
      ? this.employeeList.filter(emp => 
          emp.name.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
          emp.dept.toLowerCase().includes(this.employeeSearch.toLowerCase()) ||
          emp.title.toLowerCase().includes(this.employeeSearch.toLowerCase())
        )
      : this.employeeList;
  }

  editEmployee(emp: any): void {
    console.log('Editing employee:', emp);
  }

  deleteEmployee(emp: any): void {
    if (confirm(`Delete ${emp.name}?`)) {
      this.employeeList = this.employeeList.filter(e => e !== emp);
    }
  }

  addEmployee(): void {
    this.employeeList.push({ 
      name: 'New Employee', 
      dept: 'Department', 
      title: 'Position', 
      status: 'Active' 
    });
  }

  toggleEmployeeEdit(): void {
    this.editingEmployees = !this.editingEmployees;
  }

  // User profile methods
  private loadUserInfo(): void {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
    } else {
      this.fetchUserProfile();
    }
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
      error: (err) => console.error('Error fetching user profile:', err),
    });
  }

  private getEmployeeDetails(): void {
    const headers = this.createAuthHeaders();
    this.http.get<any>(`${this.API_URL}/profile`, { headers }).subscribe({
      next: (res) => {
        const emp = res?.employee;
        if (!emp) return;

        this.emp = emp;
        this.employeeName = emp.name || 'Employee';
        this.employeeCode = emp.employeeCode || 'N/A';
        this.branch = emp.branch || 'N/A';
        this.department = emp.department || 'N/A';
        this.email = emp.email || 'N/A';
        this.projectType = emp.projectType || 'N/A';
        this.joiningDate = this.formatDate(emp.joiningDate);
        this.dob = this.formatDate(emp.dateOfBirth);

        this.imageUrl = emp.image?.startsWith('http')
          ? emp.image
          : emp.image
            ? `${this.API_URL}/${emp.image}`
            : 'assets/employee (1).png';
      },
      error: (err) => console.error('Error fetching employee details:', err),
    });
  }

  private initClock(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  private updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
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
    this.http.get<any>(`${this.API_URL}/upcoming-birthdays`, { headers }).subscribe({
      next: (response) => {
        if (response?.success) {
          this.upcomingBirthdays = this.filterUpcomingBirthdays(response.upcomingBirthdays || []);
        }
      },
      error: (err) => console.error('Error fetching birthdays:', err)
    });
  }

  private filterUpcomingBirthdays(employees: any[]): any[] {
    const today = new Date();
    return employees.filter(emp => {
      const empBirthday = new Date(emp.dateOfBirth);
      empBirthday.setFullYear(today.getFullYear());
      return empBirthday >= today;
    }).slice(0, 5);
  }

  private fetchEmployees(): void {
    const headers = this.createAuthHeaders();
    this.http.get<any>(`${this.API_URL}`, { headers }).subscribe({
      next: (res) => {
        const employees: any[] = res?.employees || [];
        const loggedInEmpID = this.authService.getEmployeeId();
        this.filteredEmployees = employees.filter((emp: any) => emp.empID !== loggedInEmpID);
      },
      error: (err) => console.error('Error fetching employees:', err),
    });
  }

  // Edit section methods
  toggleEdit(section: string): void {
    switch(section) {
      case 'welcome':
        this.editingWelcome = !this.editingWelcome;
        if (!this.editingWelcome) {
          localStorage.setItem('username', this.username);
          localStorage.setItem('welcomeMessage', this.welcomeMessage);
        }
        break;
      case 'news':
        this.editingNews = !this.editingNews;
        if (!this.editingNews) this.saveDashboardData();
        break;
      case 'documents':
        this.editingDocuments = !this.editingDocuments;
        if (!this.editingDocuments) this.saveDashboardData();
        break;
      case 'reminders':
        this.editingReminders = !this.editingReminders;
        if (!this.editingReminders) this.saveLocalData();
        break;
      case 'feed':
        this.editingFeed = !this.editingFeed;
        if (!this.editingFeed) this.saveLocalData();
        break;
      case 'empDocuments':
        this.editingEmpDocuments = !this.editingEmpDocuments;
        if (!this.editingEmpDocuments) this.saveDashboardData();
        break;
      case 'todo':
        this.editingTodo = !this.editingTodo;
        if (!this.editingTodo) this.saveDashboardData();
        break;
      case 'joinee':
        this.editingJoinee = !this.editingJoinee;
        if (!this.editingJoinee) this.saveDashboardData();
        break;
    }
  }

  // News methods
  addNewsItem(): void {
    if (this.newsText.trim()) {
      this.newsItems.unshift(this.newsText);
      this.newsText = '';
      this.saveDashboardData();
    }
  }

  deleteNewsItem(index: number): void {
    this.newsItems.splice(index, 1);
    this.saveDashboardData();
  }

  // Document methods
  onDocumentUpload(event: any): void {
    this.selectedDocuments = Array.from(event.target.files);
  }

  uploadDocuments(): void {
    if (this.selectedDocuments.length > 0) {
      this.selectedDocuments.forEach(file => {
        this.documents.push({ name: file.name, file: file });
      });
      this.selectedDocuments = [];
      this.saveDashboardData();
    }
  }

  deleteDocument(doc: any): void {
    this.documents = this.documents.filter(d => d.name !== doc.name);
    this.saveDashboardData();
  }

  // Reminder methods
  addReminder(): void {
    this.reminders.unshift({ 
      title: 'New reminder', 
      date: new Date().toISOString().split('T')[0],
      type: 'General',
      notes: ''
    });
  }

  removeReminder(index: number): void {
    this.reminders.splice(index, 1);
    this.saveLocalData();
  }

  // Feed methods
  addFeedItem(): void {
    if (this.feedText.trim()) {
      this.feedItems.unshift({
        text: this.feedText,
        date: new Date()
      });
      this.feedText = '';
      this.saveLocalData();
    }
  }

  deleteFeedItem(index: number): void {
    this.feedItems.splice(index, 1);
    this.saveLocalData();
  }

  // Employee document methods
  onEmpDocumentUpload(event: any): void {
    this.selectedEmpDocuments = Array.from(event.target.files);
  }

  uploadEmpDocuments(): void {
    if (this.selectedEmpDocuments.length > 0) {
      this.selectedEmpDocuments.forEach(file => {
        this.empDocuments.push({ name: file.name, file: file });
      });
      this.selectedEmpDocuments = [];
      this.saveDashboardData();
    }
  }

  deleteEmpDocument(doc: any): void {
    this.empDocuments = this.empDocuments.filter(d => d.name !== doc.name);
    this.saveDashboardData();
  }

  // Todo methods
  addTodoItem(): void {
    this.todoItems.unshift({ task: 'New task', completed: false });
  }

  removeTodoItem(index: number): void {
    this.todoItems.splice(index, 1);
    this.saveDashboardData();
  }

  // Joinee methods
  addJoinee(): void {
    this.newJoinees.unshift({ 
      name: 'New Employee', 
      joinDate: new Date().toISOString().split('T')[0], 
      imageUrl: 'assets/employee (1).png' 
    });
  }

  removeJoinee(index: number): void {
    this.newJoinees.splice(index, 1);
    this.saveDashboardData();
  }

  onJoineeImageChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newJoinees[index].imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Filter methods
  get filteredDocuments(): any[] {
    return this.documentSearch 
      ? this.documents.filter(doc => doc.name.toLowerCase().includes(this.documentSearch.toLowerCase()))
      : this.documents;
  }

  get filteredEmpDocuments(): any[] {
    return this.empDocumentSearch 
      ? this.empDocuments.filter(doc => doc.name.toLowerCase().includes(this.empDocumentSearch.toLowerCase()))
      : this.empDocuments;
  }

  // Utility methods
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleProfile(): void {
    this.showProfile = !this.showProfile;
  }

  onLogoChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.emp.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}