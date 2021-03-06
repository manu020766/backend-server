const { Router } = require('express')
const router = Router()

const Medico = require('../models/medico')
const { verificaToken } = require('../middlewares/autentication')


router.get('/', (req, res) => {
    const MINIMO_MOSTRAR = 5
    let desde = parseInt(req.query.desde)
    let mostrar = parseInt(req.query.mostrar)

    desde = isNaN(desde) ? 0 : desde
    mostrar = isNaN(mostrar) ? MINIMO_MOSTRAR : mostrar

    desde = desde < 0 ? 0 : desde
    mostrar = mostrar < 0 ? MINIMO_MOSTRAR : mostrar

    Medico.find({})
        .skip(desde)
        .limit(mostrar)
        .exec((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok:false,
                    mensaje: 'No se han podido recuperar los médicos',
                    erros: err
                })
            }

            Medico.countDocuments({}, (err, total)=>{
                if (err) {
                    res.status(500).json({
                        ok: false,
                        mensaje: 'No se puede recuperar los médicos',
                        errors: err
                    })
                }

                res.status(200).json({
                    ok: true,
                    medicos,
                    total
                })
            })
        })
})

//-------------------------------------
//--- Borrar un médico ----------------
//-------------------------------------

router.delete('/:id', verificaToken, (req, res) => {
    const id = req.params.id

    Medico.findByIdAndDelete(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No se ha podido borrar el medico',
                errors: err
            })
        }

        res.status(200).json({
            ok: true,
            hospital: medicoBorrado,
            usuarioToken: req.usuario
        })
    })
})

//-------------------------------------
//--- Crear un médico -----------------
//-------------------------------------
router.post('/', verificaToken, (req, res) => {
    const body = req.body

    const medico = new Medico({
        nombre: body.nombre,
        img: null,
        usuario: req.usuario._id,
        hospital: body.hospital // por defecto le meto en el hospital central
    })

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No se ha podigo guardar el médico',
                errors: err
            })
        }

        res.status(200).json({
            ok: true,
            medico: medicoGuardado,
            usuarioToken: req.usuario
        })
    })
})

//-------------------------------------
//--- Crear un médico -----------------
//-------------------------------------
router.put('/:id', verificaToken, (req, res)=> {
    const id = req.params.id
    const body = req.body

    Medico.findById(id, (err, medico)=> {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No se puede actualizar el médico',
                errors: err 
            })
        }

        if (!medico) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Médico no encontrado'
            })
        }

        medico.nombre = body.nombre     // Modifico solo el nombre del Médico
        medico.usuario = req.usuario    // Modifico el usuario
        medico.hospital = body.hospital // Modifico el hospital

        medico.save((err, medicoGuardado) =>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se ha podido actualizar el médico',
                    errors: err
                })
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado,
                usuarioToken: req.usuario
            })
        })
    })

})



module.exports = router
