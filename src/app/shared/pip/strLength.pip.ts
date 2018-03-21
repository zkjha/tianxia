import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'strlength'})
export class StrLengthPipe implements PipeTransform {
    transform(value: any): any {
        if (value) {
            if (value.length > 15) {
                return `${value.substring(0, 15)}...`
            }else {
                return value;
            }
        }else {
            return value
        }


    }
}
