const mongoose = require("mongoose");

const dbConexion = async () => {
  try {
    const DB_URI = process.env.DB_URI
    await mongoose.connect(DB_URI, {});
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.log(error);
    throw new Error("Error al conectar con Base de Datos");
  }
};

module.exports = {
  dbConexion,
};
  