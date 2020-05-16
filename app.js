const inicioDebug =require('debug')('app:inicio');
const dbDebug = require('debug')('app:db'); // base de datos
const express = require('express');
const morgan = require('morgan');
const config = require('config');

//const logger = require('./logger');
const app = express();
const Joi = require('@hapi/joi');

app.use(express.json()); // body
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

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

const usuarios = [
    {id:1, nombre:'Cesar'},
    {id:2, nombre:'Michelle'},
    {id:3, nombre:'Islava'}
]

app.get('/', (req, res) => {
    res.send('hola mundo desde express');
})

app.get('/api/usuarios', (req,res) => {
    res.send(usuarios);
});

app.get('/api/usuarios/:id',(req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
});

app.post('/api/usuarios',(req,res) => {
   
    const {error,value} = validarUsuario(req.body.nombre);
    if(!error) {
        const usuario = {
            id: usuarios.length + 1,
            nombre: value
        };
        usuarios.push(usuario);
        res.send(usuario);
    }else{
        const mensaje = error.details[0].message;

        res.status(400).send(mensaje)
    }

  
});

app.put('/api/usuarios/:id',(req, res) => {
// buscar el usuario

let usuario = existeUsuario(req.params.id);
if(!usuario) {
    res.status(404).send('El usuario no fue encontrado');
    return;
} 

const {error, value} = validarUsuario(req.body.nombre);
if(error) {
    const mensaje = error.details[0].message;
    res.status(400).send(mensaje);
    return;
}

usuario.nombre = value.nombre;
res.send(usuario);

});

app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send("El usuario no fue encontrado");
        return;
    }
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index,1);
    res.send(usuario); 
// usuario = usuario eliminado
// usuarios = todos los usuarios
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Escuchando por el puerto  ${port}`);
});

function existeUsuario(id) {
    return(usuarios.find(u => u.id === parseInt(id)));
}

function validarUsuario(nom) {
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    return (schema.validate({ nombre: nom}));    
}

