import CryptoJS from 'crypto-js'

const Hexadecimal = {
    encode: (value: string) => {
        return CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(value))
    },

    decode: (value: string) => {
        const wordArray = CryptoJS.enc.Hex.parse(value)

        let result = null
        try {
            result = CryptoJS.enc.Utf8.stringify(wordArray)
        } catch (_) {
            result = CryptoJS.enc.Latin1.stringify(wordArray)
        }

        return result
    },
}

const URL = {
    encode: (value: string) => {
        return encodeURIComponent(value)
    },
    encodeAllCharacters: (value: string) => {
        return Hexadecimal.encode(value).replace(
            /.{2}/g,
            str => `%${str}`,
        )
    },
    decode: (value: string) => {
        return decodeURIComponent(value)
    },
    decodePlusAsSpace: (value: string) => {
        return decodeURIComponent(value.replaceAll('+', ' '))
    },
}

const Base64 = {
    encode: (value: string) => {
        return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(value))
    },

    decode: (value: string) => {
        const wordArray = CryptoJS.enc.Base64.parse(value)

        let result = null
        try {
            result = CryptoJS.enc.Utf8.stringify(wordArray)
        } catch (_) {
            result = CryptoJS.enc.Latin1.stringify(wordArray)
        }

        return result
    },
}

const Unicode = {
    encode: (value: string) => {
        return value.replace(/./gs, char => {
            const hex = ('000' + char.charCodeAt(0).toString(16)).slice(-4)
            return '\\u' + hex
        })
    },

    decode: (value: string) => {
        return value.replace(/\\u.{4}/g, str => {
            return String.fromCharCode(parseInt(str.substring(2, 6), 16))
        })
    },
}

const Html = {
    encode2Hex: (value: string) => {
        return value.replace(/./gs, char => {
            return `&#x${char.charCodeAt(0).toString(16)};`
        })
    },

    encode2Dec: (value: string) => {
        return value.replace(/./gs, char => {
            return `&#${char.charCodeAt(0).toString()};`
        })
    },

    encode2EntityName: (value: string) => {
        const entities = [
            ['&', '&amp;'],
            ["'", '&apos;'],
            ['<', '&lt;'],
            ['>', '&gt;'],
            [' ', '&nbsp;'],
            ['"', '&quot;'],
        ]
        entities.forEach(e => {
            const [k, v] = e
            value = value.replaceAll(k, v)
        })
        return value
    },

    decodeFromHex: (value: string) => {
        return value.replace(/&#x[0-9a-fA-F]{1,2};/g, str => {
            return String.fromCharCode(parseInt(str.substring(3), 16))
        })
    },

    decodeFromDec: (value: string) => {
        return value.replace(/&#\d{1,3};/g, str => {
            return String.fromCharCode(parseInt(str.substring(2)))
        })
    },

    decodeFromEntityName: (value: string) => {
        const entities: [RegExp, string][] = [
            [/&amp;/g, '&'],
            [/&apos;/g, "'"],
            [/&lt;/g, '<'],
            [/&gt;/g, '>'],
            [/&nbsp;/g, ' '],
            [/&quot;/g, '"'],
        ]
        entities.forEach(e => {
            const [k, v] = e
            value = value.replace(k, v)
        })
        return value
    },
}

const CharCode = {
    encode: (value: string) => {
        return (
            'String.fromCharCode(' +
            [...value]
                .map(c => {
                    return c.charCodeAt(0)
                })
                .join(',') +
            ')'
        )
    },

    decode: (value: string) => {
        return value
            .substring(20, value.length - 1)
            .split(',')
            .map(charCode => {
                return String.fromCharCode(parseInt(charCode))
            })
            .join('')
    },
}

const AtobHelper = {
    encode: (value: string) => `atob('${btoa(value)}')`,
}

const Escape = {
    hex: (value: string) => {
        return [...value]
            .map(c => {
                const code = c.charCodeAt(0)
                return code > 0xff ? c : '\\x' + code.toString(16)
            })
            .join('')
    },

    oct: (value: string) => {
        return [...value]
            .map(c => {
                const code = c.charCodeAt(0)
                return code > 0xff ? c : '\\' + code.toString(8)
            })
            .join('')
    },
}

export const Encode = {
    URL,
    Hexadecimal,
    Base64,
    Unicode,
    Html,
    CharCode,
    AtobHelper,
    Escape,
}
