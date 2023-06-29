import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

import { sqlInjectionValidator } from 'src/app/core/helpers/sqlInjectionValidator';

import { DatePipe } from '@angular/common';
import { SupabaseService } from 'src/app/core/shared/services/supabase.service';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.css']
})
export class NewTransactionComponent implements OnInit {
  user_uuid: string = '8085f1c3-464a-4a01-8878-555277c367e0'
  expensesForm: FormGroup;
  incomeForm: FormGroup;
  expensesCategories: any[] | null = []
  incomeCategories: any[] | null = []

  expensesTrue:boolean = false;
  showMsg: boolean = false;
  msgSuccess: boolean = false;
  msgText: string = '';

  constructor(private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private supabase: SupabaseService) {
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

  ngOnInit(): void {

    this.supabase.getCategoriesExpenses(this.user_uuid)
      .then(resp => {
        console.log(resp);
        this.expensesCategories = resp.category_expense;
      })
      .catch(err => console.log(err));

    this.supabase.getCategoriesIncome(this.user_uuid)
      .then(resp => {
        console.log(resp);
        this.incomeCategories = resp.category_income;
      })
      .catch(err => console.log(err));
  }
  submitExpenseForm() {

    if (this.expensesForm.valid) {
      console.log(this.expensesForm.value);
      const formData = {
        expense_date: this.expensesForm.value.fecha,
        description_expense: this.expensesForm.value.detalle,
        category_expense_id: this.expensesForm.value.categoria,
        expense_amount: this.expensesForm.value.monto,
        user_uuid: this.user_uuid
      }
      console.log({ formData });

      //Service
      this.supabase.insertNewExpense(formData)
        .then(resp =>{
          if (resp.error) {
            console.warn(resp.error)
            this.showAlert(true,true, false, 'Error al guardar el gasto, intente nuevamente', 3000);
          } else {
            console.log(resp)
            this.showAlert(true,true, true, 'Nuevo gasto guardado', 3000);           
          }
        })
        .catch(err => {
          console.warn(err)
          this.showAlert(true, true, false, 'Error al guardar el gasto, intente nuevamente', 3000);
        });

      // Restablecer los valores y el estado del formulario
      this.expensesForm.patchValue({
        fecha: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        detalle: '',
        categoria: null,
        monto: ''
      });

    } else {
      this.showAlert(true,true, false, 'Formulario inválido', 3000);
      console.log(this.expensesForm.controls['fecha'].errors);
      console.log(this.expensesForm.controls['detalle'].errors);
      console.log(this.expensesForm.controls['categoria'].errors);
      console.log(this.expensesForm.controls['monto'].errors);
    }
  }
  submitIncomeForm() {
    if (this.incomeForm.valid) {
      console.log(this.incomeForm.value);
      const formData = {
        income_date: this.incomeForm.value.fecha,
        description_income: this.incomeForm.value.detalle,
        category_income_id: this.incomeForm.value.categoria,
        income_amount: this.incomeForm.value.monto,
        user_uuid: this.user_uuid
      }
      console.log({ formData });

      //Service
      this.supabase.insertNewIncome(formData)
      .then(resp =>{
        if (resp.error) {
          console.warn(resp.error)
          this.showAlert(false,true, false, 'Error al guardar el ingreso, intente nuevamente', 3000);
        } else {
          console.log(resp)
          this.showAlert(false,true, true, 'Nuevo ingreso guardado', 3000);           
        }
      })
      .catch(err => {
        console.warn(err)
        this.showAlert(false, true, false, 'Error al guardar el ingreso, intente nuevamente', 3000);
      });
      // Restablecer los valores y el estado del formulario
      // Restablecer los valores y el estado del formulario
      this.incomeForm.patchValue({
        fecha: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        detalle: '',
        categoria: null,
        monto: ''
      });
      
    } else {      
      this.showAlert(false,true, false, 'Formulario inválido', 3000);
      console.log(this.incomeForm.controls['fecha'].errors);
      console.log(this.incomeForm.controls['detalle'].errors);
      console.log(this.incomeForm.controls['categoria'].errors);
      console.log(this.incomeForm.controls['monto'].errors);
    }
  }

  showAlert(expensesTrue: boolean, showMsg:boolean, msgSuccess:boolean, msgText:string, time:number){
    this.expensesTrue = expensesTrue
    this.showMsg = showMsg;
    this.msgSuccess = msgSuccess;
    this.msgText = msgText;
    setTimeout(()=>{
      this.showMsg = false;
      this.msgSuccess = false;
      this.msgText = '';
    }, time);
  }

}
