// pages/today/today.js
const weatherTrans = require('../../utils/weatherTrans');
import Toast from '../../dist/toast/toast';
import Dialog from '../../dist/dialog/dialog';
const app = getApp();
Page({
  data: {
    serverHttp: app.globalData.serverHttp,
    defaultCity: '',
    iconSrc: app.globalData.serverHttp + "/static/place/GPS.png",
    dayCount: "",
    description: "",
    abstract: "",
    itineraries: [],
    title: "",
    plan: [],
    isShow: false
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '一起来这里溜达溜达吧~',
      path: '/pages/place/place.wxml'
    }
  },



  onLoad: function (e) {
    if (app.globalData.nickName == null) {
      Toast.fail("未获得您的允许,您的记录不会被记录在云端")
    }
    else {
      Toast.success("获得您的允许,您的记录会被记录在云端")
    };
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
  onReady: function (e) {

  },
  onShow: function (e) {
    console.log("today.js中的onshow函数");
    //清除数据避免出错
    this.setData({
      dayCountIndex: 0,
      dayCount: ""
    })
    let that = this;
    //从缓存中获取defatultCity
    //获取缓存的数据后 请求api 并将返回的数据缓存到本地
    wx.getStorage({
      key: 'defaultCity',
      success: function (res) {
        //console.log("从缓存中提取默认城市：" + res.data)
        that.setData({
          defaultCity: res.data
        });
        //发送nickName 和 place
        console.log("添加信息前的默认城市", that.data.defaultCity);
        if (app.globalData.nickName !== null) {
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
              console.log("添加默认城市",that.data.defaultCity);
            },
            fail: function (err) {
              console.log(err);
            }
          });
          //访问一次服务器 ---end
        }
        //根据defaultCity的值 去 请求api 得到预测天气数据后存入缓存区
        wx.request({
          url: 'https://api.map.baidu.com/telematics/v3/weather?output=json&ak=1a3cde429f38434f1811a75e1a90310c&location='
            + res.data,
          success: function (e) {
            wx.setStorage({
              key: 'getData',
              data: e.data,
            });//设置缓存结束
            let obj = e.data.results[0].weather_data[0];
            //console.log(obj);
            console.log("添加天气icon");
            let weatherIconSrc = weatherTrans.src(obj.weather, app.globalData.serverHttp);
            that.setData({
              date: obj.date,
              temperature: obj.temperature,
              weather: obj.weather,
              weatherIconSrc: weatherIconSrc
            });

          }
        });//请求api结束
        //请求第二个api,关于行程的
        wx.request({
          url: "http://api.map.baidu.com/telematics/v3/travel_city?output=json&ak=w65uwmj5P2rqqpGv8iunSyyKgLke1bZo&location="
            + that.data.defaultCity + "&day=all",
          success: function (res) {
            console.log(res);
            //没有出行信息就报错
            if (res.data.result.itineraries == null) {
              wx.showModal({
                title: '抱歉',
                content: '抱歉！暂时没有该地区计划信息',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else {
                    console.log('用户点击取消')
                  }
                }
              });
              that.setData({
                description: res.data.result.description,
                abstract: res.data.result.abstract,
                itineraries: [],
                title: "",
                dayCount: [],
                plan: [],
                isShow: false
              })
            }
            //有出行信息
            else {
              let itineraries = res.data.result.itineraries;
              //console.log("得到的数据",itineraries);
              const getItineraries = require("../../utils/getItineraries");
              that.setData({
                description: res.data.result.description,
                abstract: res.data.result.abstract,
                itineraries: itineraries,
                title: itineraries[0].description,
                dayCount: getItineraries.getPickers(itineraries),
                plan: itineraries[0].itineraries,
                isShow: true
              })
            }
          }
        })
        //请求第二个api,关于行程的结束
      },
    });//请求缓存结束




  },

  //点击每一天的计划可以弹出一个消息框，其中有路程帮助信息
  routeHelp: function (e) {
    console.log("餐饮信息");
    let dinning = this.data.plan[e.target.id].dinning
    //console.log(dinning);//餐饮信息
    if(dinning!==''){
      this.onClickAlert('餐饮帮助', dinning)
    }
    else{
      this.onClickAlert('餐饮帮助','暂无信息')
    }
  },

  clickAbstract: function (e) {
    let description = this.data.description;
    this.onClickAlert('详细描述', description)
  },

  //手风琴组件函数
  onChange(event) {
    const { key } = event.currentTarget.dataset;
    this.setData({
      [key]: event.detail
    });
  },
  //标签点击
  tabsOnClick(event) {
    let index = event.detail.index;
    let title = this.data.itineraries[index].description; //字符串
    let obj = this.data.itineraries[index].itineraries; //数组
    this.setData({
      title: title,
      plan: obj
    });
  },

  //弹出栏
  onClickAlert(title, message) {
    Dialog.alert({
      title: title,
      message: message
    });
  },



})