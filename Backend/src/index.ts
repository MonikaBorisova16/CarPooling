import express from 'express';
import { json } from 'body-parser';
import { UserRouter } from './routes/User';
import { CarRouter } from './routes/Car';
import { TripRouter } from './routes/Trip';
import mongoose from 'mongoose';

const cors = require('cors')
const app = express()
var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
  }

app.use(json())
app.use(UserRouter)
app.use(CarRouter)
app.use(TripRouter)

// Allow all
app.use(cors(corsOptions));

mongoose.connect('mongodb://localhost:27017/todo', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('connected to database')
})

app.listen(8080, () => {
    console.log('server is listening on port 8080')
})