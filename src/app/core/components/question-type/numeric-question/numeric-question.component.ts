import { Component, OnInit } from '@angular/core';

import { QuestionTypes } from 'src/app/core/types/question-type';

@Component({
  selector: 'tq-numeric-question',
  templateUrl: './numeric-question.component.html',
  styleUrls: ['./numeric-question.component.less']
})
export class NumericQuestionComponent implements OnInit {
  questionType = QuestionTypes;
  constructor() { }

  ngOnInit(): void {
  }

}
