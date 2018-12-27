// pages/user/user.js
Page({
    data: {
        nickName: '',
        places: [],
        deletePlaces: [],
        editFlag: false,//true是编辑界面 false是一般界面
        isDelete: []    //存放每个条目的状态
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this;
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
    delete: function (e) {
        let value = e.currentTarget.id;
        let index = this.data.places.indexOf(value);
        let newIsDelete = this.data.isDelete;
        newIsDelete[index] = true;
        //上述代码改变条目的状态
        let newDeletePlaces = this.data.deletePlaces
        if (newDeletePlaces.indexOf(value) == -1) {
            newDeletePlaces.push(value); //如果删除地点中没有
        }
        this.setData({
            isDelete: newIsDelete,
            deletePlaces: newDeletePlaces
        })

    },

    //保存/编辑的改变
    clickEdit: function (e) {
        let newFlag = !this.data.editFlag;
        this.setData({ editFlag: newFlag });
    },

    //点击保存按钮之后
    clickSave: function (e) {
        let that = this ;
        let newFlag = !this.data.editFlag;
        this.setData({ editFlag: newFlag });
        console.log(this.data.deletePlaces);
        wx.request({
            url:'http://192.168.1.107:3000/deletePlace',
            method:'delete',
            data:{
                nickName:that.data.nickName,
                deletePlaces:that.data.deletePlaces
            },
            success:function(res){
                console.log("发送delete成功");
            }
        });
        this.onShow();


    }//点击保存按钮-----end

})