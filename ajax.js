const ws = new WebSocket("ws://localhost:8989");
let downloadname

ws.onopen = () => {
    ws.send("hello server")
}

ws.onclose = () => {
    console.log('服务器断开了连接')
}
ws.onmessage = (message) => {
    console.log('收到服务器消息')
    const BlobReader = new FileReader()
    let data = message.data


    if (isJSON(data)) {
        document.getElementById('FileList').innerHTML = ""
        document.getElementById('message').innerHTML = ""
        data = JSON.parse(data)
        if (data instanceof Array) {
            for (let n = 0; n < data.length; n++) {
                let list = document.createElement("input")
                const br = document.createElement("br")
                list.setAttribute('type', 'radio')
                list.setAttribute('value', data[n])
                list.setAttribute('name', 'option')
                document.getElementById('FileList').append(list)
                document.getElementById('FileList').append(data[n])
                document.getElementById('FileList').append(br)
            }
            let button = document.createElement('button')
            button.setAttribute('onclick', 'download()')
            button.innerText = '接收'
            document.getElementById('FileList').append(button)
        }

    }
    if (isJSON(data) == false && data == '连接成功') {

        document.getElementById('message').append(data)

    }
    if (data instanceof Blob) {

        const cv = document.createElement('canvas')
        const img = new Image();
        const reader = new FileReader();
        let src
        blobToDataURL(data, (url) => {
            src = url.replace('application/octet-stream', 'png')
            img.src = src

            img.onload = function () {
                if (this.width && this.height) {
                    const ctx = cv.getContext('2d');
                    cv.setAttribute('width', this.width)
                    cv.setAttribute('height', this.height)
                    ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, this.width, this.height); //this即是imgObj,保持图片的原始大小：470*480
                    //ctx.drawImage(this, 0, 0,1024,768);//改变图片的大小到1024*768
                    document.getElementById('PictureShow').append(cv)
                    /*cv.toBlob(function (blob) {
                        saveAs(blob, downloadname);
                    });*/
                }

            }
        })

        console.log('下载启动')
        console.log(data)
        var file = new File([data], downloadname); //浏览器原生解码不支持中文
        saveAs(file);



    }



}
ws.onerror = (err) => {
    console.log(err)
}

function getFileList() {

    ws.send('getFile')
}

function download() {
    var radio = document.getElementsByName("option");
    for (i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            downloadname = radio[i].value
            ws.send(radio[i].value)
        }
    }


}

function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }

        } catch (e) {

            return false;
        }
    }
}

function blobToDataURL(blob, callback) {
    var a = new FileReader();
    a.onload = function (e) {
        callback(e.target.result);
    }
    a.readAsDataURL(blob);
}