

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipComponent} from './payslip.component';

describe('PayslipComponent', () => {
  let component: PayslipComponent;
  let fixture: ComponentFixture<PayslipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayslipComponent]  // <-- fix here
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayslipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});