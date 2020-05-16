const inicioDebug =require('debug')('app:inicio');
const dbDebug = require('debug')('app:db'); // base de datos

const usuarios = require('./routes/usuarios')
const express = require('express');
const morgan = require('morgan');
const config = require('config');

const app = express();

app.use(express.json()); // body
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/api/usuarios', usuarios);

// configuracion de entornos
console.log('Aplicacion: ' + config.get('nombre'));
console.log('BD server: ' + config.get('configDB.host'));

// uso de middelware de terceros - morgan
if (app.get('env') === 'development') {
app.use(morgan('tiny'));
//console.log('morgan habilitado');
inicioDebug('morgan habilitado');

}

// trabajo de la base de datos
dbDebug('Conectando con la base de datos');

app.get('/', (req, res) => {
    res.send('hola mundo desde express');
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Escuchando por el puerto  ${port}`);
});



