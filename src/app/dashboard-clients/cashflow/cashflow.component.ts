import { Component, Input, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/core/shared/services/supabase.service';

@Component({
  selector: 'app-cashflow',
  templateUrl: './cashflow.component.html',
  styleUrls: ['./cashflow.component.css']
})
export class CashflowComponent implements OnInit {
  
  @Input() currentMonth: number = 0;
  @Input() currentYear: number = 0;
  user:any;
  isPremium:boolean = true;
  showDetails:boolean = true;
  GPExpenses: GPExpensesDatum[]= []
  GPIncomes: GPIncomesDatum[]= []
  GPExpSum: number = 0
  GPIncSum: number = 0

  currentMounth:string ='';
  constructor(private readonly supabase: SupabaseService,) { }

 async ngOnInit(): Promise<void> {
  console.log('mes', this.currentMonth)
  console.log('año', this.currentYear)
    this.user = await this.supabase.getUser();
    this.getGananciasPerdidasExpenses(this.user.id, this.currentYear, this.currentMonth);
    this.getGananciasPerdidasIncomes(this.user.id, this.currentYear, this.currentMonth);
    this.currentMounth = this.obtenerMesActualEnEspanol(this.currentMonth)
  }

  //TODO: Sumatoria total de ingresos EN EL MES CORRIENTE. 
  //TODO: Sumatoria total de gastos EN EL MES CORRIENTE.  
  //TODO: Sumatoria de ingresos agrupadas por categoria EN EL MES CORRIENTE 
  //TODO: Sumatoria de GASTOS agrupadas por categoria EN EL MES CORRIENTE 
  getGananciasPerdidasExpenses(user_uuid: string, year?:number, month?: number){
  this.supabase.getGananciasPerdidasExpenses(user_uuid,month,year ).then((resp:GPExpenses | any) =>{
    this.GPExpenses = resp.data? resp.data : [];
    let total:number = 0
    if (resp.data && resp.data.length > 0){
      const dataArray = resp.data.map((item: any) => {
        total += item.sum
        return item
      })
    }
    this.GPExpSum = total
  })
}
  getGananciasPerdidasIncomes(user_uuid: string, year?:number, month?: number){
    this.supabase.getGananciasPerdidasIncomes(user_uuid,month,year).then((resp:GPIncomes | any ) =>{
      this.GPIncomes = resp.data? resp.data : [];
      let total:number = 0
      if (resp.data && resp.data.length > 0){
        const dataArray = resp.data.map((item: any) => {
          total += item.sum
          return item
        })
      }
      this.GPIncSum = total
    })
  }
  obtenerMesActualEnEspanol(month: number): string {
    const mesesEnEspanol = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
  
    if (month < 1 || month > 12) {
      throw new Error("El número del mes debe estar entre 1 y 12.");
    }
  
    return mesesEnEspanol[month - 1].charAt(0).toUpperCase() + mesesEnEspanol[month - 1].slice(1);
  }
  
  
  
}
export interface GPExpenses {
  data:  GPExpensesDatum[];
  error: any;
}

export interface GPExpensesDatum {
  id:            number;
  category_name: string;
  user_uuid:     string;
  budget_expected: number;
  data:          DatumDatum[];
  sum:           number;
}

export interface DatumDatum {
  category_expense_id: number;
  expense_date:        Date;
  expense_amount:      number;
  user_uuid:           string;
}

export interface GPIncomes {
  data:  GPIncomesDatum[];
  error: any;
}

export interface GPIncomesDatum {
  id:            number;
  category_name: string;
  user_uuid:     string;
  budget_expected: number;
  data:          DatumDatum[];
  sum:           number;
}

export interface DatumDatum {
  category_income_id: number;
  income_date:        Date;
  income_amount:      number;
  user_uuid:          string;
}

