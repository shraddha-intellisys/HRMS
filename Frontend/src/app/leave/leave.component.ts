import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

/** Custom validator to check if the date is in the future */
export const futureDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (!value) return null;
  const inputDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate > today ? null : { notFutureDate: true };
};

@Component({
  selector: 'app-leave',
  standalone: true,
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class LeaveComponent implements OnInit {
  leaveForm!: FormGroup;
  employeeName = 'Shraddha';
  employeeCode = 'SM123';
  static submitLeave: any;

  minDate: string = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
  this.leaveForm = this.fb.group({
    employeeName: [this.employeeName, Validators.required],  // <-- pre-filled
    employeeCode: [this.employeeCode, Validators.required],  // <-- pre-filled
    applicationDate: ['', Validators.required],
    applicationType: ['', Validators.required],
    leaveType: ['', Validators.required],
    fromDate: ['', [Validators.required, futureDateValidator]],
    fromHalf: [false],
    firstHalfFrom: [false],
    secondHalfFrom: [false],
    toDate: ['', [Validators.required, futureDateValidator]],
    toHalf: [false],
    firstHalfTo: [false],
    reason: ['', Validators.required],
    remarks: [''],
    ccTo: ['', [Validators.email]]
  });
}

  submitLeave(): void {
  if (this.leaveForm.invalid) {
    alert('Please fill all required fields.');
    return;
  }

  const formValue = this.leaveForm.value;

  // Map employeeName & employeeCode to backend expected fields
  const formData = {
    empName: formValue.employeeName,
    empId: formValue.employeeCode,
    applicationDate: formValue.applicationDate,
    applicationType: formValue.applicationType,
    leaveType: formValue.leaveType,
    fromDate: formValue.fromDate,
    fromHalf: formValue.fromHalf,
    firstHalfFrom: formValue.firstHalfFrom,
    secondHalfFrom: formValue.secondHalfFrom,
    toDate: formValue.toDate,
    toHalf: formValue.toHalf,
    firstHalfTo: formValue.firstHalfTo,
    reason: formValue.reason,
    remarks: formValue.remarks,
    ccTo: formValue.ccTo,
    status: 'Pending'
  };

  this.http.post('http://localhost:5000/api/leave/submit', formData).subscribe({
    next: () => {
      alert('Leave submitted successfully!');
      this.leaveForm.reset();
    },
    error: (err) => {
      console.error('Error submitting leave:', err);
      alert('Submission failed.');
    }
  });
}


  cancelLeave(): void {
    this.leaveForm.reset();
  }
}
