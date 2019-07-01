

const app = getApp()


Page({
  data: {
    ismanager: false,
    nickName: '',
    avatarUrl: '',
    showGetUser: 'swipershow',
    userInfo: {}, // 存放用户信息

  },
  onLoad: function (options) {
    var that = this
    var tempUs = 'swipershow'
    if (app.globalData.userInfo != null) {
      tempUs = 'swiperhid'
    }
    //调用应用实例的方法获取全局数据  
    that.setData({
      showGetUser: tempUs
    });
    //调用应用实例的方法获取全局数据
    that.setData({
      userInfo: app.globalData.userInfo
    })
    loadmanager(that)
    
  },
  //添加  
  coupon: function (e) {
    var that = this
    // console.log("拨打电话成功！")
    wx.navigateTo({
      url: '../../pages/mycoupon/mycoupon'  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀'../test/test?id=1&page=4',
    })
  },
  // 设置用户信息
  settingInfo: function (e) {
    var that = this
    wx.navigateTo({
      url: '../../pages/userinfo/userinfo'
      // url: '../../pages/setting/setting'
    })
  },
  //我的预约 
  mybooking: function (e) {
    var that = this
    wx.navigateTo({
      url: "../../pages/mybooking/mybooking?tag=" + 'mybooking'
    })
  },
  dealbooking: function (e) {
    var that = this
    wx.navigateTo({
      url: '../../pages/mybooking/mybooking?tag=' + 'dealbooking'
    })
  },
  //我的动态 
  mymoment: function (e) {
    var that = this
    wx.navigateTo({
      url: '../../pages/mymoment/mymoment'
    })
  },

}) 


// 是否管理员
var loadmanager = function (that) {
  var url = app.requestismanagerUrl;
  wx.request({
    url: url,
    data: {
      user_id: app.globalData.openid
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    success: function (res) {
      if (res.data['code'] == 0) {
        that.setData({
          ismanager: res.data['manager'] == '1' ? true : false
        });
      }
    }
  });
}
