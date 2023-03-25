const { transactionModel, userModel } = require('./../models');
const getTransactions = async (req, res) => {
  const { id } = req.query;
  console.log({id})

  let msg;
  try {
    const transactions = await transactionModel.find({user: id });
     //console.log({transactions})
    if (transactions.length != 0) {
      msg = 'Si tiene transacciones'
    }else{
      msg = 'No tiene transacciones'
    }
    res.status(200).json({
      ok: true,
      transactions,
      msg
    });

  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      ok:false,
      msg: error.message 
    });
  }
};

const getTransaction = async (req, res) => {
  const { _id } = req.body;
  try {
    const transaction = await transactionModel.findById(_id);
    if (!transaction) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontró la transacción'
      });
    }
    res.status(200).json({
      ok: true,
      data: transaction
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      ok: false,
      msg: error.message
    });
  }
};

const createTransaction = async (req, res) => {
    const { user, category, description, debit, credit } = req.body;
    try {
      // Buscamos el usuario en la base de datos y poblamos la propiedad categories
      const userPopulated = await userModel.findById(user).populate('categories');
      if (!userPopulated) {
        return res.status(404).json({
          ok: false,
          msg: 'El usuario no existe'
        });
      }
      console.log({userPopulated});
      const arrCategories = userPopulated.categories
      // Buscamos la categoría por nombre en el array categories del objeto userPopulated
      const categoryFound = arrCategories.find(
        (categoryItem) => categoryItem.name === category
      );
      console.log(categoryFound);
      if (!categoryFound) {
        return res.status(404).json({
          ok: false,
          msg: 'La categoría no existe para este usuario'
        });
      }
      // Creamos una nueva transacción utilizando el modelo
      const transaction = await transactionModel.create({
        user,
        category: categoryFound,
        description,
        debit,
        credit
      });
  
      res.status(201).json({
        success: true,
        message: 'Transacción creada exitosamente',
        data: transaction
      });
    } catch (error) {
      console.log({ error });
      return res.status(500).json({
        ok: false,
        msg: 'Error al crear la transacción'
      });
    }
  };
  

const updateTransaction = async (req, res) => {
  const { _id, category, description, debit, credit } = req.body;
  try {
    const transaction = await transactionModel.findById(_id);
    if (!transaction) {
      return res.status(404).json({
        ok: false,
        msg: 'La transacción no existe'
      });
    }
    if (category) {
      transaction.category.name = category;
    }
    if (description) {
      transaction.description = description;
    }
    if (debit) {
      transaction.debit = debit;
    }else if(debit == 0){
      transaction.debit = 0;
    }
    if (credit) {
      transaction.credit = credit;
    }else if(credit == 0){
      transaction.credit = 0;
    }
    const updatedTransaction = await transaction.save();
    res.status(200).json({
      ok: true,
      message: 'Transacción actualizada exitosamente',
      data: updatedTransaction
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error al actualizar la transacción'
    });
  }
};


const deleteTransaction = async (req, res) => {
  const { _id } = req.body;
  try {
    const deletedTransaction = await transactionModel.findByIdAndDelete(_id);
    if (!deletedTransaction) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontró la transacción'
      });
    }
    res.status(200).json({
      ok: true,
      msg: 'Transacción eliminada exitosamente',
      data: deletedTransaction
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      ok: false,
      msg: error.message
    });
  }
};







module.exports = { 
    getTransactions,
    getTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction
}