import { redisClient } from "./connections";
import { v4 as uuidv4 } from 'uuid';


const key_resend = process.env.API_KEY_RESEND

export const id = uuidv4();

export function validatePassword(password: string) {
    if (password.length < 8) return {pass: false, error: "Password must be at least min 8 characters"};
    
    const numStr =  /\d/ 
    if(!numStr.test(password)) return {pass: false, error: "Password not contains number"};

    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if(!format.test(password)) return {pass: false, error: "Password not contains special characters"};
    return {pass: true};
}

export function validateEmail(email: string) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

export async function createValidateCode() {
    const validationCode = Math.floor(100000 + Math.random() * 900000); // Gera um código de validação de 6 dígitos
    redisClient.set('validationCode', validationCode);
    console.log(validationCode)
    cleanValidateCode()
}

export async function cleanValidateCode() {
    let timer = setTimeout(() => {
        redisClient.del('validationCode')
    }, 60 * 1000) // 60 seconds
    return timer
}

export const now = new Date().toDateString();