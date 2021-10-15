const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');


const login = async (req, res = response) => {


    const { correo, password } = req.body;

    try {

        // verificar si el email existe con
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usiario/ Pasaword n son correctos'
            });
        }

        // Si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usiario/ Pasaword no son correctos -correo'
            });
        }

        // verificar contaseña
        const validpassword = bcryptjs.compareSync(password, usuario.password);
        if (!validpassword) {
            return res.status(400).json({
                msg: 'Usiario/ Pasaword no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
    })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'contactese con el administrador'
        });
    }





}


module.exports = {
    login
}