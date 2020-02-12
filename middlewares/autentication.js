const jwt = require('jsonwebtoken')
const { SEED } = require('../config/config')

//-------------------------------------------------------------------------------
//--- Verificar token recibido a través de un parmametro en la url --------------
//--- No me gusta, me parece más limpio pasarlo en el header --------------------
//-------------------------------------------------------------------------------
exports.verificaToken = function(req, res, next) {
    const token = req.query.token

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'No tiene autorización',
                errors: err
            })
        }

         // En: decoded tengo la información del usuario que ha realizado la llamada
         // lo estoy añadiendo al req, con lo cual puedo identificar a la persona que ha relizado la llamada.
        req.usuario = decoded.usuario
        
        next()
    })
}
