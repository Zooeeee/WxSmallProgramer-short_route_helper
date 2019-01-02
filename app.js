App({
    //系统初始化时 获取gps生成一个城市（市级单位）
    onLaunch: function (e) {
        console.log("系统第一次初始化");
        wx.loadFontFace({
            family: 'font1',
            source: 'url("http://localhost:3000/static/font1.ttf")',
            success(res) {
              console.log(res.status)
            },
            fail: function(res) {
              console.log(res.status)
            },
            complete: function(res) {
              console.log(res.status)
            }
          });
          wx.loadFontFace({
            family: 'font2',
            source: 'url("http://localhost:3000/static/font2.ttf")',
            success(res) {
              console.log(res.status)
            },
            fail: function(res) {
              console.log(res.status)
            },
            complete: function(res) {
              console.log(res.status)
            }
          });
    },


})