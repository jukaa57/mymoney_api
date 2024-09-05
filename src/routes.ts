import {app} from '../index';
import express from 'express';

export const router = express.Router();

import { createSignUp, signUpController } from './controller/signupController';
import { validationController } from './controller/validationController';
import { revalidationController } from './controller/revalidationController';
import { signInController } from './controller/signinController';
import { callbackGoogleController, signInGoogleController } from './controller/signInWithGoogle';
// import { accessTokenCreator, handleSignIn } from './signIn';

// export async function Routers() {
    router.get('/', (req, res) => {
        res.send('<h1>Welcome!</h1>');
    });

    router.post('/api/v1/signup', signUpController);

    router.get('/api/v1/validate/:code', validationController);

    router.get('/api/v1/revalidate', revalidationController);

    router.post('/api/v1/signin', signInController);

    // router.get('/signin/validate/:code', async (req, res) => {
    //     const paramsCode = req.params.code
    //     const validateCode = await redisClient.get('validationCode')
    //     // Check if code is exipired
    //     if(!validateCode) return res.status(500).send('code expired!!\n resend a new code!')

    //     // Check if code is valid
    //     switch(paramsCode) {
    //         case 'error':
    //             res.status(500).send('Invalid code!')
    //             res.end()
    //             break
    //         case undefined:
    //             res.status(500).send('Invalid code!')
    //             res.end()
    //             break
    //         case null:
    //             res.status(500).send('Invalid code!')
    //             res.end()
    //             break
    //     }
    //     if(paramsCode === validateCode ) {
    //         // NEED to change this key parameter
    //         const credential = JSON.stringify(await redisClient.hGetAll(`signin:${paramsCode}`), null, 2)
    //         if(!credential) return res.status(500).send('Error fetching credential')
    //         let data = JSON.parse(credential)

    //         accessTokenCreator(data)
    //         return res.status(200).send('Account successfully')
    //     } else {
    //         res.status(500).send('Error: this code is invalid')
    //         res.end()
    //     }
    // });

    // Initiates the Google Login flow
    router.get('/auth/google', signInGoogleController);

    // Callback URL for handling the Google Login response
    router.get('/auth/google/callback', callbackGoogleController)
// }
