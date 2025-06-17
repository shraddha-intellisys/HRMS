import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AttendanceService } from '../services/attendance.service'; 
import { HttpClient } from '@angular/common/http';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-attendance-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './attendance-application.component.html',
  styleUrls: ['./attendance-application.component.css']
})
export class AttendanceApplicationComponent implements OnInit {
  attendanceForm: FormGroup;
  employeeName: string = 'Shraddha';
  employeeCode: string = 'SM123';
  isSubmitting: boolean = false;
  isTimeBasisSelected: boolean = false;
  isDayBasisSelected: boolean = true;

  attendanceData = [
    {
      date: new Date(),
      roster: 'Morning',
      muster: 'Present',
      inTime: '09:00 AM',
      outTime: '06:00 PM',
      otHours: '1',
      totalHours: '9',
      lateMarks: '0',
      lateHours: '00:00',
      departureMark: 'On Time',
      departureHours: '0'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private attendanceService: AttendanceService
  ) {
    this.attendanceForm = this.createForm();
  }

  ngOnInit(): void {
    this.onBasisChange(this.attendanceForm.get('attendanceBasis')?.value);
  }

  createForm(): FormGroup {
    return this.fb.group({
      applicationDate: [new Date().toISOString().substring(0, 10), Validators.required],
      applicationType: ['casual', Validators.required],
      leaveType: ['full', Validators.required],
      reason: ['', Validators.required],
      remarks: [''],
      ccTo: ['', [Validators.email]],
      attendanceBasis: ['day', Validators.required],
      startTime: [''],
      endTime: [''],
      fromDate: [new Date().toISOString().substring(0, 10)],
      toDate: [new Date().toISOString().substring(0, 10)],
      fromHalf: [false],
      firstHalf: [false],
      secondHalf: [false],
    });
  }

  onBasisChange(basis: string): void {
    this.isTimeBasisSelected = basis === 'time';
    this.isDayBasisSelected = basis === 'day';

    if (this.isTimeBasisSelected) {
      this.attendanceForm.get('startTime')?.setValidators([Validators.required]);
      this.attendanceForm.get('endTime')?.setValidators([Validators.required]);
      this.attendanceForm.get('fromDate')?.clearValidators();
      this.attendanceForm.get('toDate')?.clearValidators();
    } else {
      this.attendanceForm.get('startTime')?.clearValidators();
      this.attendanceForm.get('endTime')?.clearValidators();
      this.attendanceForm.get('fromDate')?.setValidators([Validators.required]);
      this.attendanceForm.get('toDate')?.setValidators([Validators.required]);
    }

    this.updateValidations();
  }

  private updateValidations(): void {
    const fields = ['startTime', 'endTime', 'fromDate', 'toDate'];
    fields.forEach(field => this.attendanceForm.get(field)?.updateValueAndValidity());
  }

  onSubmit() {
    if (this.attendanceForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const applicationData = {
      employeeName: this.employeeName,
      employeeCode: this.employeeCode,
      ...this.attendanceForm.value
    };

    this.http.post('http://localhost:5000/api/attendance-application', applicationData)
      .subscribe({
        next: (res) => {
          console.log('Application submitted successfully:', res);
          alert('Application submitted successfully');
          this.resetForm();
        },
        error: (err) => {
          console.error('Error submitting application:', err);
          alert('Error submitting application');
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
  }

  resetForm(): void {
    // Reset form while preserving employee info and default values
    this.attendanceForm.reset({
      applicationDate: new Date().toISOString().substring(0, 10),
      applicationType: 'casual',
      leaveType: 'full',
      attendanceBasis: 'day',
      fromDate: new Date().toISOString().substring(0, 10),
      toDate: new Date().toISOString().substring(0, 10),
      fromHalf: false,
      firstHalf: false,
      secondHalf: false,
      remarks: '',
      ccTo: ''
    });
    
    // Clear validation errors
    Object.keys(this.attendanceForm.controls).forEach(key => {
      this.attendanceForm.get(key)?.setErrors(null);
    });
    
    // Reset basis selection
    this.onBasisChange('day');
  }

  onCancel(): void {
    this.resetForm();
  }

  // Calendar related methods remain the same
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,today,prevYear',
      center: 'title',
      right: 'nextYear,dayGridMonth,timeGridWeek,next',
    },
    height: 500,
    contentHeight: 'auto',
    aspectRatio: 1.5,
    events: [],  
    dateClick: this.onDateClick.bind(this), 
  };
  
  onDateClick(event: any): void {
    const selectedDate = event.dateStr; 
    console.log('Date clicked:', selectedDate);
    this.submitAttendance(selectedDate);
  
    const newEvent = {
      applicationDate: selectedDate,
      status: 'Manually Updated', 
    };
    this.updateCalendar([newEvent]);
  }
  
  submitAttendance(selectedDate: any) {
    this.http.post('http://localhost:5000/api/attendance-application', { 
      employeeCode: this.employeeCode, 
      applicationDate: selectedDate 
    }).subscribe(
      (response) => {
        console.log('Attendance Submitted:', response);
      },
      (error) => {
        console.error('Error submitting attendance:', error);
      }
    );
  }

  fetchUpdatedEvents(): void {
    this.http.get<any[]>('http://localhost:5000/api/attendance-events')  
      .subscribe({
        next: (events: any[]) => {
          console.log('Fetched Updated Events:', events);
          this.updateCalendar(events);  
        },
        error: (err: any) => {
          console.error('Error fetching events:', err);
        }
      });
  }
  
  updateCalendar(events: any[]): void {
    const updatedEvents = events.map(event => ({
      title: event.status || 'Manually Updated',
      start: event.applicationDate,
      backgroundColor: '#FF5722',
      display: 'auto',
    }));

    this.calendarOptions = {
      ...this.calendarOptions,
      events: updatedEvents,
    };
  }
}