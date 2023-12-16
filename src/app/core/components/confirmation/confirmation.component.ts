import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'tq-confirmation',
	templateUrl: './confirmation.component.html',
	styleUrls: ['./confirmation.component.less']
})
export class ConfirmationComponent {
	@Input() message = 'Are you sure you wan\'t to perform this action?';
	@Input() yesText = 'Yes';
	@Input() noText = 'No';

	@Input() showYes = true;
	@Input() showNo = true;

	@Output() yesClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() noClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

	onYesClick: () => void = () => this.yesClicked.emit(true);
	onNoClick: () => void = () => this.noClicked.emit(true);
}
