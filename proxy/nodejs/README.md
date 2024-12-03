# Proxy Server

ProPublica will reject direct requests from my front-end due to CORS.
As a first workaround, I proxied from the front-end through cors-anywhere.
As of Dec 2, ProPublica started blacklisting proxy sites and returning 403.
But still allow external requests.

This proxy server bypasses CORS rules and the blacklist. 

Run it with:

> node proxy.js

But actually don't! Configuring https, generating a certificate, which ProPublica is
rejecting anyway, is making this solution too complicated. Use the [Flask version](../flask/README.md)
instead!