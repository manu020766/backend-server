const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')

// Rutas

//----------------------------------------
//--- Login un usuario ------------------
//----------------------------------------
router.post('/', (req, res) => {

    const body = req.body
    // ====================================
    // Metodo dos
    // ====================================
    Usuario.findOne({ usuario: body.usuario })
    .then((usuarioDB) => {
        if(!usuarioDB){
            return res.status(401).json({
                ok: false,
                mensaje: 'Credenciales incorrectas!',
                errors: { message: 'Credenciales incorrectas!' }
            });
        }
        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(401).json({
                ok : false,
                mensaje: 'Credenciales incorrectas!',
                errors: { message: 'Credenciales incorrectas' }
            });
        }

        const SEED = '>>>@este-es-un-seed-DIFICULTAD-100;)<<<'
        usuarioDB.password = ':)'
        const token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }) // 4 horas
        res.status(200).json({
            ok: true,
            usuarioDB,
            id: usuarioDB._id,
            token
        })
    })
    .catch((err) => {
        res.status(400).json({
            ok: false,
            mensaje: 'Error al procesar la solicitud!',
            errors: err
        });
    });

// ====================================
// Metodo uno - Funciona correctamente
// ====================================
// Usuario.findOne({ usuario: body.usuario }, (err, usuarioDB) => {
 
//     if(err){
//         return res.status(500).json({
//             ok: false,
//             mensaje: 'Error al procesar la solicitud!',
//             errors: err
//         })
//     }
    
//     if(!usuarioDB){
        
//         return res.status(401).json({
//             ok: false,
//             mensaje: 'Credenciales incorrectas!',
//             errors: { message: 'Credenciales incorrectas' }
//         })
//     }
    
//     if(!bcrypt.compareSync(body.password, usuarioDB.password)){
//         return res.status(401).json({
//             ok : false,
//             mensaje: 'Credenciales incorrectas!',
//             errors: { message: 'Credenciales incorrectas' }
//         })
//     }
 
//     usuarioDB.password = ':)'
 
//     const token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 })
 
//     res.status(200).json({
//         ok: true,
//         usuarioDB,
//         id: usuarioDB._id,
//         token
//     })
// })
 
 
})

module.exports = router