import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppRoutes } from '../../routes/app-routes';
import { AuthService } from '../../services/auth.service';
import { CreateUserRequest } from '../../types/create-user-request';
import { UserType } from '../../types/user-type';
import { fadeInOut } from '../../animations/animations';
import { UtilitiesService } from '../../services/utilities.service';
import { UserService } from '../../services/user.service';
import { Credentials } from '../../types/credentials';

@Component({
	selector: 'tq-create-user',
	templateUrl: './create-user.component.html',
	styleUrls: ['../shared/login-register.component.less'],
	animations: [fadeInOut]
})
export class CreateUserComponent {
	createUserForm: FormGroup;
	route: ActivatedRoute;

	constructor(
		private authService: AuthService,
		private userService: UserService,
		route: ActivatedRoute,
		private utilities: UtilitiesService
	) {
		this.route = route;

		this.createUserForm = new FormGroup({
			username: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required]),
			userType: new FormControl(UserType.Admin, [Validators.required]),
		});
	}

	get usernameControl(): AbstractControl {
		return this.createUserForm.controls.username;
	}

	get passwordControl(): AbstractControl {
		return this.createUserForm.controls.password;
	}

	get userTypeControl(): AbstractControl {
		return this.createUserForm.controls.userType;
	}

	get loginRoute(): string {
		return AppRoutes.login;
	}

	/** Attempts to log the user into the system if the login form is valid */
	createUser(): void {
		if (this.createUserForm.valid) {
			const credentials = new CreateUserRequest(
				this.usernameControl.value,
				this.passwordControl.value,
				this.userTypeControl.value
			);

			this.userService.createUser(credentials)
				.subscribe(async result => {
					if (result.ok) {
						const userCredentials = new Credentials(this.usernameControl.value, this.passwordControl.value);

						await this.authService.login(userCredentials).toPromise();
					} else {
						this.utilities.showConfirmation({
							message: 'An error occurred while creating user.',
							showNo: false,
							yesText: 'OK'
						});
					}
				});
		}
	}
}
