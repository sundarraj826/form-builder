import { SessionTimeoutComponent } from './../components/session-timeout/session-timeout.component';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription, fromEvent, from } from 'rxjs';
import { mergeMap, throttleTime } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class SessionService {
	private readonly SESSION_EXPIRY_TIME: string;
	private interval!: NodeJS.Timeout;
	private sessionTimeoutDialog?: MatDialogRef<SessionTimeoutComponent>;
	private eventSubscription: Subscription;

	constructor(private matDialog: MatDialog) {
		this.SESSION_EXPIRY_TIME = 'session_expiry_time';
		this.eventSubscription = new Subscription();
	}

	/** Initializes the session timer */
	initialize(): void {
		// clear interval if already set up
		clearInterval(this.interval);

		// Set new session expiry time
		this.setSessionExpirationTime();

		// Subscribe to necessary events.
		this.eventSubscription = from(['scroll', 'click', 'mousemove', 'keydown'])
			.pipe(mergeMap(event => fromEvent(window, event).pipe(throttleTime(5000))))
			.subscribe(this.setSessionExpirationTime);

		// set up interval for checking last user activity.
		this.interval = setInterval(this.checkIfUserIsInactive, 10000);
	}

	/** Performs cleanup by removing event subscriptions and clearing session timeout check interval  */
	performCleanUp(): void {
		// Clear timer and interval
		clearInterval(this.interval);

		// unsubscribe from all subscriptions
		this.eventSubscription.unsubscribe();

		// Remove session expiry time
		localStorage.removeItem(this.SESSION_EXPIRY_TIME);
	}

	/** Updates the logged in user's last activity time */
	private setSessionExpirationTime = (): void => {
		localStorage.setItem(this.SESSION_EXPIRY_TIME, `${Date.now() + environment.timeLeftTillSessionExpiry}`);
	}

	/** Checks if a user is inactive.
	 * If so, this method will display a pop up warning the user that logout will be
	 * initiated if no activity is performed within the displayed window of ime.
	 */
	private checkIfUserIsInactive = (): void => {
		const expiredTime = parseInt(localStorage.getItem(this.SESSION_EXPIRY_TIME) ?? Date.now().toString(), 10);

		if (this.sessionTimeoutDialog) { return; }

		if (expiredTime < Date.now()) {
			this.sessionTimeoutDialog = this.matDialog.open(SessionTimeoutComponent);
			this.sessionTimeoutDialog.afterClosed().subscribe(() => this.sessionTimeoutDialog = undefined);
		}
	}
}
