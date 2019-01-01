// pages/user/user.js
import Dialog from '../../dist/dialog/dialog';
Page({
    data: {
        nickName: '',
        places: [],
        deletePlaces: [],
        isDelete: []    //存放每个条目的状态
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this;
        console.log("user.js的onshow函数")
        wx.getStorage({
            key: 'nickName',
            success: function (res) {
                that.setData({
                    nickName: res.data
                })
            }
        })
        //获取缓存信息结束
        //将请求到的palces存到data
        wx.request({
            url: 'http://192.168.1.107:3000/getAllPlace',
            method: 'post',
            data: { nickName: that.data.nickName },
            success: function (res) {
                let isDelete = [] //存放每个条目的状态
                for (let i = 0; i < res.data.length; i++) {
                    isDelete.push(false);
                }
                that.setData({
                    places: res.data,
                    isDelete: isDelete,
                    deletePlaces: []
                })
                console.log(that.data.places);
            }
        });//request -----end
    },
    //onShow 结束
    //滑动单元格
    onClose(event) {
        let that = this ;
        const { position, instance } = event.detail;
        switch (position) {
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
                    that.delete(instance.id);
                    wx.request({
                        url: 'http://192.168.1.107:3000/deletePlace',
                        method: 'delete',
                        data: {
                            nickName: this.data.nickName,
                            deletePlace: instance.id,
                        }
                    })
                    console.log(that.data.places);
                    if(that.data.places.length == 0 ){
                        wx.setStorageSync('defaultCity', '北京市');
                    }
                    else{
                        wx.setStorageSync('defaultCity', that.data.places[0]);
                    }
                   
                });
                instance.close();
                break;
        }
    },

    delete: function (value) {
        console.log("delete函数")
        let index = this.data.places.indexOf(value);
        let newIsDelete = this.data.isDelete;
        newIsDelete[index] = true;
        let newPlaces = this.data.places;
        newPlaces.splice(index,1);
        this.setData({
            isDelete: newIsDelete,
            places:newPlaces
        });
    },



})