// pages/prediction/prediction.js
Page({
    data: {
        defaultCity: '武汉',
        titles: [],
        zss: [],
        dess: [],
        weathers: [],
        winds: []
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
                //设置数据
                console.log(temps);
                that.setData({
                    temps: temps,
                    titles: titles,
                    dess: dess,
                    zss: zss,
                    winds: winds,
                    weathers: weathers
                });
            },
        })
    },
    //帮助消息绑定事件
    clickHelp: function (e) {
        let index = e.target.id;
        let that = this;
        wx.showModal({
            title: '友情提示',
            content: that.data.dess[index],
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


