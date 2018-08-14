// pages/webview/webview.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    weburl: "",
    list: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    GetList(that)
  },
  // 领取优惠券
  addcoupon: function (e) {
    var that = this
    var number_id = e.currentTarget.dataset.numberid
    var url = app.requestgetcouponUrl;
    wx.request({
      url: url,
      data: {
        // user_id: app.globalData.userInfo.user_id
        user_id:'1',
        numberid: number_id
      },
      success: function (res) {
        console.log(res.data['data'])
        console.log('领取成功!')
        // that.setData({
        //   list: res.data['data']
        // });

        that.setData({
          hidden: true
        });
      }
    });

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


// 加载优惠券
var GetList = function (that) {
  var url = app.requestcouponUrl;
  that.setData({
    hidden: false
  });
  wx.request({
    url: url,
    data: {
    },
    success: function (res) {
      // var l = []
      // for (var i in res.data['data']) {
      //   l.push(res.data['data'][i])
      // }
      // console.log(l)
      that.setData({
        list: res.data['data']
      });

      that.setData({
        hidden: true
      });
    }
  });
}
