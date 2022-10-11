
function webServer() {
    const fs = require('fs');
    const WebSocket = require('ws');
    const wss = new WebSocket.Server({
        port: 8989
    }, () => {
        console.log('websocket server started!')
    })
    const path = require('path')
    const pathPublic = path.join(__dirname, '../source')
    let currentPath = pathPublic

    wss.on('connection', function (ws) {
        console.log('Client Connection Accepted')
        ws.on('close', (e) => {
            console.log(e)
        })
        ws.on('message', (message) => {
            console.log(message)
            if (message == 'hello server') {
                ws.send('hello, connection success!')
            }
            if (message == 'getFile') {
                fs.readdir(pathPublic, function (err, files) {
                    if (!files.length) {
                        files = "No files to show"
                        ws.send(files)
                    } else {
                        console.log(files)
                        ws.send(JSON.stringify(files))
                    }
                })
            }
            if (message != 'hello server' && message != 'getFile') {
                fs.stat(path.join(pathPublic, message), (err, stat) => {
                    if (stat.isDirectory()) {
                        fs.readdir(path.join(pathPublic, message), function (err, files) {
                            if (!files.length) {
                                files = "No files to show"
                                ws.send(files)
                            } else {
                                console.log(files)
                                ws.send(JSON.stringify(files))
                            }
                        })
                    }
                    if (stat.isFile()) {
                        fs.readFile(path.join(pathPublic, message), (err, data) => {
                            console.log(path.join(pathPublic, message))
                            console.log('Pushing file..')

                            ws.send(data)
                        })
                    } else {
                        ws.send(err)
                    }
                })

            }
        })
    })

}


exports.createServer = webServer;