'use server'

import { cookies } from 'next/headers'

export async function storeToken(token: string) {
    cookies().set('token', token)
}

export async function getToken() {
    return cookies().get('token')?.value
}

export async function deleteToken() {
    cookies().delete('token')
}