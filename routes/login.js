const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuario')

// Rutas

//----------------------------------------
//--- Login un usuario ------------------
//----------------------------------------
router.post('/', (req, res) => {

    const body = req.body

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No se pudo encontrar el usuario'
            })
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuarion con email ' + body.email + ' no encontrado'
            })
        }

        bcrypt.compare(body.password, usuarioDB.password)
            .then( isMatch => {
                console.log(isMatch)

                if(!isMatch) {
                    console.log('paso por aquí')
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Usuarion con password ' + body.password + ' no encontrado',
                        respuesta: res
                    })
                }

                res.status(200).json({
                    ok: true,
                    mensaje: usuarioDB,
                    passwordLogin: body.password,
                    passwordDB: usuarioDB.password
                })
            })
            .catch( e => {
                res.status(400).json({
                    ok: false,
                    mensaje: 'Usuarion con password ' + body.password + ' no encontrado',
                    porras: 'mierda',
                    passwordLogin: body.password,
                    passwordDB: usuarioDB.password
                })
            })
    })
})

module.exports = router