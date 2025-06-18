import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {
  isMenuOpen: boolean = false;
  role: string = '';

  isDropdownOpen = {
    home: false,
    profile: false,
    payroll: false
  };

  constructor(private elRef: ElementRef) {}

  ngOnInit() {
    this.role = localStorage.getItem('role') || '';
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateAndClose(): void {
    this.isMenuOpen = false;
  }

  toggleDropdown(section: keyof typeof this.isDropdownOpen): void {
    this.isDropdownOpen[section] = !this.isDropdownOpen[section];
  }

  // ✅ Detect clicks outside the menu to auto-close
  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    const clickedInside = this.elRef.nativeElement.contains(event.target);
    if (!clickedInside && this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }
}
