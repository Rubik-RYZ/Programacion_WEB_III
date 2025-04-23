import express from 'express'
import guitarsRouter from './routes/guitars.js'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT ?? 3001
app.use(express.json())
app.use(cors({origin:'http://localhost:3000'}))
app.use('/api/guitars', guitarsRouter)
app.listen(PORT, () => {
    console.log(`Server corriendo en puerto: http://localhost:${PORT}`)
})