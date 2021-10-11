const express = require('express');
const cors = require('cors');

const { dbConnection} = require('../database/config');

class Server{

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        // conectar a la base de datos
        this.conectarDB();
        // Middleware
        this.middleware();
        // Rutas de mi app
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middleware() {
        // cors
        this.app.use(cors());
        // Lectura y parceo del body
        this.app.use(express.json());
        // Directorio publico
        this.app.use(express.static('public'));
    }
    
    routes() {

        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}


module.exports = Server;