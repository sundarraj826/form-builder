import { Component, OnInit } from '@angular/core';

import { QuestionTypes } from 'src/app/core/types/question-type';

@Component({
  selector: 'tq-single-select-question',
  templateUrl: './single-select-question.component.html',
  styleUrls: ['./single-select-question.component.less']
})
export class SingleSelectQuestionComponent implements OnInit {
  questionType = QuestionTypes;
  constructor() { }

  ngOnInit(): void {
  }



  singleOptions = [{ field: '' }];

  addOptions() {
    this.singleOptions.push({
      field: '',

    });
  }

}
