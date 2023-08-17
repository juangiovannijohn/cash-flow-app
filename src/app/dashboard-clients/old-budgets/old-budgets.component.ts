import { Component, OnInit , Input, Output , EventEmitter} from '@angular/core';
import { SupabaseService } from 'src/app/core/shared/services/supabase.service';

@Component({
  selector: 'app-old-budgets',
  templateUrl: './old-budgets.component.html',
  styleUrls: ['./old-budgets.component.css']
})
export class OldBudgetsComponent implements OnInit {
  @Input() title: string = '';
  @Output() currentMonth = new EventEmitter<number>();
  @Output() currentYear = new EventEmitter<number>();
  user: any;
  pillsCategories : any[] = []
  rowTitle: boolean = false;

  constructor( private readonly supabase: SupabaseService) { }

  async ngOnInit(): Promise<void> {
    this.user =await this.supabase.getUser();
    this.getCategoriesExpensesDates(this.user.id);
  }
  // Función para agrupar los objetos por año y por mes
  groupByYearAndMonth(data: any) {
    let yearsMonths :any = []
    const arr = data.map((item: any) => {
      if (item.budget_month) {
        const year = item.budget_month?.slice(0, 4); // Extrae el año en formato 'YYYY'
        const month = item.budget_month?.slice(5, 7); // Extrae el mes en formato 'MM'
        yearsMonths.push({ year, month})
      }
      return;
    });
    // Función de reducción para agrupar los objetos por año y meses únicos
    const groupedData: any = yearsMonths.reduce((acc: any, item: any) => {
      const { year, month } = item;
      if (!acc[year]) {
        acc[year] = new Set();
      }
      acc[year].add(Number(month));
      return acc;
    }, {});
  
    // Convertir el resultado en un array de objetos
    return Object.keys(groupedData).map((year) => ({
      year: Number(year),
      months: Array.from(groupedData[year]).sort((a: any, b: any) => a - b),
    }));
  }
  getCategoriesExpensesDates(user_uuid:string){
    this.supabase.getCategoriesExpensesDates(user_uuid).then(
      resp=> {
        if (resp.error) {
          console.warn(resp.error)
        }else{
          const dates = this.groupByYearAndMonth(resp.categories_dates);
          this.pillsCategories = dates;
        }
      }
    )
  }
  getCategoriesOldExpenses(year:number, month:number){
    this.currentMonth.emit(month);
    this.currentYear.emit(year);
  }
}
