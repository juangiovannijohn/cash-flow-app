export enum CategoryType {
    Expense = 'e',
    Income = 'i'
}

  export enum BudgetPercentage {
    Warning = 75,
    Danger = 90,
    Over = 100
  }

  export enum BudgetAlertClass {
    Normal = 'text-text',
    Warning = 'text-warning',
    Danger = 'text-red'
  }
  export enum UserRoles {
    NoLogueado = '', //Los navegantes que no crearon su usuario
    Normal = 'user', //los usuarios Free
    Premium = 'juangiovannijohn', //los usuarios que pagan
    Admin = 'jgj', //el rey
    Colaborador = 'colaborador' //los ayudantes
  }