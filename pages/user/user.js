// pages/user/user.js
import Dialog from '../../dist/dialog/dialog';
import Toast from '../../dist/toast/toast';


const app = getApp();
Page({
    data: {
        nickName: '',
        places: [],
        deletePlaces: [],
    },
    onLoad: function () {
        wx.loadFontFace({
            family: 'kaiti',
            source: 'url(' + app.globalData.serverHttp + '/static/kaiti.ttf' + ')',
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
        wx.hideShareMenu();
    },
    onReady: function (e) {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this;
        console.log("user.js的onshow函数")
        let nickName = app.globalData.nickName;
        that.setData({
            nickName: nickName
        });

        //获取缓存信息结束
        //将请求到的palces存到data
        wx.request({
                url: app.globalData.serverHttp + '/getAllPlace',
                method: 'post',
                data: { nickName: that.data.nickName },
                success: function (res) {
                    that.setData({
                        places: res.data,
                        deletePlaces: []
                    })
                    console.log(that.data.places);
                }
            });//request -----end
        },
            //onShow 结束
            //滑动单元格
            onClose(event) {
                let that = this;
                const { position, instance } = event.detail;
                switch(position) {
            case 'left':
                console.log("左边");
                console.log(instance.id);
                wx.setStorage({
                    key: 'defaultCity',
                    data: instance.id
                });
                wx.switchTab({
                    url: '../place/place'
                })
                instance.close();
                break;
                case 'cell':
                console.log("cell");
                console.log(instance.id);
                instance.close();
                break;
                case 'right':
                console.log("右边");
                console.log(instance.id);
                Dialog.confirm({
                    message: '确定删除吗？'
                }).then(() => {
                    console.log("right方法中的值");
                    let deletePlace = instance.id;
                    that.delete(instance.id);
                    console.log("instance.id", instance.id);
                    wx.request({
                        url: app.globalData.serverHttp + '/deletePlace',
                        method: 'delete',
                        data: {
                            nickName: this.data.nickName,
                            deletePlace: deletePlace,
                        }
                    });
                    console.log(that.data.places);
                    if (that.data.places.length == 0) {
                        wx.setStorageSync('defaultCity', '北京市');
                        Toast('已检测到您的历史记录为空,现将所在地设为北京市');
                    }
                    else {
                        wx.setStorageSync('defaultCity', that.data.places[0]);
                    }

                });
                instance.close();
                break;
            }
    },

    delete: function (value) {
        console.log("delete函数")
        console.log("delete删除的是", value);
        console.log("places:", this.data.places);
        let index = this.data.places.indexOf(value);
        console.log("index:", index);
        let newPlaces = this.data.places;
        newPlaces.splice(index, 1);
        console.log("newPlaces:", newPlaces)
        this.setData({
            places: newPlaces
        });
    },



})