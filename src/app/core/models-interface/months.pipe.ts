import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'months'
})
export class MonthsPipe implements PipeTransform {

  transform(monthNumber: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    if (monthNumber >= 1 && monthNumber <= 12) {
      return meses[monthNumber - 1];
    } else {
      return '';
    }
  }

}
