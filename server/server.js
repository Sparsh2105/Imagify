import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
const PORT = process.env.PORT || 4000

const app = express()

app.use(express.json())
app.use(cors()) // ✅ You forgot the parentheses here
await connectDB()

app.get('/', (req, res) => res.send("API Working"))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
