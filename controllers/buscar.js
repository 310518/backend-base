

const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto} = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'

];

const buscarUsuarios = async (termino = '', res = response) => {
    
    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            result: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{estado: true}]
    });


    return res.json({
        result: usuarios
    });

}

const buscarCategorias = async (termino = '', res = response) => {
    
    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            result: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({
        $or: [{ nombre: regex }],
        $and: [{estado: true}]
    });


    return res.json({
        result: categorias
    });

}

const buscarProducto = async (termino = '', res = response) => {
    
    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        const producto = await Producto.findById(termino).populate('categoria','nombre');
        return res.json({
            result: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({
        $or: [{ nombre: regex }],
        $and: [{estado: true}]
    }).populate('categoria','nombre');


    return res.json({
        result: productos
    });

}




const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;
    
    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg:`las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        
        case  'usuarios':
            buscarUsuarios(termino, res);

        break;
        case 'categorias':
            buscarCategorias(termino, res);

        break;
        case 'productos':
            buscarProducto(termino, res);

        break;
        
        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta búsqueda'
            })

    }

    
}


module.exports = {
    buscar
}