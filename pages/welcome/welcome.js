const app = getApp();
Page({
  data: {
    serverHttp:app.globalData.serverHttp
  },
  onLoad: function (options) {
  },//onLoad结束

   /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '一起来这里溜达溜达吧~',
      path: '/pages/welcome/welcome.wxml'
    }
  },

  bindGetUserInfo(e) {
    let that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              //console.log(res.userInfo);
              let nickName = res.userInfo.nickName;
              console.log('getSetting：nickName', nickName)
              app.globalData.nickName = nickName;
              //添加登录信息
              wx.request({
                url: app.globalData.serverHttp + '/nickName',
                method: "post",
                data: {
                  nickName: app.globalData.nickName
                }
              });
              console.log("全局信息nickName", app.globalData.nickName);
            },
            fail(res){
              console.log("未授权");
              app.globalData.nickName = null;
              console.log("全局信息nickName", app.globalData.nickName);
            }
          })//getUserInfo ---end
        }
        else {
          console.log("未授权");
          app.globalData.nickName = null;
          console.log("全局信息nickName", app.globalData.nickName);
        }
      },
    });
   


    this.getLocation();
  },


  //获取gps生成一个城市（市级单位）
  getLocation: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84',   //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
      success: function (res) {
        // success  
        var longitude = res.longitude
        var latitude = res.latitude
        that.loadCity(longitude, latitude)
      },
      fail:function(res){
        console.log("获取地理授权失败");
        wx.setStorage({
          key: "defaultCity",
          data: '北京市'
        });
        wx.switchTab({
          url: '../place/place'
        });
        
      }
    })
  },
  loadCity: function (longitude, latitude) {
    var that = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=w65uwmj5P2rqqpGv8iunSyyKgLke1bZo&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // success  
        var city = res.data.result.addressComponent.city;
        console.log("当前所在" + city);
        wx.setStorage({
          key: "defaultCity",
          data: city
        });
        // 跳转到tabBar页面（在app.json中注册过的tabBar页面），同时关闭其他非tabBar页面。
        wx.switchTab({
          url: '../place/place'
        });

      },
      fail: function () {
        console.log("转换微信所得信息失败,请重试");
        wx.switchTab({
          url: '../place/place'
        });
      },
    })
  },
  //GPS获取地理位置结束



})
