import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

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

  // User role (dummy default for testing, you can update from backend)
  role: string = 'user';  // Set to 'admin' or 'user' based on login

  // Dropdown state for each menu section
  isDropdownOpen = {
    home: false,
    profile: false,
    payroll: false
  };

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
}
