const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name:{type:String,  required: true},
        type: {
            type: String,
            enum: ['Gasto', 'Ingreso'],
            required: true
          },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
          }, 

    },

    {
        timestamps: true, //TODO createdAt, updateAt
        versionKey: false
    }
);

const Category =  mongoose.model('Category', categorySchema); // el primer valor es el nombre de la tabla/coleccion
module.exports = Category