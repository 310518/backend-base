const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { existeCategoriaPorId } = require('../helpers/db-validators');

const { crearCategoria,obtenerCategorias, obtenerCategoria,actualizarCategoria, borrarCategoria } = require('../controllers/categorias')



// Url/api/categorias  
const router = Router();



// Obtener todas las categorias - publico

router.get('/', obtenerCategorias);

//router.get('/obtener', obtenerCategorias);
// Obtener categoria por id - publico , todos los q requieran el id: se tiene q hacer una validacion personalizada ...middlewares... 

router.get('/:id', [
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],obtenerCategoria); 

// Crear categoria - privado - cualquier persona con un token valido

router.post('/', [
     validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar registro por id - privado - cualquier persona con un token

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

// borrar una categoria - ADMIN

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);

module.exports = router; 