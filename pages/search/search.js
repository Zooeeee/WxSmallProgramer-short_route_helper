// pages/search/search.js
import Notify from '../../dist/notify/notify';
import Dialog from '../../dist/dialog/dialog';
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        serverHttp: app.globalData.serverHttp,
        active1: [0],
        pickArrayIndex: 0,
        pickArray: ["生活服务", "休闲娱乐", " 健身", "旅游景点", "自然地物 ", "美食",
            " 宾馆 ", "购物 ", "汽车服务", "运动", "医疗", "交通设施"],
        imgArray: [
            { src: app.globalData.serverHttp + "/static/search/shenghuofuwu.png", value: "生活服务" },
            { src: app.globalData.serverHttp + "/static/search/yule.png", value: "休闲娱乐" },
            { src: app.globalData.serverHttp + "/static/search/jianshen.png", value: "健身" },
            { src: app.globalData.serverHttp + "/static/search/jingdian.png", value: "旅游景点" },
            { src: app.globalData.serverHttp + "/static/search/ziran.png", value: "自然地物" },
            { src: app.globalData.serverHttp + "/static/search/meishi.png", value: "美食" },
            { src: app.globalData.serverHttp + "/static/search/binguan.png", value: "宾馆" },
            { src: app.globalData.serverHttp + "/static/search/gouwu.png", value: "购物" },
            { src: app.globalData.serverHttp + "/static/search/qichefuwu.png", value: "汽车服务" },
            { src: app.globalData.serverHttp + "/static/search/yundong.png", value: "运动" },
            { src: app.globalData.serverHttp + "/static/search/yiliao.png", value: "医疗" },
            { src: app.globalData.serverHttp + "/static/search/jiaotong.png", value: "交通设施" },
        ],
        click: 0,
        input: "",
        inputIsFocus: false
    },
    /**
  * 用户点击右上角分享
  */
    onShareAppMessage: function () {
        return {
            title: '一起来这里溜达溜达吧~',
            path: '/pages/search/search.wxml'
        }
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.loadFontFace({
            family: 'heiti',
            source: 'url(' + app.globalData.serverHttp + '/static/heiti.ttf' + ')',
            success(res) {
                console.log(res.status)
            },
            fail: function (res) {
                console.log(res.status)
            },
            complete: function (res) {
                console.log(res.status)
            }
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this;
        this.setData({
            list: [],
            input: "",
            pickArrayIndex: 0
        })
        wx.getStorage({//获取本地缓存
            key: "defaultCity",
            success: function (res) {
                that.setData({
                    defaultCity: res.data,
                    class: that.data.pickArray[0]
                }),
                    /////////////////////////
                    console.log("添加信息前的默认城市", that.data.defaultCity);
                wx.request({
                    url: app.globalData.serverHttp + '/addPlace',//指向服务器地址
                    method: "post",
                    data: {
                        nickName: app.globalData.nickName,
                        city: that.data.defaultCity
                    },
                    header: {
                        'content-type': 'Application/json'
                    },
                    success: function (res) {
                        console.log("添加默认城市", that.data.defaultCity);
                    },
                    fail: function (err) {
                        console.log(err);
                    }
                });
                //添加城市结束
            }
        });


    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    inputInput: function (e) {
        this.setData({
            input: e.detail.value
        })
    },
    //搜索
    search: function (e) {
        let that = this;
        console.log("that.data.input:",that.data.input);
        if (that.data.input !== '') {
            console.log("input不空")
            wx.request({
                url: "http://api.map.baidu.com/telematics/v3/point?&output=json&ak=w65uwmj5P2rqqpGv8iunSyyKgLke1bZo&" +
                    "cityName=" + that.data.defaultCity +
                    "&tag=" + that.data.class +
                    "&keyWord=" + that.data.input,
                success: function (res) {
                    /* console.log("picker:" + that.data.class);
                    console.log("input内容:" + that.data.input);
                    console.log("请求成功");
                    console.log(res.data.pointList); */
                    if (res.data.pointList.length == 0) {
                        console.log("请求的数据长度为0");
                        that.showNotify('查不到该地点，请换个更有名的');//调用顶层弹出栏
                        /*  wx.showToast({
                             title: '没有找到该地点',
                             icon: 'none',
                             duration: 1500
                         }) */
                    }
                    else
                        that.setData({
                            list: res.data.pointList
                        })
                }
            })
        }
        else{
            console.log("input空")
            that.showNotify('请输入地点');//调用顶层弹出栏
        }

    },//搜索结束

    //切换选项 并执行搜索
    optionClick: function (e) {
        console.log("点击的位置是" + e.currentTarget.dataset.text);
        let a = e.currentTarget.dataset.text;
        this.setData({
            class: this.data.imgArray[a].value,
            click: e.currentTarget.dataset.text
        });
        this.search();
    },
    //input聚焦
    inputFocus: function (e) {
        this.setData({
            inputIsFocus: !this.data.inputIsFocus
        })
    },

    //顶层弹出栏 只在查不到时弹出
    showNotify(text) {
        Notify({
            duration: 1500,
            text: text,
            selector: '#custom-selector',
            backgroundColor: 'red'
        });
    },

    //手风琴
    //手风琴组件函数
    onChange(event) {
        const { key } = event.currentTarget.dataset;
        this.setData({
            [key]: event.detail
        });
    },



})