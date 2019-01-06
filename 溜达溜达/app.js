App({
  //系统初始化时 获取gps生成一个城市（市级单位）
  onLaunch: function (e) {
    console.log("系统第一次初始化");
   

  },


  
  globalData: {
    serverHttp: 'http://127.0.0.1:3000',
    nickName: ''

  },


})