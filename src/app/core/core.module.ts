import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule as AngularCommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { RemoveUnderscorePipe } from './types/key-pipe';


// Components
import { RootComponent } from './components/root/root.component';

// Interceptors
import { TokenInterceptor } from './interceptors/token.interceptor';

// Services
import { AuthService } from './services/auth.service';

// Routing Module
import { components, CoreRoutingModule } from './core-routing.module';

// Directives
import { DynamicHostDirective } from './directives/dynamic-host.directive';


function tryInitiateSession(authService: AuthService): () => Promise<void> {
	return () => authService.tryInitiateSession();
}

@NgModule({
	declarations: components.concat([DynamicHostDirective, RemoveUnderscorePipe]),
	imports: [
		BrowserAnimationsModule,
		AngularCommonModule,
		ReactiveFormsModule,
		FormsModule,
		RouterModule,
		HttpClientModule,
		CoreRoutingModule,
		MatButtonModule,
		MatCardModule,
		MatDialogModule,
		MatFormFieldModule,
		MatProgressSpinnerModule,
		MatInputModule,
		MatRadioModule,
		MatToolbarModule,
		MatIconModule,
		MatStepperModule,
		MatCheckboxModule,
		MatSnackBarModule,
		MatSelectModule
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptor,
			multi: true
		},
		{
			provide: APP_INITIALIZER,
			useFactory: tryInitiateSession,
			deps: [AuthService],
			multi: true
		}
	],
	bootstrap: [RootComponent]
})
export class CoreModule { }
