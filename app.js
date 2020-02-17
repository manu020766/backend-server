// Librerias y utilidades
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// Inicializaciones
const app = express()

//Configurar body parser
app.use(bodyParser.urlencoded({ extended: false })) //Parse application/x-www-form-urlencoded
app.use(bodyParser.json()) //Parse application/json

// Conexión a base de datos de mongo
mongoose.connection.openUri('mongodb+srv://manuSi:MongoDbManu1966@manucluster-hltsu.mongodb.net/hospitalDB', { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online')
})

// Routes
const uploadRoutes = require('./routes/upload')
const busquedaRoutes = require('./routes/busqueda')
const medicoRoutes = require('./routes/medico')
const hospitalRoutes = require('./routes/hospital')
const loginRoutes = require('./routes/login')
const usuarioRoutes = require('./routes/usuario')
const appRoutes = require('./routes/app')

app.use('/upload', uploadRoutes)
app.use('/busqueda', busquedaRoutes)
app.use('/medico', medicoRoutes)
app.use('/hospital', hospitalRoutes)
app.use('/login', loginRoutes)
app.use('/usuario', usuarioRoutes)
app.use('/', appRoutes)

// Servidor
app.listen(3000, console.log('Server listening port 3000: \x1b[32m%s\x1b[0m', 'online'))
