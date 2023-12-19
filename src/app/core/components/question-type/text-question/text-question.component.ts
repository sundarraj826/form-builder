import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, tap } from 'rxjs/operators';
import { FormService } from 'src/app/core/services/form.service';
import { FormList, Question } from 'src/app/core/types/forms';


@Component({
  selector: 'tq-text-question',
  templateUrl: './text-question.component.html',
  styleUrls: ['./text-question.component.less']
})
export class TextQuestionComponent implements OnInit {
  @Input() sectionId!: number;
  @Input() questionId!: number;
  @Input() question!: Question;
  @Input() questionIndex!: number;

  questionForms = new FormGroup({
    text: new FormControl(''),
    required: new FormControl(''),
  });
  saveFormFormat!: FormList;
  saveFormMesg: string = 'Saved'

  constructor(private _formService: FormService, private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this._formService.getSaveFormValue().subscribe((res: FormList) => {
      this.saveFormFormat = res;
    });

    this.questionForms.get('text')?.setValue(this.question.text);
    this.questionForms.get('required')?.setValue(this.question.required);
    this.questionForms.valueChanges
      .pipe(
        debounceTime(1000))
      .subscribe(newValue => {
        if (newValue.text) {

          const sectionIndex = this.saveFormFormat.sections.findIndex(section => section.sectionId === this.sectionId);
          const question = this.saveFormFormat.sections[sectionIndex].questions[this.questionIndex];

          this.saveFormFormat.sections[sectionIndex].questions[this.questionIndex] = {
            ...question,
            questionId: this.questionId,
            type: this.question.questionType,
            text: newValue.text,
            required: newValue.required === true
          };
          this.saveFormFormat.sections[sectionIndex].questions = this.saveFormFormat.sections[sectionIndex].questions.filter(question => question !== null);
          this._formService.setSaveFormValue(this.saveFormFormat);
          this._formService.autoSaveFormValue().pipe(
            tap(res => {
              if (res.ok) {
                console.log('Saved');
                this._snackBar.open(this.saveFormMesg, undefined, { duration: 500 });
              } else {
                console.log('Errors:', res);
              }
            })
          ).subscribe();
        }
      });
  }

}
