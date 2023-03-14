import express, {Request, Response, NextFunction} from 'express';
import { createVendor, getVendorById, getVendors } from '../controllers';



const router = express.Router();

router.get('/', (req: Request, res: Response)=>{
    res.json("Hello from admin")
})

router.post('/vendor', createVendor)

router.get('/vendor', getVendors)

router.get('/vendor/:id', getVendorById)



export {router as adminRouter};