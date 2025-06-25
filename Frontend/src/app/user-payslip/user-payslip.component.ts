import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payslip-download',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './user-payslip.component.html',
  styleUrls: ['./user-payslip.component.css']
})
export class UserPayslipComponentComponent {
  monthControl = new FormControl('');
  private http = inject(HttpClient);

  empId: string = 'E001';   // ✅ You can fetch this dynamically from logged-in user
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  downloadPayslip() {
    const selectedMonth = this.monthControl.value;
    if (!selectedMonth) {
      alert("Please select a month");
      return;
    }

    const url = `http://localhost:5000/api/payslips/download?empId=${this.empId}&month=${selectedMonth}`;

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `Payslip-${this.empId}-${selectedMonth}.pdf`;
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
      },
      error: (error) => {
        console.error('Download error:', error);
        alert(`Payslip for ${this.empId} in ${selectedMonth} not found or server error.`);
      }
    });
  }
}
