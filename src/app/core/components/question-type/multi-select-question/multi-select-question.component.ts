import { Component, OnInit } from '@angular/core';
import { QuestionTypes } from 'src/app/core/types/question-type';

@Component({
  selector: 'tq-multi-select-question',
  templateUrl: './multi-select-question.component.html',
  styleUrls: ['./multi-select-question.component.less']
})
export class MultiSelectQuestionComponent implements OnInit {
  questionType = QuestionTypes;
  constructor() { }

  ngOnInit(): void {
  }

}
