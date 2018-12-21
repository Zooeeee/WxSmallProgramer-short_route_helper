App({
    data: { currentCity: '' },

    //系统初始化时 获取gps生成一个城市（市级单位）
    onLaunch: function (e) {
        console.log("系统第一次初始化", this.data.currentCity)
        this.getLocation();
    },
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
                console.log("当前所在"+city);
                wx.setStorage({
                    key:"defaultCity",
                    data:city
                })
               
            },
            fail: function () {
                console.log("转换微信所得信息失败")
            },

        })
    }


})