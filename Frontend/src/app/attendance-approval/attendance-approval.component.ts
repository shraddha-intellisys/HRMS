import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface AttendanceRequest {
  empName: string;
  empId: string;
  expanded: boolean;
  applicationDate?: string;
  applicationType?: string;
  type?: string;  // ✅ Add this line
  leaveType?: string;
  reason?: string;
  remarks?: string;
  ccTo?: string;
  attendanceBasis?: string;
  fromDate?: string;
  toDate?: string;
  fromHalf?: string;
  toHalf?: string;
  fromTime?: string;
  toTime?: string;
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
}

interface Holiday {
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

  dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  currentDate = new Date();
  currentMonth = this.currentDate.toLocaleString('default', { month: 'long' });
  currentYear = this.currentDate.getFullYear();
  calendarDays: CalendarDay[] = [];
  selectedDate: CalendarDay | null = null;
  editingHoliday = false;
  editingHolidayName = '';
  editingHolidayReason = '';

  holidays: Holiday[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAttendanceRequests();
    this.generateCalendar();
  }

  fetchAttendanceRequests(): void {
    this.http.get<AttendanceRequest[]>('http://localhost:5000/api/attendance-application/pending')
      .subscribe({
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
  empId: request.empId,
  applicationDate: request.applicationDate,
  startTime: request.fromTime,
  endTime: request.toTime,
  employeeName: request.empName
}).subscribe({
  next: () => {
    console.log('✅ Approved');
    this.requests.splice(index, 1); // remove from pending UI
  },
  error: (err) => {
    console.error('❌ Error approving request:', err);
  }
});
  }

  reject(index: number) {
    const request = this.requests[index];
    this.http.put('http://localhost:5000/api/attendance-application/reject', {
      empId: request.empId,
      applicationDate: request.applicationDate
    }).subscribe({
      next: () => {
        console.log('❌ Rejected request:', request);
        this.requests.splice(index, 1);
      },
      error: (err) => {
        console.error('❌ Error rejecting request:', err);
      }
    });
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    this.calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push({});
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const holiday = this.holidays.find(h =>
        h.date.getDate() === currentDate.getDate() &&
        h.date.getMonth() === currentDate.getMonth() &&
        h.date.getFullYear() === currentDate.getFullYear()
      );

      this.calendarDays.push({
        date: i,
        fullDate: currentDate,
        isHoliday: !!holiday,
        holidayName: holiday?.name,
        holidayReason: holiday?.reason,
        approved: holiday?.approved
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
    }
  }

  startEditing() {
    this.editingHoliday = true;
    this.editingHolidayName = this.selectedDate?.holidayName || '';
    this.editingHolidayReason = this.selectedDate?.holidayReason || '';
  }

  saveHoliday() {
    if (this.editingHolidayName.trim() && this.selectedDate) {
      const holidayIndex = this.holidays.findIndex(h =>
        h.date.getDate() === this.selectedDate?.fullDate?.getDate() &&
        h.date.getMonth() === this.selectedDate?.fullDate?.getMonth() &&
        h.date.getFullYear() === this.selectedDate?.fullDate?.getFullYear()
      );

      const newHoliday: Holiday = {
        date: new Date(this.selectedDate.fullDate!),
        name: this.editingHolidayName,
        reason: this.editingHolidayReason,
        approved: holidayIndex >= 0 ? this.holidays[holidayIndex].approved : false
      };

      if (holidayIndex >= 0) {
        this.holidays[holidayIndex] = newHoliday;
      } else {
        this.holidays.push(newHoliday);
      }

      this.generateCalendar();
      this.editingHoliday = false;
      this.selectDate(this.calendarDays.find(d =>
        d.date === this.selectedDate?.date &&
        d.fullDate?.getMonth() === this.selectedDate?.fullDate?.getMonth()
      )!);
    }
  }

  cancelEditing() {
    this.editingHoliday = false;
  }

  approveHoliday() {
    if (!this.selectedDate) return;

    const holidayIndex = this.holidays.findIndex(h =>
      h.date.getDate() === this.selectedDate?.fullDate?.getDate() &&
      h.date.getMonth() === this.selectedDate?.fullDate?.getMonth() &&
      h.date.getFullYear() === this.selectedDate?.fullDate?.getFullYear()
    );

    if (holidayIndex >= 0) {
      this.holidays[holidayIndex].approved = true;
    }

    this.generateCalendar();
    console.log('Holiday approved:', this.selectedDate);
  }

  addHoliday() {
    if (!this.selectedDate) return;

    const holidayName = prompt('Enter holiday name:');
    if (holidayName) {
      const holidayReason = prompt('Enter holiday reason:');
      const newHoliday: Holiday = {
        date: new Date(this.selectedDate.fullDate!),
        name: holidayName,
        reason: holidayReason || '',
        approved: false
      };

      this.holidays.push(newHoliday);
      this.generateCalendar();
      console.log('Holiday added:', newHoliday);
    }
  }
}
