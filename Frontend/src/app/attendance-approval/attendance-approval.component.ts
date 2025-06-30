import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface AttendanceRequest {
  _id: any;
  empId: any;
  employeeName: string;
  employeeCode: string;
  expanded: boolean;
  applicationDate?: string;
  applicationType?: string;
  type?: string;
  leaveType?: string;
  reason?: string;
  remarks?: string;
  ccTo?: string;
  attendanceBasis?: string;
  fromDate?: string;
  toDate?: string;
  fromHalf?: string;
  toHalf?: string;
  startTime?: string;
  endTime?: string;
}

interface CalendarDay {
  date?: number;
  fullDate?: Date;
  isHoliday?: boolean;
  holidayName?: string;
  holidayReason?: string;
  approved?: boolean;
  isSunday?: boolean;
}

interface Holiday {
  _id?: string;
  date: Date;
  name: string;
  reason: string;
  approved: boolean;
}

@Component({
  selector: 'app-attendance-approval',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './attendance-approval.component.html',
  styleUrls: ['./attendance-approval.component.css']
})
export class AttendanceApprovalComponent implements OnInit {
  requests: AttendanceRequest[] = [];
  holidays: Holiday[] = [];

  dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  currentDate = new Date();
  currentMonth = this.currentDate.toLocaleString('default', { month: 'long' });
  currentYear = this.currentDate.getFullYear();
  calendarDays: CalendarDay[] = [];
  selectedDate: CalendarDay | null = null;
  editingHoliday = false;
  editingHolidayName = '';
  editingHolidayReason = '';
  

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAttendanceRequests();
    this.fetchHolidays();
  }

  fetchHolidays() {
    this.http.get<Holiday[]>('http://localhost:5000/api/holidays/all').subscribe({
      next: (data) => {
        this.holidays = data.map(h => ({ ...h, date: new Date(h.date) }));
        this.generateCalendar();
      },
      error: (err) => console.error('❌ Error fetching holidays:', err)
    });
  }

  fetchAttendanceRequests(): void {
    this.http.get<AttendanceRequest[]>('http://localhost:5000/api/attendance-application/pending').subscribe({
      next: (data) => {
        this.requests = data.map(r => ({ ...r, expanded: false }));
      },
      error: (err) => {
        console.error('❌ Error fetching attendance:', err);
      }
    });
  }

  toggleRequest(index: number) {
    this.requests[index].expanded = !this.requests[index].expanded;
  }

  accept(index: number) {
    const request = this.requests[index];
    this.http.put('http://localhost:5000/api/attendance-application/approve', {
      id: request._id
    }).subscribe({
      next: () => {
        console.log('✅ Approved');
        this.requests.splice(index, 1);
      },
      error: (err) => console.error('❌ Error approving request:', err)
    });
  }

  reject(index: number): void {
    const request = this.requests[index];
    this.http.put('http://localhost:5000/api/attendance-application/reject', {
      id: request._id
    }).subscribe({
      next: () => {
        console.log('❌ Rejected');
        this.requests.splice(index, 1);
      },
      error: (err) => console.error('❌ Error rejecting:', err)
    });
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    this.calendarDays = [];
    
    // Add empty days for the first week
    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push({});
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const isSunday = currentDate.getDay() === 0;
      
      const holiday = this.holidays.find(h =>
        h.date.getDate() === currentDate.getDate() &&
        h.date.getMonth() === currentDate.getMonth() &&
        h.date.getFullYear() === currentDate.getFullYear()
      );
      
      this.calendarDays.push({
        date: i,
        fullDate: currentDate,
        isHoliday: !!holiday || isSunday,
        holidayName: holiday?.name || (isSunday ? 'Sunday (Official Holiday)' : undefined),
        holidayReason: holiday?.reason || (isSunday ? 'Weekly off' : undefined),
        approved: holiday?.approved || isSunday,
        isSunday: isSunday
      });
    }
  }

  prevMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.updateCalendarHeaders();
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.updateCalendarHeaders();
    this.generateCalendar();
  }

  updateCalendarHeaders() {
    this.currentMonth = this.currentDate.toLocaleString('default', { month: 'long' });
    this.currentYear = this.currentDate.getFullYear();
  }

  selectDate(day: CalendarDay) {
    if (day.date) {
      this.selectedDate = day;
      this.editingHoliday = false;
    }
  }

  startEditing() {
    if (!this.selectedDate) return;
    this.editingHoliday = true;
    this.editingHolidayName = this.selectedDate.holidayName || '';
    this.editingHolidayReason = this.selectedDate.holidayReason || '';
  }

  saveHoliday() {
    if (!this.editingHolidayName.trim() || !this.selectedDate || !this.selectedDate.fullDate) return;

    const holidayData = {
      date: this.selectedDate.fullDate,
      name: this.editingHolidayName,
      reason: this.editingHolidayReason,
      approved: false
    };

    const existingHoliday = this.holidays.find(h =>
      h.date.getDate() === this.selectedDate?.fullDate?.getDate() &&
      h.date.getMonth() === this.selectedDate?.fullDate?.getMonth() &&
      h.date.getFullYear() === this.selectedDate?.fullDate?.getFullYear()
    );

    if (existingHoliday && existingHoliday._id) {
      // Update existing holiday
      this.http.put(`http://localhost:5000/api/holidays/${existingHoliday._id}`, holidayData)
        .subscribe({
          next: () => {
            console.log('✅ Holiday Updated');
            this.fetchHolidays();
            this.editingHoliday = false;
          },
          error: (err) => console.error('❌ Failed to update holiday:', err)
        });
    } else {
      // Add new holiday
      this.http.post('http://localhost:5000/api/holidays/add', holidayData)
        .subscribe({
          next: () => {
            console.log('✅ Holiday Saved');
            this.fetchHolidays();
            this.editingHoliday = false;
          },
          error: (err) => console.error('❌ Failed to save holiday:', err)
        });
    }
  }

  cancelEditing() {
    this.editingHoliday = false;
  }

  approveHoliday() {
    if (!this.selectedDate || !this.selectedDate.fullDate || this.selectedDate.isSunday) return;
    
    const holiday = this.holidays.find(h =>
      h.date.getDate() === this.selectedDate?.fullDate?.getDate() &&
      h.date.getMonth() === this.selectedDate?.fullDate?.getMonth() &&
      h.date.getFullYear() === this.selectedDate?.fullDate?.getFullYear()
    );
    
    if (holiday && holiday._id) {
      this.http.put(`http://localhost:5000/api/holidays/${holiday._id}/approve`, {})
        .subscribe({
          next: () => {
            console.log('✅ Holiday Approved');
            this.fetchHolidays();
          },
          error: (err) => console.error('❌ Failed to approve holiday:', err)
        });
    }
  }

 cancelHoliday() {
    if (!this.selectedDate || !this.selectedDate.fullDate || this.selectedDate.isSunday) {
      console.log('Cannot cancel Sunday or invalid date');
      return;
    }
    
    const holiday = this.holidays.find(h => {
      const holidayDate = new Date(h.date);
      const selectedDate = new Date(this.selectedDate!.fullDate!);
      return (
        holidayDate.getDate() === selectedDate.getDate() &&
        holidayDate.getMonth() === selectedDate.getMonth() &&
        holidayDate.getFullYear() === selectedDate.getFullYear()
      );
    });
    
    if (holiday && holiday._id) {
      if (confirm(`Are you sure you want to cancel the holiday "${holiday.name}"?`)) {
        this.http.delete(`http://localhost:5000/api/holidays/${holiday._id}`)
          .subscribe({
            next: () => {
              console.log('Holiday Cancelled');
              // Remove the holiday from local state
              this.holidays = this.holidays.filter(h => h._id !== holiday._id);
              
              // Update the calendar
              this.generateCalendar();
              
              // Reset the selected date
              if (this.selectedDate) {
                this.selectedDate = {
                  ...this.selectedDate,
                  isHoliday: false,
                  holidayName: undefined,
                  holidayReason: undefined,
                  approved: false
                };
              }
            },
            error: (err) => {
              console.error('Failed to cancel holiday:', err);
              if (err.status === 404) {
                // If holiday not found, update UI anyway
                this.holidays = this.holidays.filter(h => h._id !== holiday._id);
                this.generateCalendar();
                if (this.selectedDate) {
                  this.selectedDate.isHoliday = false;
                }
              } else {
                alert('Failed to cancel holiday. Please try again.');
              }
            }
          });
      }
    } else {
      console.log('No holiday found to cancel');
      alert('No holiday found to cancel');
    }
  }

  getDayClass(day: CalendarDay): string {
    if (!day.date) return 'empty-day';
    
    let classes = 'calendar-day';
    if (day.isSunday) classes += ' sunday';
    if (day.isHoliday && !day.isSunday) classes += day.approved ? ' holiday-approved' : ' holiday';
    
    return classes;
  }
}