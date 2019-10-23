//这是项目发布阶段需要用到的babel 插件
const prodPlugins = []
    //如果 process.env.NODE_ENV 的值等于 production 是处于产品的发布模式
if (process.env.NODE_ENV === 'production') {
    // 就 prodPlugins.push transform-remove-console  去除console.log()输出
    prodPlugins.push('transform-remove-console')
}

module.exports = {
    "presets": [
        "@vue/app"
    ],
    "plugins": [
        [
            "component",
            {
                "libraryName": "element-ui",
                "styleLibraryName": "theme-chalk"
            }
        ],
        // 新增 transform-remove-console 配置项 去除console.log()输出
        //发布产品时候的插件数组  ... 代表展开运算符  就是数组里面的每一项 展开了 放到另一个数组中
        ...prodPlugins,
        //通过@babel/plugin-syntax-dynamic-import实现路由懒加载
        '@babel/plugin-syntax-dynamic-import'
    ]
}