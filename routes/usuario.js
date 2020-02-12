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
//--- Actualizar un usuario --------------
//----------------------------------------
router.put('/:id', (req, res) => {

    const id = req.params.id
    const body = req.body

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            })
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id: ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese id' }
            })
        }

        usuario.nombre = body.nombre
        usuario.email = body.email
        usuario.role = body.role

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: err
                })
            }

            usuarioGuardado.password = ':)'
    
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            })
        })
    })   
})

//----------------------------------------
//--- Borrar un usuario ------------------
//----------------------------------------
router.delete('/:id', (req, res) => {
    const id = req.params.id

    Usuario.findByIdAndDelete(id, (err, usuarioDelete) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'No se ha podido borrar el usuario',
                errors: err
            })
        }

        res.status(200).json({
            ok: true,
            mensaje: 'Usuario borrado'
        })
    })
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