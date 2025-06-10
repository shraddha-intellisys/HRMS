

import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payslip',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.css']
})
export class PayslipComponent {
  searchQuery = '';

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  employees = [
    { empId: 'E001', name: 'Alice', role: 'Developer' },
    { empId: 'E002', name: 'Bob', role: 'Designer' },
    { empId: 'E003', name: 'Charlie', role: 'Tester' },
  ];

  filteredEmployees = [...this.employees];

  selectedMonths: { [key: string]: string } = {};
  selectedFiles: { [key: string]: File | null } = {};
  fileInputs: { [key: string]: ElementRef<HTMLInputElement> } = {};

  onSearchChange() {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredEmployees = !query
      ? [...this.employees]
      : this.employees.filter(emp =>
          emp.name.toLowerCase().includes(query) ||
          emp.empId.toLowerCase().includes(query) ||
          emp.role.toLowerCase().includes(query)
        );
  }

  registerFileInput(empId: string, input: HTMLInputElement) {
    this.fileInputs[empId] = new ElementRef(input);
  }

  onFileSelected(event: any, empId: string) {
    const file: File = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file only.');
        this.selectedFiles[empId] = null;
        event.target.value = '';
      } else {
        this.selectedFiles[empId] = file;
      }
    }
  }

  uploadPayslip(empId: string) {
    const month = this.selectedMonths[empId];
    const file = this.selectedFiles[empId];

    // Validate both fields before proceeding
    if (!month && !file) {
      alert('Please select a month and upload a PDF file.');
      return;
    }
    if (!month) {
      alert('Please select a month.');
      return;
    }
    if (!file) {
      alert('Please upload a PDF file.');
      return;
    }

    // Show success upload message
    alert("Uploading payslip for Employee: ${empId}, Month: ${month}, File: ${file.name}");

    // Reset values
    this.selectedMonths[empId] = '';
    this.selectedFiles[empId] = null;

    // Reset file input visually
    if (this.fileInputs[empId]) {
      this.fileInputs[empId].nativeElement.value = '';
    }
  }
}