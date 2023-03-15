require('dotenv').config(); //para variables de entorno
const express = require('express'); //para crear la api
const cors = require('cors'); //para no tener errores con los navegadores
const {dbConexion} = require('./config/mongo')

const app = express();
app.use(cors());
const port = process.env.PORT || 3000

//lamamos rutas

app.use('/api', require('./routes'))


app.listen( port, ()=> {
    console.log(`app lista en http://localhost:${port}`);
})
dbConexion();