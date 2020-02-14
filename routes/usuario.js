const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuario')

const { verificaToken } = require('../middlewares/autentication')

// Rutas

//----------------------------------------
//--- Recuperar todos los usuarios -------
//----------------------------------------
router.get('', (req, res) => {

    const MINIMO_MOSTRAR = 5
    let desde = parseInt(req.query.desde)
    let mostrar = parseInt(req.query.mostrar)

    desde = isNaN(desde) ? 0 : desde
    mostrar = isNaN(mostrar) ? MINIMO_MOSTRAR : mostrar

    desde = desde < 0 ? 0 : desde
    mostrar = mostrar < 0 ? MINIMO_MOSTRAR : mostrar

    Usuario.find({},'nombre email role img')
        .skip(desde)
        .limit(mostrar)
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
router.put('/:id', verificaToken , (req, res) => {

    const id = req.params.id
    const body = req.body

    Usuario.findById(id, 'nombre email role', (err, usuario) => {
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
    
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
                usuarioToken: req.usuario // Usuario que ha solicitado hacer la modificación
            })
        })
    })   
})

//----------------------------------------
//--- Borrar un usuario ------------------
//----------------------------------------
router.delete('/:id', verificaToken, (req, res) => {
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
            mensaje: usuarioDelete,
            usuarioToken: req.usuario // Usuario que ha solicitado borrar el usuario
        })
    })
})

//----------------------------------------
//--- Grabar un usuario ------------------
//----------------------------------------
router.post('/', verificaToken, (req, res) => {
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
            usuario: usuarioGuardado,
            usuarioToken: req.usuario // Usuario que ha solicitado crear el usuario
        })
    })
})

module.exports = router