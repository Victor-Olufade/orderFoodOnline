import { AuthPayLoad } from '../dto/auth.dto'
import bcrypt from 'bcrypt'
import { appSecret } from '../../config'
import jwt from 'jsonwebtoken'

export const generateSalt = async () => {
  return await bcrypt.genSalt()
}

export const generateHashedPassword = async (
  password: string,
  salt: string
) => {
  return await bcrypt.hash(password, salt)
}

export const validatePassword = async (
  password: string,
  incomingPassword: string
) => {
  return await bcrypt.compare(incomingPassword, password)
}

export const generateSignature = async (payload: AuthPayLoad) => {
  return await jwt.sign(payload, appSecret, { expiresIn: '1d' })
}
