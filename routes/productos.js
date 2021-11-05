

const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const { obtenerProductos, obtenerProducto,crearProducto, actualizarProducto, borrarProducto }= require('../controllers/productos')



// Url/api/productos  
const router = Router();



// Obtener todas las productos - publico

router.get('/', obtenerProductos);

//router.get('/obtener', obtenerCategorias);
// Obtener categoria por id - publico , todos los q requieran el id: se tiene q hacer una validacion personalizada ...middlewares... 

router.get('/:id', [
    check('id', 'No es un id de Mongo valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],obtenerProducto); 

// Crear categoria - privado - cualquier persona con un token valido

router.post('/', [
     validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

// Actualizar registro por id - privado - cualquier persona con un token

router.put('/:id', [
    validarJWT,
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

// borrar una categoria - ADMIN

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);

module.exports = router; 