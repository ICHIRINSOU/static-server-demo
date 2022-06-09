var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
    console.log('请指定端口号')
    process.exit(1)
}

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true)
    var pathWithQuery = request.url
    var queryString = ''
    if (pathWithQuery.indexOf('?') >= 0) {
        queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'))
    }
    var path = parsedUrl.pathname
    var query = parsedUrl.query
    var method = request.method

    console.log('请求路径（带查询参数）为：' + pathWithQuery)

    response.statusCode = 200

    const newPath = path === '/' ? '/index.html' : path
    const suffix = newPath.substring(newPath.lastIndexOf('.'))
    const fileTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'text/json',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg'
    }
    response.setHeader('Content-Type', `${fileTypes[suffix] || 'text/html'} ;charset=utf-8`)
    let content
    try {
        content = fs.readFileSync(`./public${newPath}`)
    } catch (error) {
        response.statusCode = 404
        content = '你要访问的文件不存在呀！'
    }
    response.write(content)
    response.end()


    // if(path === '/'){
    //     response.statusCode = 200
    //     response.setHeader('Content-Type', 'text/html;charset=utf-8')
    //     response.write(`
    //   <!DOCTYPE html>
    //   <head>
    //   <link rel="stylesheet" href="/style">
    //   </head>
    //   <body>
    //   <h1>今天想吃十个闪电泡芙！</h1>
    //   </body>`)
    //     response.end()
    // } else if(path === '/style'){
    //     response.statusCode = 200
    //     response.setHeader('Content-Type', 'text/css;charset=utf-8')
    //     response.write(`h1{color: red;}`)
    //     response.end()
    // } else {
    //     response.statusCode = 404
    //     response.setHeader('Content-Type', 'text/html;charset=utf-8')
    //     response.write(`你访问的页面不存在`)
    //     response.end()
    // }

})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请打开 http://localhost:' + port)
