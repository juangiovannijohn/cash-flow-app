const { transactionModel, userModel } = require('./../models');
const getTransactions = ( ) => { }

const getTransaction = ( ) => { }

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
  

const updateTransaction = () => {}


const deleteTransaction = ( ) => {}







module.exports = { 
    createTransaction
}