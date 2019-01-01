// pages/search/search.js
import Notify from '../../dist/notify/notify';
import Dialog from '../../dist/dialog/dialog';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active1: [0],
        pickArrayIndex: 0,
        pickArray: ["生活服务", "休闲娱乐", " 健身", "旅游景点", "自然地物 ", "美食",
            " 宾馆 ", "购物 ", "汽车服务", "运动", "医疗", "交通设施"],
        imgArray: [
            { src: "./img/shenghuofuwu.png", value: "生活服务" },
            { src: "./img/yule.png", value: "休闲娱乐" },
            { src: "./img/jianshen.png", value: "健身" },
            { src: "./img/jingdian.png", value: "旅游景点" },
            { src: "./img/ziran.png", value: "自然地物" },
            { src: "./img/meishi.png", value: "美食" },
            { src: "./img/binguan.png", value: "宾馆" },
            { src: "./img/gouwu.png", value: "购物" },
            { src: "./img/qichefuwu.png", value: "汽车服务" },
            { src: "./img/yundong.png", value: "运动" },
            { src: "./img/yiliao.png", value: "医疗" },
            { src: "./img/jiaotong.png", value: "交通设施" },
        ],
        click: 0,
        tipsIsShow:false,
        input:"",
        inputIsFocus:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
                })
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
                    that.showNotify2();//调用顶层弹出栏
                   /*  wx.showToast({
                        title: '没有找到该地点',
                        icon: 'none',
                        duration: 1500
                    }) */
                }
                else
                that.setData({
                    list: res.data.pointList,
                    tipsIsShow:true
                })
            }
        })

    },//搜索结束

    //切换选项 并执行搜索
    optionClick: function (e) {
        console.log("点击的位置是"+e.currentTarget.dataset.text);
        let a = e.currentTarget.dataset.text;
        this.setData({
            class: this.data.imgArray[a].value,
            click: e.currentTarget.dataset.text
        });
        this.search();
    },
    //input聚焦
    inputFocus:function(e){
        this.setData({
            inputIsFocus:!this.data.inputIsFocus
        })
    },

    //顶层弹出栏 只在查不到时弹出
    showNotify2() {
        Notify({
          duration: 1500,
          text: '查不到该地点，请换个更有名的',
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