import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config()



export const generateOtpAndExpiry = () => {
    const otp = Math.floor(Math.random() * 10000)
    let expiry = new Date()
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000))
    return {otp, expiry}
}


const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
       user: process.env.ADMIN_MAIL,
       pass: process.env.GMAILPASS
    }
    
   }
 )
 
 export const sendEmail =  (to: string, html: string) => {
   try {
     const response =  transport.sendMail({
       from: process.env.GMAIL!, 
       to,
       subject: process.env.USER_SUBJECT!,
       html 
     })
     return response
   } catch (error) {
     console.log(error)
   }
 }
 
 export const eHtml = (otp: number, name="there") => {
   let result = `
    <div style = "max-width:700px; margin: auto; border: 10px solid #ddd; padding: 50px, 20px; font-size: 110%;">
    <h2 style = "text-align: center; text-transform: uppercase; color: teal;">
    Welcome to EatNow
    </h2>
    <p>
    Hi ${name}, your OTP is ${otp}. It expires in 30 minutes.
    </p>
    </div>
    `
   return result
 }
 