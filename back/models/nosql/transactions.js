const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      validate: {
        validator: async function (value) {
          const category = await mongoose.model('Category').findById(value);
          if (!category) {
            return false;
          }
          return category.user.toString() === this.user.toString();
        },
        message: 'Categoria inválida'
      }
    },
    description: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: 'El monto debe ser mayor a cero.'
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction
