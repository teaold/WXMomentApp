//index.js
//获取应用实例
var app = getApp()

Page({

  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isauthorize:1, //是否显示授权按钮
    pagedata: {}
  },
  onLoad: function () {
    var that = this
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              app.globalData.userInfo = res.userInfo
              console.log(res.userInfo)
              //console.log('用户已经授权过')

              //用户已经授权过
              wx.switchTab({
                url: '../../pages/index/index'
              })
            }
          })
        } else {
          that.setData({
            isauthorize: 0
          })
          
        }
      }
    });
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      app.globalData.userInfo = e.detail.userInfo
        wx.switchTab({
          url: '../../pages/index/index'
        })
      
    } else {
      // console.log('用户按了拒绝按钮')
      wx.showModal({
        title: '温馨提示',
        content: '为了更好的使用蜜源live相关功能,我们需要您的授权,获取昵称信息!',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          }
        }
      })
    }
  }

  

})

