const mongoose = require('mongoose');

const UserScheme = new mongoose.Schema(
    {
        email:{type:String, unique:true},
        pass:{type:String}, //haseada?
        role:{type:["user", "admin", "public"], default: "user"}, //tipo enum
        name:{type:String},
        lastname:{type:String},
        bithday:{type:String}, //fecha ??
        contry:{type:String},
        city:{type:String},
    },

    {
        timestamps: true, //TODO createdAt, updateAt
        versionKey: false
    }
);

module.exports = mongoose.model('users', UserScheme); // el primer valor es el nombre de la tabla/coleccion