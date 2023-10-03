export interface TransactionsDetails {
    amount:number;
    expense_amount : number;
    income_amount: number;
    transaction_category: string; 
    transaction_date: string | Date; 
    transaction_description: string;
    transaction_id: number;
    transaction_type: string; 
    user_uuid: string;
  }

  export interface TransactionHistory {
    id:            number;
    category_id:   number;
    category_name: null | string;
    description:   string;
    date:          Date;
    amount:        number;
    user_uuid:     string;
    typeExpense:   boolean;
    showFormEdit:  boolean;
}

export interface Plans {
  id:                number;
  plan_price_yearly: number | null;
  isMoustUsed:       boolean;
  plan_note:         string;
  plan_title:        string;
  plan_type:         string;
  plan_price_montly: number | null;
  plan_items:        string[];
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

