import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

import { sqlInjectionValidator } from 'src/app/core/helpers/sqlInjectionValidator';

import { DatePipe } from '@angular/common';
import { Profile, SupabaseService } from 'src/app/core/shared/services/supabase.service';
import { AuthSession } from '@supabase/supabase-js';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRoles } from 'src/app/core/models-interface/enums';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.css']
})
export class NewTransactionComponent implements OnInit {
  user: any;
  profile!: Profile | any;
  expensesForm: FormGroup;
  incomeForm: FormGroup;
  expensesCategories: any[] | null = []
  incomeCategories: any[] | null = []
  showAlertModal:boolean=false;
  classesModal:string = '';
  messageModal:string = '';
  currentMonth: number = 0;
  currentYear: number = 0;

  constructor(private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private supabase: SupabaseService,private router: Router, private route: ActivatedRoute) {
    const fechaFormateada = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.expensesForm = this.formBuilder.group({
      fecha: [fechaFormateada, Validators.required],
      detalle: ['', sqlInjectionValidator(/['";\-\-]/)],
      categoria: [null],
      monto: ['', [Validators.required, Validators.min(0)]]
    });
    this.incomeForm = this.formBuilder.group({
      fecha: [fechaFormateada, Validators.required],
      detalle: ['', sqlInjectionValidator(/['";\-\-]/)],
      categoria: [null],
      monto: ['', [Validators.required, Validators.min(0)]]
    });
  }

  async ngOnInit(): Promise<void> {
    const currentDate = new Date();
    this.currentYear =  currentDate.getFullYear();
    this.currentMonth = currentDate.getMonth() + 1;
    this.user = await this.supabase.getUser();
    this.getProfile(this.user, this.currentYear,this.currentMonth);
  }
  async getProfile(user:any, currentYear?:number, currentMonth?:number) {
    try {
      const role =  user && user.user_metadata['role'] ? user.user_metadata['role'] : user.user_meta.role;  

      if (role == UserRoles.Normal || role == UserRoles.Premium) {
        this.getCategories(user.id, currentYear, currentMonth);
      } else {
        console.log('se cerro sesion')
        this.supabase.signOut();
        this.router.navigate(['login']);
      }
    } catch (error) {
      console.log(error)
      if (error instanceof Error) {
        this.openAlert('text-red', `${error.message}`);
      }
    }
  }

  getCategories(user_uuid:string, year?:number, month?:number){
      this.supabase.getCategoriesExpenses(user_uuid, year, month)
        .then(resp => {
          this.expensesCategories = resp.category_expense_view;
        })
        .catch(err => console.log(err));

      this.supabase.getCategoriesIncome(user_uuid, year, month)
        .then(resp => {
          this.incomeCategories = resp.category_income;
        })
        .catch(err => console.log(err));
  }


  submitExpenseForm() {

    if (this.expensesForm.valid) {
      const formData = {
        expense_date: this.expensesForm.value.fecha,
        description_expense: this.expensesForm.value.detalle,
        category_expense_id: this.expensesForm.value.categoria,
        expense_amount: this.expensesForm.value.monto,
        user_uuid: this.user.id
      }

      //Service
      this.supabase.insertNewExpense(formData)
        .then(resp =>{
          if (resp.error) {
            console.warn(resp.error)
            this.openAlert('text-red', 'Error al guardar el gasto, intente nuevamente');  
           } else {
            this.openAlert('text-accent', 'Nuevo gasto Guardado');          
          }
        })
        .catch(err => {
          console.warn(err)
          this.openAlert('text-red', 'Error al guardar el gasto, intente nuevamente'); 
        });

      // Restablecer los valores y el estado del formulario
      this.expensesForm.patchValue({
        fecha: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        detalle: '',
        categoria: null,
        monto: ''
      });

    } else {
      this.openAlert('text-red', 'Formulario inválido'); 
    }
  }

  submitIncomeForm() {
    if (this.incomeForm.valid) {
      const formData = {
        income_date: this.incomeForm.value.fecha,
        description_income: this.incomeForm.value.detalle,
        category_income_id: this.incomeForm.value.categoria,
        income_amount: this.incomeForm.value.monto,
        user_uuid: this.user.id
      }

      //Service
      this.supabase.insertNewIncome(formData)
      .then(resp =>{
        if (resp.error) {
          console.warn(resp.error)
          this.openAlert('text-red', 'Error al guardar el ingreso, intente nuevamente'); 
        } else {
          this.openAlert('text-accent', 'Ingreso cargado correctamente');       
        }
      })
      .catch(err => {
        console.warn(err)
        this.openAlert('text-red', 'Error al guardar el ingreso, intente nuevamente'); 
     });
      // Restablecer los valores y el estado del formulario
      this.incomeForm.patchValue({
        fecha: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        detalle: '',
        categoria: null,
        monto: ''
      });
      
    } else {      
      this.openAlert('text-red', 'Formulario inválido'); 
    }
  }

  openAlert(className:string, message:string){
    this.messageModal = message;
    this.classesModal = className;
    this.showAlertModal = true;
  }
  closeAlert(){
    this.messageModal = '';
    this.classesModal = '';
    this.showAlertModal = false;
  }

}
