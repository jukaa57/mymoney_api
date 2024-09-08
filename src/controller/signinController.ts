import cryptoJs  from 'crypto-js';
import { Request, Response, NextFunction} from "express"   
import { signInCredentials } from "../shared/interfaces"
import { createValidateCode, now, validateEmail } from "../shared/util"
import { getAccountFull, setAccessToken, userExists } from "../Action"

export const signInController = async (req: Request, res: Response, next: NextFunction) => {
    const {email, password}: signInCredentials = req.body
    if(!email || !password) return res.status(500).send('Bad Request \n email and password is required')
    if(!validateEmail(email)) return res.status(400).send('Bad Request \n email invalid')
    
    const isExists = await userExists(email)
    if(!isExists) return res.status(400).send('Bad Request \n Account not exisits')
    
    const login = await handleSignIn({email, password})
    if(login.STATUS_CODES == 200 ) return res.status(200).send({message: 'Access Successfully', accessToken: login.ACCESS_TOKEN})
    // else if(login == 202) return res.status(202).send('Send code to email!!')
    else return res.status(500).send('Bad Request \n Login failed')
}

export async function handleSignIn(data: signInCredentials) {
    const getAccount = await getAccountFull(data)
    const hash = await HashComparator(data.password, getAccount)
    if(hash === true) {
        // if(getAccount?.twofactors === 'true') {
        //     createValidateCode()
        //     const validationCode = await redisClient.get('validationCode');
        //     // NEED to change this key parameter
        //     redisClient.hSet(`signin:${validationCode}`, {'id': getAccount.id, 'email':getAccount.email})
        //     let send = sendEmailSignUpValidation(data.email, validationCode)
        //     return send
        // } else {
            let accessToken = await accessTokenCreator(getAccount)
            return {
                STATUS_CODES: 200,
                ACCESS_TOKEN: accessToken 
            }
        // }
    } else {
        return {
            STATUS_CODES: 500,
            ACCESS_TOKEN: '' 
        }
    }
}

async function HashComparator(password: string, data: any ) {
    let concat = password + data.saltKey
    let hash = cryptoJs.SHA256(concat)
    if(hash.toString(cryptoJs.enc.Hex) !== data.password) {
        return false
    }
    return true
}

export async function accessTokenCreator(data: any) {
    let concat = data.id + data.email + now
    let accessToken = cryptoJs.SHA256(concat)
    setAccessToken(data, accessToken.toString(cryptoJs.enc.Hex))
    return accessToken.toString(cryptoJs.enc.Hex)
}