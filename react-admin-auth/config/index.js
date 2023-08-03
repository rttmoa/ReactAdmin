



module.exports = {
    
    //项目出口,webpack-dev-server 生成的包并没有写入硬盘,而是放在内存中！
    dev: {
        env: 'development',
        publicPath: '/',
        host: 'localhost',
        // FIXME: webpack读取此文件
        port: '40002',
        assetsSubDirectory: 'static',
        devtoolType: 'cheap-module-eval-source-map',
        proxyTable: {}
    },
    build: {
        env: 'production',
        publicPath: './',
        assetsPath: 'static',
        assetsSubDirectory: 'static',
        devtoolType: 'source-map',
        productionGzip: true,
        productionGzipExtensions: ['js', 'css']
    }
}