import express from "express"
import cors from "cors"
import "dotenv/config"
import userRoutes from "./src/routes/user.route.js"
// Agregar la nueva ruta de personal
import personalRoutes from "./src/routes/personal.route.js"

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
// En la sección de rutas, agregar:
app.use("/api/personal", personalRoutes)

// Configuración del puerto
const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`))