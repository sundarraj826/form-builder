import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Route Guards
import { AccountGuard } from './guards/account.guard';
import { AuthGuard } from './guards/auth.guard';

// Components
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RootComponent } from './components/root/root.component';
import { SessionTimeoutComponent } from './components/session-timeout/session-timeout.component';
import { LoginComponent } from './components/login/login.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { LoadingComponent } from './components/loading/loading.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { AccountComponent } from './components/account/account.component';
import { FormListingComponent } from './components/form-listing/form-listing.component';
import { QuestionTypeComponent } from './components/question-type/question-type.component';
import { CreateSectionComponent } from './components/create-section/create-section.component';
// Routes
import { AppRoutes } from './routes/app-routes';
import { CreateFormAdminComponent } from './components/create-form-admin/create-form-admin.component';


const routes: Routes = [
	{
		path: AppRoutes.empty,
		redirectTo: AppRoutes.login,
		pathMatch: 'full'
	},
	{
		path: AppRoutes.login,
		component: LoginComponent,
		canActivate: [AuthGuard],
	},
	{
		path: AppRoutes.register,
		component: CreateUserComponent,
		canActivate: [AuthGuard],
	},
	{
		path: AppRoutes.account,
		component: AccountComponent,
		canActivate: [AccountGuard],
		children: [
			{ path: AppRoutes.empty, redirectTo: AppRoutes.formListing, pathMatch: 'full' },
			{ path: AppRoutes.formListing, component: FormListingComponent },
			{ path: AppRoutes.createFormAdmin, component: CreateFormAdminComponent },
			{ path: 'create-form-admin/:id', component: CreateFormAdminComponent },
		]
	},
	{ path: AppRoutes.pageNotFound, component: PageNotFoundComponent }
];

export const components: Array<any> = [
	RootComponent,
	LoginComponent,
	CreateUserComponent,
	CreateFormAdminComponent,
	FormListingComponent,
	PageNotFoundComponent,
	SessionTimeoutComponent,
	ConfirmationComponent,
	LoadingComponent,
	AccountComponent,
	CreateSectionComponent,
	QuestionTypeComponent
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class CoreRoutingModule { }
