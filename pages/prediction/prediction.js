import * as echarts from '../../ec-canvas/echarts';

const app = getApp();
var dataList = {};
var k = 0;
var Chart = null;
// pages/prediction/prediction.js
Page({
    data: {
        defaultCity: '武汉',
        totalHelpData: [],
        totalWeatherData: [],
        dates: [],
        tempsMax: [],
        tempsMin: [],
        ec: {
            lazyLoad: true // 延迟加载
        }
    },
    //onload函数处理wxml中关于时间的部分 不需要刷新所以放在onload中
    onLoad: function (e) {

    },
    //页面初次渲染完成
    onReady: function () {

    },
    //切换页面时触发该函数
    onShow: function () {
        let that = this;
        let dates = require('../../utils/getNearDate');
        this.setData({
            dates: dates.getNearDate()
        })
        //请求缓存并将数据通过处理后放到 prediction.wxml上
        //同步加载数据   顺序才对
        try {
            let res = wx.getStorageSync('getData')
            if (res) {
                console.log("onShow中的请求缓存")
                console.log(res);
                //获取temps winds weathers开始
                let temps = []; let weathers = []; let winds = [];
                for (let i in res.results[0].weather_data) {
                    let tp = res.results[0].weather_data
                    let temp = res.results[0].weather_data[i].temperature.split(" ");
                    //console.log(temp);
                    let max = temp[0] + "°C";
                    let min = temp[temp.length - 1];
                    temps.push({ max: max, min: min });
                    weathers.push(tp[i].weather);
                    winds.push(tp[i].wind);
                };//获取temps结束

                //获取 title zs des 的开始
                let titles = []; let zss = []; let dess = [];
                for (let i in res.results[0].index) {
                    let temp = res.results[0].index;
                    titles.push(temp[i].title);
                    zss.push(temp[i].zs);
                    dess.push(temp[i].des);
                }
                // //获取 title zs des 的结束
                //设置结合到一起数据 方便循环生成
                let totalWeatherData = [];
                let tempsMax = [];
                let tempsMin = [];
                for (let i = 0; i < temps.length; i++) {
                    tempsMax.push(temps[i].max.replace("°C", ""));
                    tempsMin.push(temps[i].min.replace("℃", ""));
                    totalWeatherData.push({
                        max: temps[i].max,
                        min: temps[i].min,
                        weather: weathers[i],
                        wind: winds[i]
                    })
                };
                let totalHelpData = [];
                for (let i = 0; i < titles.length; i++) {
                    totalHelpData.push({
                        title: titles[i],
                        zs: zss[i],
                        des: dess[i],
                    })
                };
                totalHelpData[4].title = '紫外线';
                that.setData({
                    totalWeatherData: totalWeatherData,
                    totalHelpData: totalHelpData,
                    tempsMax: tempsMax,
                    tempsMin: tempsMin
                });
            }
          } catch (e) {
            console.log(e)
          }
        this.echartsComponnet = this.selectComponent('#mychart');
        this.getData(); //获取数据
    },
    //图表绘制部分
    getData: function () {
        //如果是第一次绘制
        let datas = this.data;
        dataList = {
            dates: this.data.dates,
            tempsMax: this.data.tempsMax,
            tempsMin: this.data.tempsMin
        };
        if (!Chart) {
            console.log("初始化图表")
            this.init_echarts(); //初始化图表
        } else {
            console.log("更新数据")
            this.setOption(Chart); //更新数据
        }
    },
    //初始化图表
    init_echarts: function () {
        this.echartsComponnet.init((canvas, width, height) => {
            // 初始化图表
            Chart = echarts.init(canvas, null, {
                width: width,
                height: height
            });
            // Chart.setOption(this.getOption());
            this.setOption(Chart);
            // 注意这里一定要返回 chart 实例，否则会影响事件处理等
            return Chart;
        });
    }, 
    setOption: function (Chart) {
        Chart.clear();  // 清除
        console.log("清除旧图");
        Chart.setOption(this.getOption());  //获取新数据
        console.log("获取新数据");
    },
    getOption: function () {
        // 指定图表的配置项和数据
        var option = {
            xAxis: {
                type: 'category',
                data: dataList.dates
            },
            tooltip: {
                show: true,
                trigger: 'axis'
            },
            yAxis: {
                x: 'center',
                type: 'value',
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                }
                // show: false
            },
            series: [{
                name: '最高温',
                type: 'line',
                smooth: true,
                data: dataList.tempsMax
              }, {
                name: '最低温',
                type: 'line',
                smooth: true,
                data: dataList.tempsMin
              }]
        }
        return option;
    },


    //帮助消息绑定事件
    clickHelp: function (e) {
        let index = e.target.id;
        console.log(e.target.id);
        let that = this;
        wx.showModal({
            title: '友情提示',
            content: that.data.totalHelpData[index].des,
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                } else {
                    console.log('用户点击取消')
                }
            }
        });
    },
    
})


