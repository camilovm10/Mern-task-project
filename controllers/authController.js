const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, resp) => {

    // Revisar si hay errores

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) {
        return resp.status(400).json({ errors: errors.array() })
    }

    // Extraer email y password 
    const { email, password } = req.body;

    try {
        
        // Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({ email });

        if(!usuario) {
            return resp.status(400).json({ msg: "The user doesn't exist" })
        }

        // Revisar su password

        const passCorrecto = await bcryptjs.compare(password, usuario.password);

        if(!passCorrecto) {
            return resp.status(400).json({ msg: 'Incorrect Password' })
        }

        // Si todo es correcto

        // Crear el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // Firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 // segundos
        }, (error, token) => {
            if (error) throw error;

            // Mensaje de confirmacion
            resp.json({ token });
        })

    } catch (error) {
        console.log(error)
    }

}


// Obtiene que usuario esta autenticado

exports.usuarioAutenticado = async (req, resp) => {
    try {
        const usuario = await (await Usuario.findById(req.usuario.id));
        resp.json({usuario});
    } catch (error) {
        console.log(error);
        resp.status(500).json({ msg: 'An error was ocurred' });
    }
}