// Librerias y utilidades
const express = require('express')


// Inicializaciones
const app = express()
const mongoose = require('mongoose')

// Conexión a base de datos de mongo
mongoose.connection.openUri('mongodb+srv://manuSi:MongoDbManu1966@manucluster-hltsu.mongodb.net/hospitalDB', (err, res) => {
    if (err) throw err
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online')
})


// Rutas
app.get('/', (req, res) => {
    res.status(200).json({ mensaje: 'Hola mundillo!!!' })
})


// Servidor
app.listen(3000, console.log('Server listening port 3000: \x1b[32m%s\x1b[0m', 'online'))
