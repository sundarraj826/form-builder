import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class FormControlService {
    private forms: FormGroup[] = [];

    registerForm(form: FormGroup) {
        this.forms.push(form);
    }

    markAllFormsAsTouched() {
        this.forms.forEach((form) => {
            this.markFormGroupTouched(form);
        });
    }

    formsValid(): boolean {
        return this.forms.every((form) => form.valid);
    }


    private markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach((control) => {
            control.markAsTouched();

            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }
}