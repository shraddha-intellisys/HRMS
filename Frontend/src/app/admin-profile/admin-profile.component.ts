import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css'],
})
export class AdminProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  profileFormArray!: FormArray;
  editMode: boolean[] = [];
  showPassword: boolean[] = [];
  profilePhotos: (string | null)[] = [];
  defaultPhoto = 'assets/default-profile.png';
  adminNames: string[] = ['Rutik Sir', 'Mahesh Sir', 'Swapnil Sir', 'Faiaz Sir'];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
    this.initializeEditModes();
    this.initializePhotos();
  }

  private initializeForm(): void {
    this.profileFormArray = this.fb.array([
      this.createProfileForm('rutik@example.com', 'admin123'),
      this.createProfileForm('mahesh@example.com', 'admin456'),
      this.createProfileForm('swapnil@example.com', 'admin789'),
      this.createProfileForm('faiaz@example.com', 'admin000'),
    ]);
    this.profileFormArray.controls.forEach(control => control.disable());
  }

  private initializeEditModes(): void {
    this.editMode = new Array(this.adminNames.length).fill(false);
    this.showPassword = new Array(this.adminNames.length).fill(false);
  }

  private initializePhotos(): void {
    this.profilePhotos = new Array(this.adminNames.length).fill(null);
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
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePhotos[index] = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}