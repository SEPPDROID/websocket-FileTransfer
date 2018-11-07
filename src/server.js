/*
1.前后端解决协议传送首部行替换问题(使用ws模块)
2.读文件列表
3.是文件夹则继续读文件列表  是文件则传输文件
4.前端显示图片或者保存文件(使用filesaver.js)
*/

function webServer() {
    const fs = require('fs');
    const WebSocket = require('ws');
    const wss = new WebSocket.Server({
        port: 8989
    }, () => {
        console.log('websocket服务器建立')
    })
    const path = require('path')
    const pathPublic = path.join(__dirname, '../source')
    let currentPath = pathPublic

    wss.on('connection', function (ws) {
        console.log('客户端连接')
        ws.on('close', (e) => {
            console.log(e)
        })
        ws.on('message', (message) => {
            console.log(message)
            if (message == 'hello server') {
                ws.send('连接成功')
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
                            console.log('文件发送')

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