App({
  //系统初始化时 获取gps生成一个城市（市级单位）
  onLaunch: function (e) {
    console.log("系统第一次初始化");
    let that = this;
    // 查看是否授权
    ///
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              //console.log(res.userInfo);
              let nickName = res.userInfo.nickName;
              console.log('getSetting：nickName', nickName)
            }
          })//getUserInfo ---end
        }
      }
    });
    //授权结束
    //访问一次服务器 把nickName发到服务器
    ///


  },

  globalData: {
    serverHttp: 'http://127.0.0.1:3000',
    nickName: ''

  },


})