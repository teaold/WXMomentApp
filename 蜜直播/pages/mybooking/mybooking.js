
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    weburl: "",
    list: [],
    ismanager:false,
    mybookingpage:"0"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      mybookingpage: options.tag
    });
    console.log(options.tag)
    GetList(that)
  },
  //确认
  checkbooking: function (e) {
    console.log('已联系客户,确认预约已完成?')
    var that = this
    var model = e.currentTarget.dataset.model
    wx.showModal({
      content: '已联系客户,确认预约已完成?',
      success: function(res) {
        if (res.confirm) {
          var url = app.requestcheckbookingUrl;
          wx.request({
            url: url,
            data: {
              user_id: app.globalData.openid,
              book_id: model.id
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            success: function (res) {
              if (res.data['code'] == 0) {
                GetList(that)
              }
            }
          });
        }
      }
    })
  },
  checkcall: function (e) {
    var that = this
    var model = e.currentTarget.dataset.model
    // console.log(e)
    wx.makePhoneCall({
      phoneNumber: model.phone,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})


// 我的预约列表
var GetList = function (that) {
  var url = app.requestuserlivebookUrl;
  var manager_page = that.data.mybookingpage == "dealbooking" ? '1' : '0';
  wx.request({
    url: url,
    data: {
      user_id: app.globalData.openid,
      managerpage: manager_page
    },
    success: function (res) {
      if (res.data['code'] == 0) {
        console.log(res)
        that.setData({
          list: res.data['data'],
          ismanager: res.data['manager'] == '1' ? true :false

        });
        console.log(that.data.ismanager)
      }
    }
  });
}
