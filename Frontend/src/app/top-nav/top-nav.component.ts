import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent {
  // Menu toggle for hamburger
  isMenuOpen: boolean = false;

  // User role
  role: string = 'user';

  // Dropdown state for each menu section
  isDropdownOpen = {
    home: false,
    profile: false,
    payroll: false
  };

  // Notification properties
  showNotifications = false;
  notifications: any[] = [];
  unreadNotificationsCount = 0;
  private readonly API_URL = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  // Toggle hamburger menu
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateAndClose(): void {
    this.isMenuOpen = false;
  }

  // Toggle dropdown menus
  toggleDropdown(section: keyof typeof this.isDropdownOpen): void {
    this.isDropdownOpen[section] = !this.isDropdownOpen[section];
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

  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}