import { Request, Response, NextFunction } from 'express';
import { createSignUp } from "./signupController";
import { redisClient } from "../shared/connections"
import { id } from '../shared/util';

export const validationController = async (req: Request, res: Response) => {
    const paramsCode = req.params.code
    const validateCode = await redisClient.get('validationCode')
    // Check if code is exipired
    if(!validateCode) return res.status(500).send('code expired!!\n resend a new code!')

    // Check if code is valid
    switch(paramsCode) {
        case 'error':
            res.status(500).send('Invalid code!')
            res.end()
            break
        case undefined:
            res.status(500).send('Invalid code!')
            res.end()
            break
        case null:
            res.status(500).send('Invalid code!')
            res.end()
            break
    }

    if(paramsCode === validateCode ) {
        const credential = JSON.stringify(await redisClient.hGetAll(`credential:${id}`), null, 2)
        if(!credential) return res.status(500).send('Error fetching credential')
        createSignUp(JSON.parse(credential))
        return res.status(200).send('Account successfully')
    } else {
        res.status(500).send('Error: this code is invalid')
        res.end()
    }
}