const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, resp) => {

    // Revisar si hay errores

    const errors = validationResult(req);

    if ( !errors.isEmpty() ) {
        return resp.status(400).json({ errors: errors.array() })
    }

    // Extraer email y password
    const { email, password } = req.body;
    
    try {
        let usuario = await Usuario.findOne({ email });

        if ( usuario ) {
            return resp.status(400).json({ msg: 'The user already exists' });
        }

        // Crea el nuevo usuario
        usuario = new Usuario(req.body);

        // Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        // Guardar usuario
        await usuario.save();

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
        console.log(error);
        resp.status(400).send('An error was ocurred')
    }

}