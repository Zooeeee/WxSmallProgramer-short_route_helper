Page({
  data: {
  },
  onLoad: function (options) {
    let that = this;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              //console.log(res.userInfo);
              let nickName = res.userInfo.nickName;
              that.setData({
                nickName:nickName
              })
            }
          })//getUserInfo ---end
        }
      }
    });
    //授权结束
    //访问一次服务器 把nickName发到服务器
   

  },//onLoad结束
  bindGetUserInfo(e) {
    let that = this ;
    console.log(e.detail.userInfo);
    this.setData({
      url: e.detail.userInfo.avatarUrl
    });
    //获取地理信息
    this.getLocation();
    //访问服务器
    wx.request({
      url: 'http://192.168.1.107:3000/nickName',//指向服务器地址
      method: "post",
      data: {
        nickName: that.data.nickName
      },
      header: {
        'content-type': 'Application/json'
      },
      success: function (res) {
        console.log("访问服务器成功");
      }
    });
    //访问一次服务器 ---end
    console.log("访问服务器之后"+that.data.nickName);
    wx.setStorage({//往缓存中放nickName
      key:'nickName',
      data:that.data.nickName
    });//
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
        })
      },
      fail: function () {
        console.log("转换微信所得信息失败")
      },
    })
  },
  //GPS获取地理位置结束



})
