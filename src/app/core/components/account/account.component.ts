import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AppRoutes } from '../../routes/app-routes';

@Component({
	selector: 'tq-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.less']
})
export class AccountComponent {
	authService: AuthService;
	router: Router;

	constructor(authService: AuthService, router: Router) {
		this.authService = authService;
		this.router = router;
	}

	get homeRoute(): string {
		return '../' + AppRoutes.account;
	}

	logout(): void {
		this.authService.logout();
	}
}
