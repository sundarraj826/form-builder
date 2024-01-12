import { Component, OnInit } from '@angular/core';
import { FormService } from '../../services/form.service';
import { FormList, FormSection, Question, ResponseOptions } from '../../types/forms';
import { Result } from '../../types/result';
import { QuestionTypes } from '../../types/question-type';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'admin-preview',
  templateUrl: './admin-preview.component.html',
  styleUrls: ['./admin-preview.component.less']
})
export class AdminPreviewComponent implements OnInit {
  formSetting!: FormList;

  // toppings = new FormControl('');
  // toppingList: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];
  questionType = QuestionTypes;
  rating: number = 0;
  starCount: number = 5;

  constructor(private _formService: FormService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.getFormSettings(id);
      }
    });



  }

  getFormSettings(id: number) {
    this._formService.getFormSetting(id).subscribe((res: Result<FormList>) => {
      this.formSetting = res.value!;
      console.log(res.value)
    });
  }

  onRatingChanged(rating: number) {
    this.rating = rating;
  }

}
