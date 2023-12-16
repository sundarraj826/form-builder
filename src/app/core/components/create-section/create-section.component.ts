import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormList, CreateQuestion } from '../../types/forms';
import { QuestionTypes } from '../../types/question-type';
import { FormService } from '../../services/form.service';
import { Result } from '../../types/result';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'tq-create-section',
  templateUrl: './create-section.component.html',
  styleUrls: ['./create-section.component.less']
})
export class CreateSectionComponent implements OnInit {
  stepForms: FormGroup[] = [];
  selectedTeam = '';
  questionType = QuestionTypes;
  questionTypes = Object.values(QuestionTypes).filter(value => typeof value === 'string') as string[];
  @Input('formData') formData!: FormList;
  questionset: number = 0;
  @Output() autoSave = new EventEmitter<void>();
  createQuestion: CreateQuestion[] = []


  questionForms = new FormGroup({
    formId: new FormControl(''),
    sectionId: new FormControl(''),
    questionType: new FormControl('')
  })

  constructor(private _fb: FormBuilder,  private _formService: FormService, private _http: HttpClient) { }

  ngOnInit(): void {
    this.formData.sections.forEach((section, index) => {
      const formGroup = this._fb.group({
        Section: [''],
        sectionDesc: [''],
        sectionId: [''],
        formId: [''],
      });

      this.stepForms.push(formGroup);

      if(this.formData.sections[index].name)
        this.stepForms[index].get('Section')?.setValue(this.formData.sections[index].name);
      if(this.formData.sections[index].description)
        this.stepForms[index].get('sectionDesc')?.setValue(this.formData.sections[index].description);

      this.stepForms[index].valueChanges
        .pipe(
          debounceTime(1000),
          distinctUntilChanged()
        )
        .subscribe((res) => {
          this.autoSave.emit(res);
        });

     
    });

    
   
  }
  getRange(count: number): number[] {
    return new Array(count).fill(0).map((_, index) => index + 1);
  }
  makeEnum(value: string) {
    const enumValue: QuestionTypes = QuestionTypes[value as keyof typeof QuestionTypes];
    return enumValue!;
  }
  addQuestionSet() {
    this.questionset = this.questionset+1;
  }

  deleteSection(id: number) {
    this._formService.deleteSection(this.formData.formId, id).subscribe((res: Result<FormList>) => {
      this._formService.setFormDetailsValue(res.value!);

    })
  }
}
