import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { FormService } from 'src/app/core/services/form.service';
import { FormList, Question, ResponseOptions } from 'src/app/core/types/forms';

@Component({
  selector: 'tq-yes-or-no-question',
  templateUrl: './yes-or-no-question.component.html',
  styleUrls: ['./yes-or-no-question.component.less']
})
export class YesOrNoQuestionComponent implements OnInit {
  @Input() sectionId!: number;
  @Input() questionId!: number;
  @Input() question!: Question;
  @Input() questionIndex!: number;
  responseOptionsSave: ResponseOptions = new ResponseOptions();;

  questionForms = new FormGroup({
    text: new FormControl(''),
    required: new FormControl(''),
    option1: new FormControl(''),
    option2: new FormControl(''),
  });
  saveFormFormat!: FormList;

  constructor(private _formService: FormService) {
  }

  ngOnInit(): void {
    this._formService.getSaveFormValue().subscribe((res: FormList) => {
      this.saveFormFormat = res;
    });

    this.questionForms.get('text')?.setValue(this.question.text);
    this.questionForms.get('required')?.setValue(this.question.required);
    this.questionForms.get('option1')?.setValue(this.question.responseOptions[1]);
    this.questionForms.get('option2')?.setValue(this.question.responseOptions[2]);
    this.questionForms.valueChanges
      .pipe(
        debounceTime(1000))
      .subscribe(newValue => {
        if (newValue.text) {
          this.responseOptionsSave.formId = this.saveFormFormat.formId;
          this.responseOptionsSave.sectionId = this.sectionId;
          this.responseOptionsSave.questionId = this.questionId;
          this.responseOptionsSave.responseOptions = { '1': newValue.option1, '2': newValue.option2 };


          this._formService.saveResponseOptions(this.responseOptionsSave).subscribe();
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
          this._formService.autoSaveFormValue().subscribe();
        }
      });
  }

}


