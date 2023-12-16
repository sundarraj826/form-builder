import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationComponent } from '../components/confirmation/confirmation.component';
import { LoadingComponent } from '../components/loading/loading.component';
import { ConfirmationDialogOptions } from '../types/confirmation-dialog-options';


@Injectable({
	providedIn: 'root'
})
export class UtilitiesService {

	constructor(private dialog: MatDialog) { }

	showConfirmation(options?: ConfirmationDialogOptions): MatDialogRef<ConfirmationComponent, any> {
		const compRef = this.dialog.open(ConfirmationComponent);

		if (options) {
			if (options.message) { compRef.componentInstance.message = options.message; }
			if (options.yesText) { compRef.componentInstance.yesText = options.yesText; }
			if (options.noText) { compRef.componentInstance.noText = options.noText; }
			if (!options.showNo) { compRef.componentInstance.showNo = options.showNo ?? true; }
			if (!options.showYes) { compRef.componentInstance.showYes = options.showYes ?? true; }
		}

		return compRef;
	}

	showProcessing(dialogId: string): MatDialogRef<LoadingComponent, any> {
		const compRef = this.dialog.open(LoadingComponent, {
			id: dialogId,
			disableClose: true
		});

		return compRef;
	}

	hideProcessing(dialogId: string): void {
		this.dialog.getDialogById(dialogId)?.close();
	}
}
