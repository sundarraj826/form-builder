export class FormList {
    formId!: number;
    title!: string;
    description!: string;
    status!: string;
    sections!: FormSection[];

}

export class FormSection {
    sectionId!: number;
    name!: string;
    description!: string;
    questions!: Question[];
    questionsWithResponses!: Question[];
}

export class CreateQuestion {
    formId!: number;
    sectionId!: number;
    questionType!: number;
}

export class Question {
    questionId!: number;
    text!: string;
    required!: boolean;
    questionType!: number;
    type!: number;
    responseOptions!: Record<string, string>;
}

export class ResponseOptions {
    formId!: number;
    sectionId!: number;
    questionId!: number;
    responseOptions!: Record<string, string>;
}



