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

  // Optional: Zoom functionality
  zoomedPhoto: string | null = null;
  zoomLevel = 1;
  maxZoom = 3;
  minZoom = 0.5;
  zoomStep = 0.1;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeEditModes();
    this.loadStoredPhotos();
  }

  private initializeForm(): void {
    this.profileFormArray = this.fb.array(
      this.adminNames.map((name, index) => {
        const savedEmail = localStorage.getItem(`email_${index}`) || `${name.split(' ')[0].toLowerCase()}@example.com`;
        const savedPassword = localStorage.getItem(`password_${index}`) || 'admin123';
        return this.createProfileForm(savedEmail, savedPassword);
      })
    );
    this.profileFormArray.controls.forEach(control => control.disable());
  }

  private initializeEditModes(): void {
    this.editMode = new Array(this.adminNames.length).fill(false);
    this.showPassword = new Array(this.adminNames.length).fill(false);
  }

  private loadStoredPhotos(): void {
    this.profilePhotos = this.adminNames.map((_, index) => {
      return localStorage.getItem('photo_${index}') || null;
    });
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
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onSave(index: number): void {
    const profileForm = this.profiles[index];

    if (!this.profilePhotos[index]) {
      alert("Please upload a profile photo.");
      return;
    }

    if (profileForm.valid) {
      const { email, password } = profileForm.value;

      // Save data to localStorage
      localStorage.setItem(`email_${index}`, email);
      localStorage.setItem(`password_${index}`, password);
      localStorage.setItem(`photo_${index}`, this.profilePhotos[index] || '');
      

      this.editMode[index] = false;
      this.showPassword[index] = false;
      this.profileFormArray.at(index).disable();
      
     
      console.log(`Saved: ${email}`);
      console.log(`Saved: ${email}`);
    } else {
      profileForm.markAllAsTouched();
      
    }
  }
}

function initializeEditModes() {
  throw new Error('Function not implemented.');
}
