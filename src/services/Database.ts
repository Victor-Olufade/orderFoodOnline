
import mongoose from 'mongoose';
import { mongoConnectString } from '../config';

const dataBaseConnect = async() => {
    mongoose.set('strictQuery', false);
    try {
        mongoose.connect(mongoConnectString, ()=>{
            console.log('Database connected successfully');
        })
        
    } catch (error) {
        console.log(error);
    }
   
}



export {
    dataBaseConnect
}