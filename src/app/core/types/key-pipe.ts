import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
  transform(value: any): string[] {
    return Object.keys(value);
  }
}


//Remove under score between the text
@Pipe({
  name: 'removeUnderscore'
})
export class RemoveUnderscorePipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/_/g, ' ');
  }
}
