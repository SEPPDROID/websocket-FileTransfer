# Websocket File Downloading

I made a quick fork of Xianbei233's test project to see if i can push files to a lockeddown client over websockets, small files seem to work and big files i haven't tested yet. 

**changes i made:**

- Translated to english
- used the secure websocket example to make this work over https
- changed port `8989` to `443` since it will be the only server i'll be hosting

## Getting started:

### client:

Upload the contents of `_client` to a capable webserver over https. 

edit `ajax.js` and change the `const ws = new WebSocket("wss://HOSTNAMEHERE:443");`
to your domain name

Point the browser to `file.html`

### server:
clone my repo 
`git clone https://github.com/SEPPDROID/websocket-FileTransfer.git`

jump to the folder
`cd websocket-FileTransfer/`

like all nodeprojects just execute npm
`npm install`

jump to the src folder
`cd src`

but wait! we need a domain, cert & a key for secure support. 
you can also use self signed certificates but i reccommend certbot and a example can be found below

jump to the cert folder
`cd sec_certs/`

and link (or copy) your `fullchain.pem` and `privkey.pem`

then go back to the `src` folder (with `cd ..`) and launch the node app by executing
`node server.js`

*tip use npm forever to make it a background process or service*
### certbot:
install certbot

then execute the certonly tag w/ the command 
`sudo certbot certonly --standalone --preferred-challenges http -d  EXAMPLE.DOMAIN.COM`

your `fullchain.pem` and `privkey.pem` will be available at

` /etc/letsencrypt/live/EXAMPLE.DOMAIN.COM/fullchain.pem`
` /etc/letsencrypt/live/EXAMPLE.DOMAIN.COM/privkey.pem`

