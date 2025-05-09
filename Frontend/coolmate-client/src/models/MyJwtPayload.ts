interface MyPayload {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
    jti: string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
    email: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
    exp: number; // Expiry time (usually in seconds since epoch)
    iss: string; // Issuer
    aud: string; // Audience
}


export default MyPayload;