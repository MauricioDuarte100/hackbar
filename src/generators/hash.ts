import CryptoJS from 'crypto-js'

export const Hash = {
    MD5: {
        digest: (value: string) => CryptoJS.MD5(value).toString(CryptoJS.enc.Hex),
    },

    SHA1: {
        digest: (value: string) => CryptoJS.SHA1(value).toString(CryptoJS.enc.Hex),
    },

    SHA256: {
        digest: (value: string) => CryptoJS.SHA256(value).toString(CryptoJS.enc.Hex),
    },

    SHA384: {
        digest: (value: string) => CryptoJS.SHA384(value).toString(CryptoJS.enc.Hex),
    },

    SHA512: {
        digest: (value: string) => CryptoJS.SHA512(value).toString(CryptoJS.enc.Hex),
    },
}
