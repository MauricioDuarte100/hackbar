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

export function injectIntoAllParams(request: any, payload: string): any {
    const newRequest = JSON.parse(JSON.stringify(request))

    // 1. URL Params
    try {
        // Handle incomplete URLs (e.g. starting with /) by adding a dummy base
        const dummyBase = 'http://dummy.com'
        const urlObj = new URL(newRequest.url, dummyBase)
        const params = new URLSearchParams(urlObj.search)

        if (Array.from(params.keys()).length > 0) {
            for (const [key, value] of params.entries()) {
                // Append payload to existing value
                params.set(key, value + payload)
            }
            // If we used dummy base, we need to strip it back if the original didn't have it
            // But for HackBar usually full URLs are used. 
            // If the original URL was absolute, urlObj.toString() is fine.
            newRequest.url = urlObj.toString()
        }
    } catch (e) {
        // Invalid URL
    }

    // 2. Body Params (x-www-form-urlencoded)
    if (newRequest.body.enctype === 'application/x-www-form-urlencoded') {
        try {
            const params = new URLSearchParams(newRequest.body.content)
            for (const [key, value] of params.entries()) {
                params.set(key, value + payload)
            }
            newRequest.body.content = params.toString()
        } catch (e) { }
    }

    // 3. Body Params (JSON)
    if (newRequest.body.enctype === 'application/json') {
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
