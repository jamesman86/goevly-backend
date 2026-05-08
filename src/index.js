const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth.routes')

const app = express()

// Middlewares
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}))
app.use(express.json())

// Rutas
app.get('/', (req, res) => {
  res.json({ message: '🌊 Goevly API funcionando!' })
})

app.use('/api/auth', authRoutes)

// Puerto
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`✅ Servidor Goevly corriendo en puerto ${PORT}`)
})