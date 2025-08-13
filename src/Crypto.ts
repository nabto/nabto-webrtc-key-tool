import * as jose from 'jose'

export interface KeyPair {
    publicKeyPem: string,
    privateKeyPem: string,
};

function ab2str(buf: ArrayBuffer) {
    return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
}

function str2ab(str: string) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function pemToDer(pem: string) {
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const pemContents = pem.substring(
        pemHeader.length,
        pem.length - pemFooter.length - 1,
    );
    const binaryDerString = window.atob(pemContents);
    return str2ab(binaryDerString);
}

function buf2hex(buffer: ArrayBuffer) {
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}

async function generateKid(pemPublicKey: string) {
    const der = pemToDer(pemPublicKey);
    const buffer = await window.crypto.subtle.digest("SHA-256", der);
    const hash = buf2hex(buffer);
    return `product:${hash}`
}

export async function generateKeyPair(): Promise<KeyPair> {
    const keyPair = await window.crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"])
    const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey)
    const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey)

    const privKeyStr = ab2str(privateKey);
    const privKeyB64 = window.btoa(privKeyStr);
    const privChunks = privKeyB64.match(/.{1,64}/g);
    if (!privChunks) {
        throw new Error("Failed to generate private key");
    }
    const privKeyPem = `-----BEGIN PRIVATE KEY-----\n${privChunks.join('\n')}\n-----END PRIVATE KEY-----\n`;

    const pubKeyStr = ab2str(publicKey);
    const pubKeyB64 = window.btoa(pubKeyStr);
    const pubChunks = pubKeyB64.match(/.{1,64}/g);
    if (!pubChunks) {
        throw new Error("Failed to generate private key");
    }
    const pubKeyPem = `-----BEGIN PUBLIC KEY-----\n${pubChunks.join('\n')}\n-----END PUBLIC KEY-----\n`;

    return {
        privateKeyPem: privKeyPem,
        publicKeyPem: pubKeyPem,
    }
}

export async function generateToken(publicKeyPem: string, privateKeyPem: string, productId: string, deviceId: string, scope: string,) {
    const privateKey = await jose.importPKCS8(privateKeyPem, "ES256");
    const kid = await generateKid(publicKeyPem)
    const resource = `urn:nabto:webrtc:${productId}:${deviceId}`
    const jwt = await (new jose.SignJWT({ scope: scope, resource: resource }))
        .setIssuedAt()
        .setExpirationTime("1 day")
        .setProtectedHeader({ alg: "ES256", kid: kid }).sign(privateKey)
    return jwt
}
