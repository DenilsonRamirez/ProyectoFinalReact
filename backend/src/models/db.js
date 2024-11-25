const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost', //AQUI IRIA LA URL DEL DOMINIO WEB
    user: 'root',
    password: '',
    database: 'project_jwt'
});


module.exports = connection;