import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    title: {
      text: '',
      left: 'center'
    },
    color: ["red", "blue"],
    legend: {
      data: ['最高温', '最低温'],
      top: 50,
      left: 'center',
      backgroundColor: 'white',
      z: 100
    },
    grid: {
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['一', '二', '三', '四'],
      // show: false
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
      data: [-5, 22, 30, 30]
    }, {
      name: '最低温',
      type: 'line',
      smooth: true,
      data: [12, -20, 41, 35]
    }]
  };

  chart.setOption(option);
  return chart;
}
// pages/prediction/prediction.js
Page({
    data: {
        defaultCity: '武汉',
        totalHelpData: [],
        totalWeatherData: [],
        dates : [],
        ec: {
            onInit: initChart
          }
    },
    //onload函数处理wxml中关于时间的部分 不需要刷新所以放在onload中
    onLoad: function (e) {
        let that = this;
        let dates = require('../../utils/getNearDate');
        this.setData({
            dates: dates.getNearDate()
        })
    },
    //页面初次渲染完成
    onReady: function () {

    },
    //切换页面时触发该函数
    onShow: function () {
        let that = this;
        //请求缓存并将数据通过处理后放到 prediction.wxml上
        wx.getStorage({
            key: 'getData',
            success: function (res) {
                console.log("onShow中的请求缓存")
                //获取temps winds weathers开始
                console.log(res.data)
                let temps = []; let weathers = []; let winds = [];
                for (let i in res.data.results[0].weather_data) {
                    let tp = res.data.results[0].weather_data
                    let temp = res.data.results[0].weather_data[i].temperature.split(" ");
                    //console.log(temp);
                    let max = temp[0] + "°C";
                    let min = temp[temp.length - 1];
                    temps.push({ max: max, min: min });
                    weathers.push(tp[i].weather);
                    winds.push(tp[i].wind);
                };//获取temps结束

                //获取 title zs des 的开始
                let titles = []; let zss = []; let dess = [];
                for (let i in res.data.results[0].index) {
                    let temp = res.data.results[0].index;
                    titles.push(temp[i].title);
                    zss.push(temp[i].zs);
                    dess.push(temp[i].des);
                }
                // //获取 title zs des 的结束
                //设置结合到一起数据 方便循环生成
                let totalWeatherData = [];
                for (let i = 0; i < temps.length; i++) {
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
                console.log(totalHelpData);
                totalHelpData[4].title='紫外线';
                that.setData({
                    totalWeatherData: totalWeatherData,
                    totalHelpData: totalHelpData
                });

            },
        })
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
    }
})


