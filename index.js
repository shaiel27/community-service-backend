import express from "express"
import cors from "cors"
import "dotenv/config"
import userRoutes from "./src/routes/user.route.js"
import personalRoutes from "./src/routes/personal.route.js"
import matriculaRoutes from "./src/routes/matricula.route.js"
import brigadaRoutes from "./src/routes/brigada.route.js"
import { db } from "./src/db/connection.database.js"

const app = express()

// Configuración CORS
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas de la API
app.use("/api/users", userRoutes)
app.use("/api/personal", personalRoutes)
app.use("/api/matriculas", matriculaRoutes)
app.use("/api/brigadas", brigadaRoutes)

// Ruta de prueba para la base de datos
app.get("/test-db-connection", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW() as tiempo_actual;")
    res.json({
      ok: true,
      message: "Conexión a la base de datos exitosa!",
      tiempoActual: result.rows[0].tiempo_actual,
    })
  } catch (error) {
    console.error("Error al probar la conexión a la base de datos:", error)
    res.status(500).json({
      ok: false,
      message: "Fallo al conectar a la base de datos.",
      error: error.message,
    })
  }
})

// Ruta de información de la API
app.get("/api", (req, res) => {
  res.json({
    ok: true,
    message: "API del Sistema de Gestión Escolar",
    version: "2.0.0",
    endpoints: {
      users: "/api/users",
      personal: "/api/personal",
      matriculas: "/api/matriculas",
      brigadas: "/api/brigadas",
    },
  })
})

// Configuración del puerto
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`)
  console.log(`📚 Sistema de Gestión Escolar - API v2.0`)
  console.log(`🔗 Endpoints disponibles:`)
  console.log(`   - Users: http://localhost:${PORT}/api/users`)
  console.log(`   - Personal: http://localhost:${PORT}/api/personal`)
  console.log(`   - Matrículas: http://localhost:${PORT}/api/matriculas`)
  console.log(`   - Brigadas: http://localhost:${PORT}/api/brigadas`)
})
