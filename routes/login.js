const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')
const { SEED } = require('../config/config')

// Rutas

//========================================
//--- Login con google sign-in
//========================================
//--- Inicialización
const { OAuth2Client } = require('google-auth-library')
const { CLIENT_ID } = require('../config/config')

const client = new OAuth2Client(CLIENT_ID)

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub']
    // If request specified a G Suite domain:  //const domain = payload['hd'];
    console.log('payload', payload)
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
        payload
    }
}

// http://localhost:3000/login/google/eyJhbGciO...
// router.get('/google/:token', async (req, res) => {
// const token = req.params.token

//http://localhost:3000/login/google?token=eyJhbGciOiJS
// router.get('/google', async (req, res) => {
// const token = req.query.token

router.post('/google', async (req, res) => {

    const token = req.body.token

    const googleUser = await verify(token)
        .catch(err => {
            res.status(400).json({
                ok: false,
                mensaje: 'token no váido'
            })
        })

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'No se puede recuperar la información del usuario'
            })
        }

        if (usuarioDB) {
            if (!usuarioDB.google) {
                res.status(400).json({
                    ok: false,
                    mensaje: 'Este usuario no puede autenticarse con google'
                })
            } else {
                res.status(200).json({
                    ok: true,
                    usuarioDB,
                    id: usuarioDB._id,
                    token
                })
            }
        } else {
            const nuevoUsuario = new Usuario()
            nuevoUsuario.nombre = googleUser.nombre
            nuevoUsuario.email = googleUser.email
            nuevoUsuario.password = ':)'
            nuevoUsuario.img = googleUser.img
            nuevoUsuario.google = true

            nuevoUsuario.save((err, usuarioDB) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'No se puede guardar la información del usuario'
                    })
                }

                const token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }) // 4 horas
                res.status(200).json({
                    ok: true,
                    usuarioDB,
                    id: usuarioDB._id,
                    token
                })
            })
        }
    })

    // res.status(200).json({ ok: true, googleUser })
    // res.status(200).json({ token })
})


//----------------------------------------
//--- Login un usuario ------------------
//----------------------------------------
router.post('/', (req, res) => {

    const body = req.body
    // ====================================
    // Metodo dos
    // ====================================
    Usuario.findOne({ email: body.email })
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