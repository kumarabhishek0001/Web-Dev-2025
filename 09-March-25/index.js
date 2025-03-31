import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import db from './utils/db.js' //=> some time it is required to use js while sometimes it is not. It depend


//import all routes
import userRoutes from './routes/user.routes.js'

dotenv.config()//inside () --> path for our env

const app = express()
const port = process.env.PORT || 3000

app.use(cors({
    origin: process.env.BASE_URL,
    methods: ['GET', 'POST', 'DELETE', 'OPTION'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}))

app.use(express.json()) //-> sends json data to send between frontend and backend
app.use(express.urlencoded({extended: true}))//-> URL also contains some data that can be sent to backend this allows that transfer.


app.get('/', (req, res) => {
  res.send('Cohort!')
})
app.get('/hitesh', (req, res) => {
  res.send('Hii! Hitesh')
})
app.get('/piyush', (req, res) => {
  res.send('Hii! Piyush')
})

//connect to db
db()

//userRoutes
app.use("/api/v1/users", userRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})