import { signInCredentials, signUpCredentials } from "../shared/interfaces"
import { prisma } from "../shared/connections"

export async function userExists(email: string) {
    const userExists = await prisma.user.findFirst({
        where: {
            email: email
        }
    })
    return userExists ? true : false
}

export async function createAccout(data: signUpCredentials) {
    await prisma.authenticator.create({
        data: {
            email: data.email,
            password: data.password,
            saltKey: data.saltKey as string,
        },
    }).then(async res => await prisma.user.create({
        data: {
            name: data.username,
            email: res.email,
            authenticatorId: res.id,   
        },
    }))
}

export async function getAccountFull(data: signInCredentials) {
    const account = await prisma.authenticator.findFirst({
        where: {
            email: data.email
        }
    })
    return account
}

export async function setAccessToken(data: signInCredentials, accessToken: string) {
    const account = await prisma.user.findFirst({
        where: {
            email: data.email
        }
    })
    await prisma.session.create({
        data: {
            userId: account?.id as string,
            token: accessToken
        },
    })
}