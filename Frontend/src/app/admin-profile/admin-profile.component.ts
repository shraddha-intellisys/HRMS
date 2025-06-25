import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {
  profileFormArray!: FormArray;
  editMode: boolean[] = [];
  showPassword: boolean[] = [];
  profilePhotos: (string | null)[] = [];
  defaultPhoto = 'assets/default-profile.png';
  adminNames: string[] = ['Rutik Bhosale', 'Mahesh Jadhav', 'Swapnil Deshmukh'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeEditModes();
    this.loadPhotosFromLocalStorage(); // Load saved photos on init
  }

  // Load photos from localStorage
  private loadPhotosFromLocalStorage(): void {
    const savedPhotos = localStorage.getItem('adminProfilePhotos');
    if (savedPhotos) {
      this.profilePhotos = JSON.parse(savedPhotos);
    } else {
      // Initialize with default photos if nothing is saved
      this.profilePhotos = new Array(this.adminNames.length).fill(null);
    }
  }

  // Save photos to localStorage
  private savePhotosToLocalStorage(): void {
    localStorage.setItem('adminProfilePhotos', JSON.stringify(this.profilePhotos));
  }

  private initializeForm(): void {
    this.profileFormArray = this.fb.array([
      this.createProfileForm('rutik@example.com', 'admin123'),
      this.createProfileForm('mahesh@example.com', 'admin456'),
      this.createProfileForm('swapnil@example.com', 'admin789'),
    ]);
    this.profileFormArray.controls.forEach(control => control.disable());
  }

  private initializeEditModes(): void {
    this.editMode = new Array(this.adminNames.length).fill(false);
    this.showPassword = new Array(this.adminNames.length).fill(false);
  }

  createProfileForm(email: string, password: string): FormGroup {
    return this.fb.group({
      email: [email, [Validators.required, Validators.email]],
      password: [password, [Validators.required, Validators.minLength(6)]],
    });
  }

  get profiles(): FormGroup[] {
    return this.profileFormArray.controls as FormGroup[];
  }

  enableEdit(index: number): void {
    this.editMode[index] = true;
    this.profileFormArray.at(index).enable();
  }

  onSave(index: number): void {
    const profile = this.profileFormArray.at(index);
    if (profile.valid) {
      this.editMode[index] = false;
      this.showPassword[index] = false;
      profile.disable();
      this.savePhotosToLocalStorage(); // Save photos when clicking "Save"
      console.log(`Profile "${this.adminNames[index]}" updated:`, profile.value);
    } else {
      profile.markAllAsTouched();
    }
  }

  togglePassword(index: number): void {
    this.showPassword[index] = !this.showPassword[index];
  }

  onPhotoChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      if (file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.profilePhotos[index] = reader.result as string;
          // Optional: Auto-save immediately when photo changes
          // this.savePhotosToLocalStorage();
        };
        reader.readAsDataURL(file);
      }
    }
  }
}