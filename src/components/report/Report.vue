<template>
    <div>
        <!-- <h3>报表组件</h3> -->
        <el-breadcrumb separator-class='el-icon-arrow-right'>
          <!-- path: /home  地址要有双引号引起来 -->
        <el-breadcrumb-item :to='{path: "/home"}'>首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item> 
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!--2. 为ECharts准备一个具备大小（宽高）的Dom     //style="width: 600px;height:400px;" 图表的显示的大小效果 -->
    <div id="main" style="width: 800px;height:450px;"></div>
        </el-card>
    </div>
</template>
<script>
    //1. 导入echarts 
    import echarts from 'echarts'
    // 折线图数据合并 并且要有跟谁效果 需要深拷贝   导入设拷贝
    import _ from 'lodash'
    export default {
        data() {
            return {
                // options 是要与折线图合并的数据
                options: {
                    title: {
                        text: '用户来源'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#E9EEF3'
                            }
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [{
                        boundaryGap: false
                    }],
                    yAxis: [{
                        type: 'value'
                    }]
                }
            }
        },
        // 生命周期
        created() {},
        //此时，页面上的元素，已经被渲染完毕了
        async mounted() {
            //3.  基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'))

            // 发起图表数据请求
            const {
                data: res
            } = await this.$http.get('reports/type/1')
            if (res.meta.status !== 200) {
                return this.$message.error('获取折线图数据失败！')
            }
            this.$message.success('添加参数成功！')


            // 4. 准备数据和配置项
            // 深拷贝 数据合并  
            const result = _.merge(res.data, this.options)
                //5. 使用刚指定的配置项和数据显示图表。
            myChart.setOption(result); //把深拷贝合并的数据 赋值过来   完成 折叠线的跟谁效果
        },
        // 定义  事件处理函数
        methods: {}
    }
</script>
<style lang="less" scoped>

</style>