var city = require('../../utils/city.js');
//cityList()返回如下数据结构
//tempObj[i] = {initial: "A", cityInfo: Array(10)};
//cityInfo[i] = {id: "35", provincecode: "150000", city: "阿拉善盟", code: "152900", initial: "A"}
var app = getApp()
Page({
    data: {
        searchLetter: [],
        showLetter: "",
        winHeight: 0,
        // tHeight: 0,
        // bHeight: 0,
        cityList: [],
        isShowLetter: false,
        scrollTop: 0,//置顶高度
        scrollTopId: '',//置顶id
        city: "上海市",
        hotcityList: [{ cityCode: 110000, city: '北京市' }, { cityCode: 310000, city: '上海市' }, { cityCode: 440100, city: '广州市' }, { cityCode: 440300, city: '深圳市' }, { cityCode: 330100, city: '杭州市' }, { cityCode: 320100, city: '南京市' }, { cityCode: 420100, city: '武汉市' }, { cityCode: 410100, city: '郑州市' }, { cityCode: 120000, city: '天津市' }, { cityCode: 610100, city: '西安市' }, { cityCode: 510100, city: '成都市' }, { cityCode: 500000, city: '重庆市' }]
    },
    onLoad: function () {
        // 生命周期函数--监听页面加载
        var searchLetter = city.searchLetter;
        var cityList = city.cityList();
        var sysInfo = wx.getSystemInfoSync();//获取系统信息
        var winHeight = sysInfo.windowHeight;//获取屏幕高度
        //字母高度=屏幕高度/字母表的长度
        var itemH = winHeight / searchLetter.length;
        var tempObj = [];
        for (var i = 0; i < searchLetter.length; i++) {
            var temp = {};
            temp.name = searchLetter[i];
            temp.tHeight = i * itemH;    //每个字母的顶部
            //console.log("tHeight:" + temp.tHeight);
            temp.bHeight = (i + 1) * itemH; //每个字母的底部
            //console.log("bHeight:" + temp.bHeight);
            tempObj.push(temp)
        }
        this.setData({
            winHeight: winHeight,
            itemH: itemH,
            searchLetter: tempObj,
            cityList: cityList
        });

        wx.hideShareMenu();
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成

    },
    onShow: function () {
        // 生命周期函数--监听页面显示
        let that = this ;
        wx.getStorage({
            key:'defaultCity',
            success:function(res){
                that.setData({city:res.data})
            }
        });

    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏

    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载

    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作

    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
    },
    clickLetter: function (e) {
        console.log(e.currentTarget.dataset.letter)
        var showLetter = e.currentTarget.dataset.letter;
        this.setData({
            showLetter: showLetter,
            isShowLetter: true,
            scrollTopId: showLetter,
        })
        var that = this;
        setTimeout(function () {
            that.setData({
                isShowLetter: false
            })
        }, 1000) //1s中之后弹出的字母框 消失
    },
    //选择城市
    bindCity: function (e) {
        console.log("bindCity")
        console.log("选择的普通城市" + e.currentTarget.dataset.city);

        this.setData({
            city: e.currentTarget.dataset.city
        })
        console.log("修改默认城市为" + e.currentTarget.dataset.city);
        wx.setStorage({
            key: 'defaultCity',
            data: e.currentTarget.dataset.city,
        });
    },
    //选择热门城市
    bindHotCity: function (e) {
        console.log("bindHotCity");
        console.log("选择的热门城市" + e.currentTarget.dataset.city);
        this.setData({
            city: e.currentTarget.dataset.city
        })
        this.setData({
            city: e.currentTarget.dataset.city
        });
        wx.setStorage({
            key: 'defaultCity',
            data: e.currentTarget.dataset.city,
        });
        console.log("修改默认城市为" + e.currentTarget.dataset.city);
    },
    //点击热门城市回到顶部
    hotCity: function () {
        this.setData({
            scrollTop: 0,
        })
    },

})