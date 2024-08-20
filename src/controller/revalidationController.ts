import { redisClient } from "../shared/connections";
import { createValidateCode, id } from "../shared/util";
import { NextFunction, Request, Response } from 'express';
import { createSignUp, sendEmailSignUpValidation,  } from "./signupController";


export const revalidationController = async(req: Request, res: Response) => {
    const credential = JSON.stringify(await redisClient.hGetAll(`credential:${id}`), null, 2)
    if(!JSON.parse(credential).email) return res.status(500).send('Error: action not found')
    createValidateCode()
    const validationCode = await redisClient.get('validationCode');
    sendEmailSignUpValidation(JSON.parse(credential).email, validationCode)
    return res.status(200).send('Resend successfully')
}