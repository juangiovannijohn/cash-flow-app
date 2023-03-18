const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: {
        _id: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String, required: true }
      },
      required: true
    },
    description: {
      type: String,
      required: true
    },
    debit: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value >= 0;
        },
        message: 'El monto debe ser mayor o igual a cero.'
      }
    },
    credit: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value >= 0;
        },
        message: 'El monto debe ser mayor o igual a cero.'
      }
    },

  },
  {
    timestamps: true,
    versionKey: false
  }
);

/*
El validador comprueba si al menos uno de los dos campos es mayor a cero. 
Si ninguno de los dos campos es mayor a cero, se devuelve un mensaje de error.
*/
TransactionSchema.path('debit').validate(function (value) {
  return value > 0 || this.credit > 0;
}, 'Debe haber al menos un monto mayor a cero.');

TransactionSchema.path('credit').validate(function (value) {
  return value > 0 || this.debit > 0;
}, 'Debe haber al menos un monto mayor a cero.');


/*
La función primero busca al usuario correspondiente a la transacción. Si el usuario no existe, la transacción se invalida y se emite un mensaje de error. Si el usuario existe,
se busca la categoría dentro de las categorías del usuario que tenga el mismo nombre que se encuentra en la transacción. Si no se encuentra ninguna categoría con ese nombre,
la transacción se invalida y se emite un mensaje de error. Si se encuentra una categoría con ese nombre, se actualiza el campo de la categoría de la transacción con el id de la categoría correspondiente.
*/
TransactionSchema.pre('validate', async function () {
  const user = await mongoose.model('User').findById(this.user);
  if (!user) {
    this.invalidate('user', 'Usuario inválido');
  } else {
    const category = user.categories.find(category => category.name === this.category.name);
    console.log('en el modelo de transaccion en el validador', category)
    if (!category) {
      this.invalidate('category', 'Categoría inválida');
    } else {
      this.category = category;
    }
  }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;
