const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { crear } = require('./usuarios');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');



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



const googleSignIn = async (req, res = response) => {


    const { id_token } = req.body;
    
    try {
        
        const {correo, nombre, img } = await googleVerify(id_token);
        
        let usuario = await Usuario.findOne({ correo }); 

        if (!usuario) {
            // tengo que crearlo
            const data = {
                nombre:nombre,
                correo:correo,
                password: 'sss',
                img:img,
                rol:"USER_ROLE",
                google: true
            };
            
            //usuario = await crear(data);
            usuario = new Usuario({...data});
            await usuario.save();
            
        }
        

        // Si el usuario en BD
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

                // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token,  

        });

        
    } 
    catch (error) {
        res.status(400).json({
            msg: 'el token no es valido'
        })
       
    }

}


module.exports = {
    login,
    googleSignIn
}