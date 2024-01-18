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
    formId!: number;
}

// export class CreateQuestion {
//     formId!: number;
//     sectionId!: number;
//     questionType!: number;
// }

export class Question {
    questionId!: number;
    text!: string;
    required!: boolean;
    questionType!: number;
    type!: number;
    responseOptions!: Record<string, string>;
    response!: string;
}

export class ResponseOptions {
    formId!: number;
    sectionId!: number;
    questionId!: number;
    responseOptions!: Record<string, string>;
}

export class responses {
    formId!: number;
    responses!: [{
        questionId: number,
        response: string
    }]
}


