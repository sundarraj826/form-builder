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
import { CreateFormAdminComponent } from './components/create-form-admin/create-form-admin.component';
import { CreateSectionComponent } from './components/create-section/create-section.component';
import { TextQuestionComponent } from './components/question-type/text-question/text-question.component';
import { SelectableQuestionComponent } from './components/question-type/selectable-question/selectable-question.component';
import { MultiSelectQuestionComponent } from './components/question-type/multi-select-question/multi-select-question.component';
import { StarRatingQuestionComponent } from './components/question-type/star-rating-question/star-rating-question.component';
import { TextTypeQuestionComponent } from './components/question-type/text-type-question/text-type-question.component';
import { YesOrNoQuestionComponent } from './components/question-type/yes-or-no-question/yes-or-no-question.component';
// Routes
import { AppRoutes } from './routes/app-routes';



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
	QuestionTypeComponent,
	TextQuestionComponent,
	SelectableQuestionComponent,
	MultiSelectQuestionComponent,
	StarRatingQuestionComponent,
	TextTypeQuestionComponent,
	YesOrNoQuestionComponent
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class CoreRoutingModule { }
