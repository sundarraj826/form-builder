import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class BroadcastService {
	private $subject: Subject<string>;

	constructor() {
		this.$subject = new Subject<string>();
	}

	get messageStream(): Subject<string> {
		return this.$subject;
	}

	broadcast(message: string): void {
		this.$subject.next(message);
	}
}
