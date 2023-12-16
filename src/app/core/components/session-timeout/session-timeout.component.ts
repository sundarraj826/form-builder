import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { BroadcastService } from '../../services/broadcast.service';
import { AuthEvent } from '../../types/auth-event';

@Component({
	selector: 'tq-session-timeout',
	templateUrl: './session-timeout.component.html',
	styleUrls: ['./session-timeout.component.less']
})
export class SessionTimeoutComponent implements AfterViewInit, OnDestroy {
	remainingTime: number;
	private interval!: NodeJS.Timeout;

	constructor(private service: BroadcastService) {
		this.remainingTime = 60;
	}

	/** Logs the user out of the system */
	logout(): void {
		this.service.broadcast(AuthEvent.Logout);
	}

	ngAfterViewInit(): void {
		this.interval = setInterval(() => {
			this.remainingTime--;

			if (!this.remainingTime) {
				this.service.broadcast(AuthEvent.Logout);
				clearInterval(this.interval);
			}
		}, 1000);
	}

	ngOnDestroy(): void {
		clearInterval(this.interval);
	}
}
