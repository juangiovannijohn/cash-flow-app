import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ARS'
})
export class ArsPipe implements PipeTransform {

  transform(value: number,
    currencySign: string = '$',
    decimalLength: number = 2, 
    chunkDelimiter: string = '.', 
    decimalDelimiter:string = ',',
    chunkLength: number = 3): string {
    
    let result = '\\d(?=(\\d{' + chunkLength + '})+' + (decimalLength > 0 ? '\\D' : '$') + ')';
    let num = value.toFixed(decimalLength);

    return currencySign+(decimalDelimiter ? num.replace('.', decimalDelimiter) : num).replace(new RegExp(result, 'g'), '$&' + chunkDelimiter);
}

}