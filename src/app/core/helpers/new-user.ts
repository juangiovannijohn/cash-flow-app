//Categories
export const defaultCategoriesExpenses = (user_uuid: string) => {
  return [
    { category_name: 'Comida', user_uuid, category_expense_description: '' },
    { category_name: 'Alquiler', user_uuid, category_expense_description: '' },
    { category_name: 'Servicios', user_uuid, category_expense_description: 'Luz, Gas, Impuestos, Telefonía, etc' },
    { category_name: 'Vehículos', user_uuid, category_expense_description: 'Seguro, Combustible, Limpieza, etc' },
  ]
};


export const defaultCategoriesIncomes = (user_uuid: string) => {
  return [
    { category_name: 'Sueldo', user_uuid, category_income_description: '' },
    { category_name: 'Emprendimiento', user_uuid, category_income_description: '' },
    { category_name: 'Otros', user_uuid, category_income_description: '' },
  ]
};

//Budgets
export const defaultBudgetsExpenses = (arrCategoriesExpenses: any) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const dataMany = arrCategoriesExpenses.map((item: any) => {
    return { budget_date: `${currentYear}-${currentMonth}-01`, category_id: item.id, budget_expected: 1000, user_uuid: item.user_uuid }
  })
  return dataMany
};

export const defaultBudgetsIncomes = (arrCategoriesIncomes: any) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const dataMany = arrCategoriesIncomes.map((item: any) => {
    return { budget_date: `${currentYear}-${currentMonth}-01`, category_id: item.id, budget_expected: 1000, user_uuid: item.user_uuid }
  })
  return dataMany
};

//Transactions
export const defaultTrxExpenses = (arrTrxExpenses: any) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const desiredCategories = ["Alquiler", "Comida"];

  const filteredData = arrTrxExpenses.filter((item: any) => desiredCategories.includes(item.category_name));
  console.log(filteredData);

  const dataMany = filteredData.map((item: any, i:number) => {
    return { category_expense_id: item.id , description_expense: 'Gasto de prueba, luego borrar o editar', expense_amount: 1000+i, expense_date: `${currentYear}-${currentMonth}-01`, user_uuid: item.user_uuid }
  })
  return dataMany
};

export const defaultTrxIncomes = (arrTrxIncomes: any) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const desiredCategories = ["Sueldo"];

  const filteredData = arrTrxIncomes.filter((item: any) => desiredCategories.includes(item.category_name));
  console.log(filteredData);

  const dataMany = filteredData.map((item: any) => {
    return { category_income_id: item.id, description_income: 'Ingreso de prueba, luego borrar o editar', income_amount: 2001, income_date: `${currentYear}-${currentMonth}-01`, user_uuid: item.user_uuid }
  })
  return dataMany
};

