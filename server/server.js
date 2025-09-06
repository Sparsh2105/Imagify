import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from '../server/config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'
import geminiRouter from './routes/geminiRouter.js'
const PORT= process.env.PORT|| 4000
const app=express()
app.use(cors())

app.use(express.json())
await connectDB()

app.use('/api/user',userRouter)
app.use('/api/image',imageRouter)
app.use('/api/gemini',geminiRouter)
app.get('/',(req,res)=>{
    res.send('API working')
})

app.listen(PORT, ()=>console.log(`server runs on port ${PORT}`))
