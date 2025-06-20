import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';

import { AttendanceApplicationComponent } from './attendance-application/attendance-application.component';
import { LeaveComponent } from './leave/leave.component';
import { LeavesComponent } from './leaves/leaves.component';
import { ProfileComponent } from './profile/profile.component';
import { RightComponent } from './right/right.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { EmployeeComponent } from './employee/employee.component';
import { Holiday } from './holiday/holiday.component';
import { ResignationComponent } from './resignation/resignation.component';
//import { AdminLoginComponent } from './adminlogin/adminlogin.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
import { AttendanceApprovalComponent } from './attendance-approval/attendance-approval.component';
import { LeavesApprovalComponent } from './leaves-approval/leaves-approval.component';
import { ResignationApprovalComponent } from './resignation-approval/resignation-approval.component';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { PayslipComponent} from './payslip/payslip.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
 import { UserPayslipComponentComponent } from './user-payslip/user-payslip.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
  import { ResetPasswordComponent } from './reset-password/reset-password.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'signup', component: SignUpComponent },
{ path: 'right', component: RightComponent },
{ path: 'profile', component: ProfileComponent },
{path:'shedule', component: ScheduleComponent},
{path:'leave',component:LeaveComponent},
{path:'topnav',component:TopNavComponent},
{path:'attendance-application',component:AttendanceApplicationComponent},
{path:'leaves',component:LeavesComponent},
{path:'employee',component:EmployeeComponent},
{path:'holiday',component:Holiday},
{ path: 'resignation', component: ResignationComponent },
//{ path: 'adminlogin', component: AdminLoginComponent },
// { path: 'dashboard', component: DashboardComponent },
{ path: 'attendance-approval', component: AttendanceApprovalComponent},
{ path: 'leaves-approval', component: LeavesApprovalComponent},
{path : 'resignation-approval', component: ResignationApprovalComponent},
{ path: 'employee-profile', component: EmployeeProfileComponent },
{ path: 'employee/:id', component: EditProfileComponent },
 { path: 'payroll', component: PayslipComponent},
 {path:'admin-profile', component: AdminProfileComponent},
 { path: 'userpay', component: UserPayslipComponentComponent},
 { path: 'admin-dashboard', component: AdminDashboardComponent},
  {path:'reset-password',component:ResetPasswordComponent},


    ]
 