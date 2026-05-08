const express = require('express')
const cors = require('cors')
require('dotenv').config()

const db = require('./db')

// Crear tablas si no existen
const initDB = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre_completo VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        telefono VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        rol VARCHAR(20) DEFAULT 'turista',
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await db.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        descripcion VARCHAR(200),
        icono VARCHAR(10)
      )
    `)

    await db.query(`
      CREATE TABLE IF NOT EXISTS propietarios (
        id SERIAL PRIMARY KEY,
        nombre_completo VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        telefono VARCHAR(20),
        contrasena VARCHAR(255) NOT NULL,
        nombre_negocio VARCHAR(100),
        tipo_negocio VARCHAR(50),
        descripcion TEXT,
        direccion VARCHAR(200),
        horario VARCHAR(100),
        activo BOOLEAN DEFAULT FALSE,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await db.query(`
      CREATE TABLE IF NOT EXISTS servicios (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(100) NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10,2),
        imagen VARCHAR(500),
        categoria VARCHAR(50),
        subcategoria VARCHAR(50),
        ubicacion VARCHAR(200),
        horario VARCHAR(100),
        telefono VARCHAR(20),
        rating DECIMAL(2,1) DEFAULT 0.0,
        activo BOOLEAN DEFAULT TRUE,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await db.query(`
      CREATE TABLE IF NOT EXISTS reservas (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id),
        servicio_id INTEGER REFERENCES servicios(id),
        fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_servicio DATE,
        estado VARCHAR(20) DEFAULT 'pendiente',
        precio_total DECIMAL(10,2)
      )
    `)

    await db.query(`
      CREATE TABLE IF NOT EXISTS favoritos (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id),
        servicio_id INTEGER REFERENCES servicios(id),
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('✅ Tablas creadas correctamente')
  } catch (error) {
    console.error('Error creando tablas:', error)
  }
}

initDB()

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
const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor Goevly corriendo en puerto ${PORT}`)
})