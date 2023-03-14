import express from 'express';
import {adminRouter} from './routes';
import {vendorRouter} from './routes';
import mongoose from 'mongoose';
import { mongoConnectString } from './config';
import dotenv from 'dotenv';

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const dataBaseConnect = async() => {
    try {
        const connect = mongoose.connect(mongoConnectString, ()=>{
            console.log('Database connected successfully');
        })
    } catch (error) {
        console.log(error);
        
    }
   
}

mongoose.set('strictQuery', false);

dataBaseConnect();


app.listen(8000, ()=>{
    console.log(`server listening on port 8000`);
    
})

app.use('/admin', adminRouter)
app.use('/vendor', vendorRouter)