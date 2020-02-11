const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuario')

// Rutas

//----------------------------------------
//--- Recuperar todos los usuarios -------
//----------------------------------------
router.get('/', (req, res) => {
    Usuario.find({},'nombre email role password')
        .sort('-nombre') //con el signo - delante orden desc, sin signo asc
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'No se pueden recuperar los usuarios',
                        errors: err
                    })
                }
                
                res.status(200).json({
                    ok: true,
                    usuarios
                    })
            }
        )
})


//----------------------------------------
//--- Grabar un usuario ------------------
//----------------------------------------
router.post('/', (req, res) => {
    const body = req.body

    const usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //contraseña de pruebas para todos los registros: 123456
        img: body.img,
        role: body.role
    })

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: 'No se ha podido guardar el usuario',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        })
    })
})

module.exports = router