import crypto from "crypto";
import cryptoJs from 'crypto-js'
import path from 'path';
import ejs from 'ejs'
import { NextFunction, Request, Response } from 'express';
import { createAccout, userExists } from '../Action';
import { signUpCredentials } from '../shared/interfaces.d';
import { redisClient, transporter } from '../shared/connections';
import { createValidateCode, id, validateEmail, validatePassword } from '../shared/util';

// User Signup
export const signUpController = async (req: Request, res: Response, next: NextFunction) => {
    const {username, email, password}: signUpCredentials = req.body
    if(!username || !password || !email) return res.status(500).send('Bad Request \n username, email and password is required')
    if(!validateEmail(email)) return res.status(400).send('Bad Request \n email invalid')

    const isExists = await userExists(email)

    if(isExists) return res.status(400).send('Bad Request \n Email already exists')
    if(!validatePassword(password).pass) return res.status(400).send(`Bad Request \n ${!validatePassword(password).error}.`)

    redisClient.hSet(`credential:${id}`, {username, email, password})
    createValidateCode()
    const validationCode = await redisClient.get('validationCode');
    let send = sendEmailSignUpValidation(email, validationCode)

    if(send === 202) return res.status(202).send('Send code to email!!')
    else return res.status(500).send('Error !!')
}

export function createSignUp(data: signUpCredentials) {
    const hash = HashConstructor(data.password)
    console.log(data.password + '\n' + hash.saltKey + '\n' + hash.hashPassword)
    const account = {...data, password: hash.hashPassword, saltKey: hash.saltKey}
    
    createAccout(account).then((res) => res).catch(err => err.message)
}

function HashConstructor(password: string) {
    const saltKey = crypto.randomBytes(32).toString('hex')
    let concat = password + saltKey
    let hashPassword = cryptoJs.SHA256(concat)
    
    return {
        saltKey: saltKey,
        hashPassword: hashPassword.toString(cryptoJs.enc.Hex)
    }
}

export function sendEmailSignUpValidation(email: string, validationCode: string | null): number {
    let responseEmail: number = 202

    ejs.renderFile(path.join(__dirname, '../views', 'welcome.ejs'), { validationCode: validationCode }, (err: any, html: any) => {
        if (err || !validationCode) {
            console.log(err);
            responseEmail = 500
        }
        (async function sendEmail() {
          try {
            const data = await transporter.sendMail({
                from: '"Acme 👻" <onboarding@resend.dev>', // sender address
                to: [email], // list of receivers
                subject: "Hello ✔", // Subject line
                html: html, // html body
            });
            // const data = await resend.emails.send({
            //   from: 'Acme <onboarding@resend.dev>',
            //   to: [email],
            //   subject: 'Hello World',
            //   html: html
            // });
            // console.log(data);
          } catch (error) {
            console.error(error);
            return
          }
        })();
    });
    return responseEmail
}
