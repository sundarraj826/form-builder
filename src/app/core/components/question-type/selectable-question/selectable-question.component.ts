import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormService } from 'src/app/core/services/form.service';
import { FormList, Question, ResponseOptions } from 'src/app/core/types/forms';


@Component({
  selector: 'tq-single-select-question',
  templateUrl: './selectable-question.component.html',
  styleUrls: ['./selectable-question.component.less']
})
export class SelectableQuestionComponent implements OnInit {
  saveFormFormat!: FormList;
  @Input() sectionId!: number;
  @Input() questionId!: number;
  @Input() question!: Question;
  @Input() questionIndex!: number;
  responseOptionsSave: ResponseOptions = new ResponseOptions();;
  questionResponseOptions!: FormGroup;
  constructor(private _fb: FormBuilder, private _formService: FormService) { }

  ngOnInit() {
    this._formService.getSaveFormValue().subscribe((res: FormList) => {
      this.saveFormFormat = res;
    });
    this.questionResponseOptions = this._fb.group({
      text: new FormControl(''),
      required: new FormControl(''),
      responseOptions: this._fb.array([]),
    });
    this.questionResponseOptions.get('text')?.setValue(this.question.text);
    this.questionResponseOptions.get('required')?.setValue(this.question.required);

    if (Object.keys(this.question.responseOptions).length > 0) {
      Object.keys(this.question.responseOptions).forEach((key, index) => {
        this.addOption();
        this.responseOptions.controls[index].get('optionAnswer')?.setValue(this.question.responseOptions[key]);
      });
    }

    this.questionResponseOptions.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((res: Question) => {
      if (Object.keys(res.responseOptions).length > 0) {
        const dataObject: Record<string, string> = {};
        this.responseOptions.getRawValue().forEach((optionAnswer: { optionAnswer: string }, index: number) => {
          dataObject[`${index + 1}`] = optionAnswer.optionAnswer;
        });
        this.responseOptionsSave.formId = this.saveFormFormat.formId;
        this.responseOptionsSave.sectionId = this.sectionId;
        this.responseOptionsSave.questionId = this.questionId;
        this.responseOptionsSave.responseOptions = dataObject;
        this._formService.saveResponseOptions(this.responseOptionsSave).subscribe();
        const sectionIndex = this.saveFormFormat.sections.findIndex(section => section.sectionId === this.sectionId);
        const question = this.saveFormFormat.sections[sectionIndex].questions[this.questionIndex];

        this.saveFormFormat.sections[sectionIndex].questions[this.questionIndex] = {
          ...question,
          questionId: this.questionId,
          type: this.question.questionType,
          text: res.text,
          required: res.required === true
        };
        this.saveFormFormat.sections[sectionIndex].questions = this.saveFormFormat.sections[sectionIndex].questions.filter(question => question !== null);
        this._formService.setSaveFormValue(this.saveFormFormat);
        this._formService.autoSaveFormValue().subscribe();
      }
    })

  }



  //Getting form array
  get responseOptions() {
    return this.questionResponseOptions.get('responseOptions') as FormArray;
  }

  // Adding Dinind
  addOption() {
    this.responseOptions.push(
      this._fb.group({
        optionAnswer: new FormControl(''),
      })
    );

  }
  deleteOption(i: any) {
    this.responseOptions.removeAt(i);
  }

}
