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