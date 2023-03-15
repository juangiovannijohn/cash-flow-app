const mongoose = require('mongoose');

const CategoryScheme = new mongoose.Schema(
    {
        name:{type:String},
        user_id:{type:Number}, //relacionado con otra coleccion ?

    },

    {
        timestamps: true, //TODO createdAt, updateAt
        versionKey: false
    }
);

module.exports = mongoose.model('categories', CategoryScheme); // el primer valor es el nombre de la tabla/coleccion