import express, { Application } from 'express';
import {adminRouter, customerRouter, shooppingRouter, vendorRouter} from '../routes';
import logger from 'morgan';
import dotenv from 'dotenv';

dotenv.config()


export default async(app: Application)=>{

    app.use(express.json())
    app.use(express.urlencoded({extended: true}))

    app.use(logger('dev'))

    app.listen(8000, ()=>{
        console.log(`server listening on port 8000`);
        
    })

    app.use('/admin', adminRouter)
    app.use('/vendor', vendorRouter)
    app.use('/shopping', shooppingRouter)
    app.use('/customer', customerRouter)

    return app;
}
