

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // ✅ Import RouterModule
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee-profile',
  standalone: true, // ✅ Ensure this is marked if you're using standalone
  imports: [FormsModule, CommonModule, RouterModule], // ✅ Add RouterModule
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent {
  searchQuery: string = '';
  
  employees = [
    { sr: 1, name: 'John Doe', empId: 'EMP001', phone: '9876543210', joiningDate: '2022-01-01', role: 'Developer' },
    { sr: 2, name: 'Jane Smith', empId: 'EMP002', phone: '9876543211', joiningDate: '2021-06-10', role: 'HR' },
    { sr: 3, name: 'Sam Wilson', empId: 'EMP003', phone: '9876543212', joiningDate: '2020-03-15', role: 'Designer' }
  ];

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
