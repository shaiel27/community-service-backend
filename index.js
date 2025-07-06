import express from "express"
import cors from "cors"
import "dotenv/config"
import userRoutes from "./src/routes/user.route.js"
import personalRoutes from "./src/routes/personal.route.js"
import pdfRoutes from "./src/routes/pdf.route.js"
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

// Rutas
app.use("/api/users", userRoutes)
app.use("/api/personal", personalRoutes)
app.use("/api/pdf", pdfRoutes)
app.use("/api/matriculas", matriculaRoutes)
app.use("/api/brigadas", brigadaRoutes)

// Ruta de prueba para la base de datos
app.get("/test-db-connection", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW() as current_time;")
    res.json({
      ok: true,
      message: "Conexión a la base de datos exitosa!",
      currentTime: result.rows[0].current_time,
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

// Configuración del puerto
const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`))
