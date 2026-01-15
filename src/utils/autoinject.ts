export interface BrowseRequest {
    method: string
    url: string
    body: {
        content: string
        enctype: string
    }
    headers: any[]
    followRedirect: boolean
}

import { RandomData } from './random_data'

export function injectIntoAllParams(request: any, payload: string): any {
    const newRequest = JSON.parse(JSON.stringify(request))

    // 1. URL Params
    try {
        const dummyBase = 'http://dummy.com'
        const urlObj = new URL(newRequest.url, dummyBase)
        const params = new URLSearchParams(urlObj.search)

        if (Array.from(params.keys()).length > 0) {
            for (const [key, value] of params.entries()) {
                params.set(key, value + payload)
            }
            newRequest.url = urlObj.toString()
        }
    } catch (e) { }

    // 2. Body Params
    if (newRequest.body.enctype === 'application/x-www-form-urlencoded') {
        try {
            const params = new URLSearchParams(newRequest.body.content)
            for (const [key, value] of params.entries()) {
                params.set(key, value + payload)
            }
            newRequest.body.content = params.toString()
        } catch (e) { }
    } else if (newRequest.body.enctype === 'application/json') {
        try {
            const json = JSON.parse(newRequest.body.content)
            const traverse = (obj: any) => {
                for (const k in obj) {
                    if (typeof obj[k] === 'string') {
                        obj[k] = obj[k] + payload
                    } else if (typeof obj[k] === 'object' && obj[k] !== null) {
                        traverse(obj[k])
                    }
                }
            }
            traverse(json)
            newRequest.body.content = JSON.stringify(json, null, 2)
        } catch (e) { }
    }

    return newRequest
}

export function injectRandomData(request: any, payload: string): any {
    const newRequest = JSON.parse(JSON.stringify(request))

    const generateValue = (key: string, originalValue: string) => {
        const k = key.toLowerCase()
        let fake = ''
        if (k.includes('email') || k.includes('mail')) fake = RandomData.getEmail()
        else if (k.includes('phone') || k.includes('tel') || k.includes('mobile')) fake = RandomData.getPhone()
        else if (k.includes('name') || k.includes('user') || k.includes('login')) fake = RandomData.getFullName()
        else if (k.includes('pass') || k.includes('pwd')) fake = 'Password123!'
        else if (k.includes('date') || k.includes('birth')) fake = '1990-01-01'
        else if (k.includes('age') || k.includes('year') || k.includes('id')) fake = RandomData.getNumber()
        else fake = RandomData.getString()

        return fake + payload
    }

    // 1. URL Params
    try {
        const dummyBase = 'http://dummy.com'
        const urlObj = new URL(newRequest.url, dummyBase)
        const params = new URLSearchParams(urlObj.search)

        for (const [key, value] of params.entries()) {
            params.set(key, generateValue(key, value))
        }
        newRequest.url = urlObj.toString()
    } catch (e) { }

    // 2. Body Params
    if (newRequest.body.enctype === 'application/x-www-form-urlencoded') {
        try {
            const params = new URLSearchParams(newRequest.body.content)
            for (const [key, value] of params.entries()) {
                params.set(key, generateValue(key, value))
            }
            newRequest.body.content = params.toString()
        } catch (e) { }
    } else if (newRequest.body.enctype === 'application/json') {
        try {
            const json = JSON.parse(newRequest.body.content)
            const traverse = (obj: any) => {
                for (const k in obj) {
                    if (typeof obj[k] === 'string') {
                        obj[k] = generateValue(k, obj[k])
                    } else if (typeof obj[k] === 'object' && obj[k] !== null) {
                        traverse(obj[k])
                    }
                }
            }
            traverse(json)
            newRequest.body.content = JSON.stringify(json, null, 2)
        } catch (e) { }
    }

    return newRequest
}

