import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPayslipComponentComponent } from './user-payslip.component';


describe('UserPayslipComponent', () => {
  let component: UserPayslipComponentComponent;
  let fixture: ComponentFixture<UserPayslipComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPayslipComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPayslipComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});