const mongoose = require('mongoose');

const TransactionScheme = new mongoose.Schema(
    {
        user_id:{type:Number},
        category:
        {
            category_id: {type:Number}, //luego traer el nombre
            category_name:{type:String}
        },
        description:{type:String},
        debe:{type:Number},
        haber:{type:Number}
    },

    {
        timestamps: true, //TODO createdAt, updateAt
        versionKey: false
    }
);

module.exports = mongoose.model('transactions', TransactionScheme); // el primer valor es el nombre de la tabla/coleccion