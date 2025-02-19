import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config()

import router from './routes/itemsRouter.js'

const app = express()

const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use('/items', router)

app.listen(process.env.PORT, () => {
    console.log('server is running on port ', process.env.PORT)
})