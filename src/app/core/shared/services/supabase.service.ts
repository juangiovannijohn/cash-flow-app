import { Injectable } from '@angular/core'
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'
import { environment } from 'src/environments/environment'
import { CategoryType } from '../../models-interface/enums'
import { TransactionsDetails } from '../../models-interface/interfaces'

export interface Profile {
  id?: string
  username: string
  website: string
  avatar_url: string
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient
  _session: AuthSession | null = null

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  // AUTH
  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session
    })
    return this._session
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single()
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email })
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    }

    return this.supabase.from('profiles').upsert(update)
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path)
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file)
  }

  //  TRANSACTIONS
  async getCategoriesExpenses(user_uuid: string) {

    let { data: category_expense, error } = await this.supabase
      .from('category_expense')
      .select('*')
      .eq('user_uuid', user_uuid)
    return { category_expense, error };
  }
  async getCategoriesIncome(user_uuid: string) {

    let { data: category_income, error } = await this.supabase
      .from('category_income')
      .select('*')
      .eq('user_uuid', user_uuid)
    return { category_income, error };
  }

  async insertNewExpense(formData: {
    expense_date: string,
    description_expense: string,
    category_expense_id: number | string,
    expense_amount: number,
    user_uuid: string
  }) {

    const { data, error } = await this.supabase
      .from('expenses')
      .insert([
        formData
      ])
    return { data, error };
  }
  async insertNewIncome(formData: {
    income_date: string,
    description_income: string,
    category_income_id: number | string,
    income_amount: number,
    user_uuid:string
  }) {

    const { data, error } = await this.supabase
      .from('income')
      .insert([
        formData
      ])
    return { data, error };
  }

  //BALANCE
  async getTransactions() {

    const { data: transactions_details, error } = await this.supabase
      .from('transactions_details')
      .select('*')
      .eq('user_uuid', '8085f1c3-464a-4a01-8878-555277c367e0');

    //Refactorizacion de info
    const transactions = transactions_details?.map( (item:any) => {
      if (item.transaction_type == CategoryType.Expense) {
        item.amount = item.expense_amount * -1;
      }else if (item.transaction_type == CategoryType.Income){
        item.amount = item.income_amount;
      }
      else{
        item.amount = 0;
      }
      return item;

    }) 
    return { transactions, error };
  }

}