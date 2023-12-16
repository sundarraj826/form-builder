import { Component, OnInit } from '@angular/core';

import { QuestionTypes } from 'src/app/core/types/question-type';

@Component({
  selector: 'tq-text-type-question',
  templateUrl: './text-type-question.component.html',
  styleUrls: ['./text-type-question.component.less']
})
export class TextTypeQuestionComponent implements OnInit {
  questionType = QuestionTypes;
  constructor() { }

  ngOnInit(): void {
  }

}
