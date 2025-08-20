export const TokenHelp = `
In the centralized model, clients are granted access to devices by a centralized service,
operated by a vendor. Such a service in the usual scenario would have a HTTP endpoint or similar
that grants access tokens, these access tokens are then used by a client to authorize themselves
to the Nabto WebRTC service. The full scenario is as follows

1. Client obtains signed JWT token from authorization service (this part is what this tool is meant to mock)
2. Client uses the JWT token to request a connection to the device
3. Nabto WebRTC validates the token using the public key of the keypair that was used to create the token

This tool generates access tokens that can be used by clients in the scenario above,
for testing purposes primarily. In a production setup, you would host your own
service that keeps its private key stored securely on a server.

You may read a more detailed explanation at the following link

<https://docs.nabto.com/developer/webrtc/guides/security/central-auth.html>
`.trim()
