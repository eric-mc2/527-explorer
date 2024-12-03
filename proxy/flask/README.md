# Proxy Server

ProPublica will reject direct requests from my front-end due to CORS.
As a first workaround, I proxied from the front-end through cors-anywhere.
As of Dec 2, ProPublica started blacklisting proxy sites and returning 403.
But still allow external requests.

This proxy server bypasses CORS rules and the blacklist. 

Run it with:

> flask --app proxy run --debug