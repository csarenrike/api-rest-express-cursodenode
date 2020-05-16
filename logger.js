function log(req, res, next) {
    console.log('Logging...');
    next();
}

module.exports = log; // exportamos la funcion para que se pueda requerir por otro archivo .js
