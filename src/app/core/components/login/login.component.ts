import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Credentials } from '../../types/credentials';
import { fadeInOut } from '../../animations/animations';
import { AppRoutes } from '../../routes/app-routes';
import { ActivatedRoute } from '@angular/router';


@Component({
	selector: 'tq-login',
	templateUrl: './login.component.html',
	styleUrls: ['../shared/login-register.component.less'],
	animations: [fadeInOut]
})
export class LoginComponent {
	loginForm: FormGroup;
	route: ActivatedRoute;

	constructor(private authService: AuthService, route: ActivatedRoute) {
		this.route = route;

		this.loginForm = new FormGroup({
			username: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required]),
		});
	}

	get usernameControl(): AbstractControl {
		return this.loginForm.controls.username;
	}

	get passwordControl(): AbstractControl {
		return this.loginForm.controls.password;
	}

	get createUserRoute(): string {
		return AppRoutes.register;
	}

	/** Attempts to log the user into the system if the login form is valid */
	login(): void {
		if (this.loginForm.valid) {
			const credentials = new Credentials(
				this.usernameControl.value,
				this.passwordControl.value
			);

			this.authService.login(credentials)
				.subscribe(result => {
					if (!result.ok) {
						this.usernameControl.setErrors({
							invalidCredentials: result.errors[0]
						});

						this.passwordControl.setErrors({
							invalidCredentials: result.errors[0]
						});
					}
				});
		}
	}
}
