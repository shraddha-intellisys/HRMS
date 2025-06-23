import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-payslip',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [EmployeeService], // Optional if already provided globally
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.css']
})
export class PayslipComponent implements OnInit {
  searchQuery = '';
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  employees: { empId: string; name: string; role: string }[] = [];
  filteredEmployees: typeof this.employees = [];

  selectedMonths: { [key: string]: string | null | undefined } = {};
  selectedFiles: { [key: string]: File | null } = {};
  fileInputs: { [key: string]: ElementRef<HTMLInputElement> } = {};

  constructor(
    private http: HttpClient,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.fetchEmployeesFromDatabase();
  }

  fetchEmployeesFromDatabase() {
    this.employeeService.getAllEmployees().subscribe({
      next: (response: any[]) => {
        this.employees = response.map((emp: any) => ({
          empId: emp.employeeCode,
          name: emp.name,
          role: emp.designation || '-'
        }));
        this.filteredEmployees = [...this.employees];
      },
      error: (err) => {
        console.error('Failed to load employees for payroll:', err);
      }
    });
  }

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

    if (!month || !file) {
      alert('Please select a month and upload a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('empId', empId);
    formData.append('month', month);
    formData.append('payslip', file);

    this.http.post('http://localhost:5000/api/payslips/upload', formData).subscribe({
      next: () => {
        alert('Payslip uploaded successfully');
        this.selectedMonths[empId] = undefined;
        this.selectedFiles[empId] = null;

        if (this.fileInputs[empId]) {
          this.fileInputs[empId].nativeElement.value = '';
        }
      },
      error: (err) => {
        console.error('Error uploading:', err);
        alert('Upload failed');
      }
    });
  }
}
