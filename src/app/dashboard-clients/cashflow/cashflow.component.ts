import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/core/shared/services/supabase.service';

@Component({
  selector: 'app-cashflow',
  templateUrl: './cashflow.component.html',
  styleUrls: ['./cashflow.component.css']
})
export class CashflowComponent implements OnInit {
  user:any;
  isPremium:boolean = true;
  showDetails:boolean = true;
  GPExpenses: GPExpensesDatum[]= []
  GPIncomes: GPIncomesDatum[]= []
  GPExpSum: number = 0
  GPIncSum: number = 0
  currentMounth:string =''
  constructor(private readonly supabase: SupabaseService,) { }

 async ngOnInit(): Promise<void> {
    this.user = await this.supabase.getUser();
    this.getGananciasPerdidasExpenses(this.user.id);
    this.getGananciasPerdidasIncomes(this.user.id);
    this.currentMounth = this.obtenerMesActualEnEspanol()
  }

  //TODO: Sumatoria total de ingresos EN EL MES CORRIENTE. 
  //TODO: Sumatoria total de gastos EN EL MES CORRIENTE.  
  //TODO: Sumatoria de ingresos agrupadas por categoria EN EL MES CORRIENTE 
  //TODO: Sumatoria de GASTOS agrupadas por categoria EN EL MES CORRIENTE 
  getGananciasPerdidasExpenses(user_uuid: string){
  this.supabase.getGananciasPerdidasExpenses(user_uuid).then((resp:GPExpenses | any) =>{
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
  getGananciasPerdidasIncomes(user_uuid: string){
    this.supabase.getGananciasPerdidasIncomes(user_uuid).then((resp:GPIncomes | any ) =>{
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
  obtenerMesActualEnEspanol():string{
    // Crear un array con los nombres de los meses en español
    const mesesEnEspanol = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    
    // Obtener la fecha actual
    const fechaActual = new Date();
    
    // Obtener el número del mes (los meses en JavaScript se indexan desde 0)
    const numeroMes = fechaActual.getMonth();
    
    // Obtener el nombre del mes en español usando el array
    const mesEnEspanol = mesesEnEspanol[numeroMes];
    
    return mesEnEspanol;
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

function obtenerMesActualEnEspanol() {
  throw new Error('Function not implemented.');
}

