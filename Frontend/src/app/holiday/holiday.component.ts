import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-holiday',
  imports: [CommonModule, NgFor],
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.css']
})
export class Holiday implements OnInit {
  // Define the correct month order
  monthOrder = [
    'January', 'February', 'March', 'April', 
    'May', 'June', 'July', 'August', 
    'September', 'October', 'November', 'December'
  ];

  // List of official holidays for all months
  holidays: { date: Date, name: string }[] = [
    // January
    { date: new Date('2025-01-01'), name: 'New Year\'s Day' },
    { date: new Date('2025-01-14'), name: 'Pongal' },
    { date: new Date('2025-01-26'), name: 'Republic Day' },
    
    // February
    { date: new Date('2025-02-14'), name: 'Valentine\'s Day' },
    { date: new Date('2025-02-19'), name: 'Shivaji Jayanti' },
    
    // March
    { date: new Date('2025-03-08'), name: 'International Women\'s Day' },
    { date: new Date('2025-03-14'), name: 'Maha Shivaratri' },
    { date: new Date('2025-03-25'), name: 'Holi' },
    { date: new Date('2025-03-29'), name: 'Good Friday' },
    
    // April
    { date: new Date('2025-04-01'), name: 'April Fool\'s Day' },
    { date: new Date('2025-04-09'), name: 'Shraddha bday' },
    { date: new Date('2025-04-14'), name: 'Tamil New Year' },
    { date: new Date('2025-04-21'), name: 'Ram Navami' },
    
    // May
    { date: new Date('2025-05-01'), name: 'Labour Day' },
    { date: new Date('2025-05-12'), name: 'Eid-ul-Fitr' },
    
    // June
    { date: new Date('2025-06-17'), name: 'Bakri Eid' },
    { date: new Date('2025-06-21'), name: 'International Yoga Day' },
    
    // July
    { date: new Date('2025-07-04'), name: 'American Independence Day' },
    { date: new Date('2025-07-17'), name: 'Muharram' },
    
    // August
    { date: new Date('2025-08-15'), name: 'Independence Day' },
    { date: new Date('2025-08-19'), name: 'Raksha Bandhan' },
    { date: new Date('2025-08-26'), name: 'Janmashtami' },
    
    // September
    { date: new Date('2025-09-02'), name: 'Ganesh Chaturthi' },
    { date: new Date('2025-09-10'), name: 'Onam' },
    
    // October
    { date: new Date('2025-10-02'), name: 'Gandhi Jayanti' },
    { date: new Date('2025-10-08'), name: 'Dussehra' },
    { date: new Date('2025-10-31'), name: 'Halloween' },
    
    // November
    { date: new Date('2025-11-01'), name: 'Diwali' },
    { date: new Date('2025-11-11'), name: 'Veterans Day' },
    { date: new Date('2025-11-28'), name: 'Thanksgiving' },
    
    // December
    { date: new Date('2025-12-25'), name: 'Christmas' },
    { date: new Date('2025-12-31'), name: 'New Year\'s Eve' }
  ];

  groupedHolidays: { [month: string]: { date: Date; name: string }[] } = {};
  orderedMonths: string[] = [];

  ngOnInit(): void {
    this.groupHolidaysByMonth();
  }

  groupHolidaysByMonth() {
    // First group the holidays by month
    this.groupedHolidays = this.holidays.reduce((acc, holiday) => {
      const month = holiday.date.toLocaleString('default', { month: 'long' });
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(holiday);
      return acc;
    }, {} as { [month: string]: { date: Date; name: string }[] });

    // Sort holidays within each month by date
    for (const month in this.groupedHolidays) {
      this.groupedHolidays[month].sort((a, b) => a.date.getTime() - b.date.getTime());
    }

    // Create ordered months array based on our predefined order
    this.orderedMonths = this.monthOrder.filter(month => this.groupedHolidays[month]);
  }
}