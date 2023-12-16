import { AppRoutes } from '../routes/app-routes';
import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

	canActivate(): boolean {
		if (this.authService.isLoggedIn) {
			this.router.navigate([AppRoutes.account], { relativeTo: this.route });
		}

		return !this.authService.isLoggedIn;
	}
}
