const jwt = require('jsonwebtoken');

module.exports = function(req, resp, next) {
    // Leer el token del header
    const token = req.header('x-auth-token');

    console.log(token)

    // Revisar si no hay token
    if(!token) {
        return resp.status(401).json({ msg: "There's no token, access no allowed" })
    }

    // Validar el token

    try {

        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.usuario;
        next(); // Con esto se va al sigueinte middleware
        
    } catch (error) {
        resp.status(401).json({ msg: 'Not valid Token' })
    }



}