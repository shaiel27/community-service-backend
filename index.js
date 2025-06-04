import express from "express"
import cors from "cors"
import "dotenv/config"

// import dashroouter from "./routes/dashboard.route.js"
const app = express()

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
}

// Apply CORS middleware
app.use(cors(corsOptions))

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Routes


//Port configuration
const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`))
