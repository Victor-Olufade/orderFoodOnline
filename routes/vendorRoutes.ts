import express,{Request, Response, NextFunction} from 'express';
import { vendorLogin, getVendorProfile, editVendorProfile, updateVendorService, addFood } from '../controllers';
import { authUser } from '../middlewares/authMiddleware';



const router = express.Router();

router.post('/login', vendorLogin)

router.get('/profile', authUser, getVendorProfile)

router.patch('/profile', authUser, editVendorProfile)

router.patch('/service', authUser, updateVendorService)

router.post('/food', authUser, addFood)

router.get('/food')

router.get('/', (req: Request, res: Response)=>{
    res.json("Hello from vendor")
})




export {router as vendorRouter};