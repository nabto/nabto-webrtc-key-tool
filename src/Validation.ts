export function isValidPemKey(type: "public" | "private", pem: string) {
    const trimmed = pem.trim();
    
    const pemHeader = `-----BEGIN ${type.toUpperCase()} KEY-----`;
    const pemFooter = `-----END ${type.toUpperCase()} KEY-----`;
    
    if (!trimmed.startsWith(pemHeader) || !trimmed.endsWith(pemFooter)) {
        return false;
    }

    const pemBody = trimmed
        .substring(pemHeader.length, trimmed.length - pemFooter.length)
        .replace(/\s/g, '');

    if (pemBody.length === 0) {
        return false;
    }

    try {
        window.atob(pemBody);
    } catch {
        return false;
    }

    return true;
}

export function isValidProductId(productId: string) {
    const trimmed = productId.trim();
    if (!trimmed.startsWith("wp-") || trimmed.toLowerCase() != trimmed) {
        return false;
    }
    return true;
}

export function isValidDeviceId(deviceId: string) {
    const trimmed = deviceId.trim();
    if (!trimmed.startsWith("wd-") || trimmed.toLowerCase() != trimmed) {
        return false;
    }
    return true;
}
