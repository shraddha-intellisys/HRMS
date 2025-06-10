

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditProfileComponent } from './edit-profile.component';
import {  HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditProfileComponent],
      imports: [ FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form and profile data on cancel', () => {
    component.profileData.name = 'Changed Name';
    const form = {
      resetForm: jasmine.createSpy('resetForm')
    } as any;
    component.canceledit(form);
    expect(form.resetForm).toHaveBeenCalled();
    expect(component.submitted).toBeFalse();
  });

  it('should submit profile data to backend', () => {
    const form = {
      valid: true
    } as any;

    component.profileData.name = 'New Name';

    component.submitprofile(form);

    const req = httpMock.expectOne('http://your-api-endpoint.com/api/profiles');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.name).toBe('New Name');

    // Simulate response
    req.flush({ success: true });

    expect(component.submitted).toBeTrue();
  });
});