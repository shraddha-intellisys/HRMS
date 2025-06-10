

import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports :[CommonModule , FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  isEditing = true;
  submitted = false;

  profileData = {
    name: 'John Doe',
    employeeCode: 'EMP001',
    location: 'Pune',
    department: 'Development',
    manager: 'Jane Smith',
    joiningDate: '2022-01-01',
    salary: '60000',
    panNumber: 'ABCDE1234F',
    aadharNumber: '123456789012',
    previousMemberId: 'PRV001',
    epsJoiningDate: '2022-01-01',
    epsExitDate: '2023-01-01',
    esicNo: 'ESIC12345',
    epsNo: 'EPS98765',
    branch: 'HQ',
    grade: 'A',
    designation: 'Software Engineer',
    employeeCategory: 'Permanent',
    projectType: 'Internal',
    imageUrl: ''
  };

  constructor() {
    this.loadProfileData();
  }

  submitprofile(form: NgForm) {
    if (form.valid) {
      localStorage.setItem('employeeProfile', JSON.stringify(this.profileData));
    alert('Data submitted successfully!'); // <-- ADD THIS LINE
    form.resetForm(); // optional: reset form after success
    }
  }

  canceledit(form: NgForm) {
    form.resetForm(); // Clear the form
    this.submitted = false;
    localStorage.removeItem('employeeProfile'); // Optional: Clear saved data
  }

  loadProfileData() {
    const savedProfile = localStorage.getItem('employeeProfile');
    if (savedProfile) {
      this.profileData = JSON.parse(savedProfile);
    }
  }
}