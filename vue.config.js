 // 这个文件中，应该导出一个包含了自定义配置选项的对象  向外暴露
 module.exports = {
     //修改默认打包入口
     chainWebpack: config => {
         //发布模式
         config.when(process.env.NODE_ENV === 'production', config => {

                 //entry找到默认的打包入口，调用clear则是删除默认的打包入口
                 //add添加新的打包入口
                 config.entry('app').clear().add('./src/main-prod.js')
                     // 通过externals加载外部CDN资源
                 config.set('externals', {
                     vue: 'Vue',
                     'vue-router': 'VueRouter',
                     axios: 'axios',
                     lodash: '_',
                     echarts: 'echarts',
                     nprogress: 'NProgress',
                     'vue-quill-editor': 'VueQuillEditor'
                 })
                 config.plugin('html').tap(args => { //  产品的发布模式
                     args[0].isProd = true
                     return args
                 })
             })
             //开发模式
         config.when(process.env.NODE_ENV === 'development', config => {

             //entry找到默认的打包入口，调用clear则是删除默认的打包入口
             //add添加新的打包入口
             config.entry('app').clear().add('./src/main-dev.js')
             config.plugin('html').tap(args => { //  产品的开发模式
                 args[0].isProd = false
                 return args
             })
         })
     }
 }