import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppRoutes } from '../routes/app-routes';

@Injectable({
	providedIn: 'root'
})
export class AccountGuard implements CanActivate, CanLoad {

	constructor(private authService: AuthService, private router: Router) { }

	canActivate(): boolean {
		return this.canLoad();
	}

	canLoad(): boolean {
		if (!this.authService.isLoggedIn) {
			this.router.navigate([AppRoutes.empty]);
		}

		return this.authService.isLoggedIn;
	}
}
