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