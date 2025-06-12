import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent implements OnInit {
  searchQuery: string = '';
  employees: any[] = [];

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadEmployeesFromDatabase();
  }

  loadEmployeesFromDatabase() {
    this.employeeService.getAllEmployees().subscribe({
      next: (response) => {
        this.employees = response.map((emp: any, index: number) => ({
          sr: index + 1,
          name: emp.name,
          empId: emp.employeeCode,
          phone: emp.phone || '-',
          joiningDate: this.formatDate(emp.joiningDate),
          role: emp.designation || '-'
        }));
      },
      error: (err) => {
        console.error("❌ Failed to fetch employees:", err);
      }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  }

  get filteredEmployees() {
    const query = this.searchQuery.toLowerCase();
    return this.employees.filter(emp =>
      emp.name.toLowerCase().includes(query) ||
      emp.empId.toLowerCase().includes(query) ||
      emp.phone.includes(query) ||
      emp.role.toLowerCase().includes(query)
    );
  }
}
