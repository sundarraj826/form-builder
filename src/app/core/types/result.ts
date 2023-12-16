import { ResultBase } from './result-base';

export class Result<T> extends ResultBase {
	value?: T;
}
