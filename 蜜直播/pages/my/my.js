

const app = getApp()


Page({
  data: {
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
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      getuserMsg(userInfo)
      that.setData({
        userInfo: userInfo
      })
    })

    
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
      url: '../../pages/mybooking/mybooking'
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

var getuserMsg = function (userInfo) {
  // var UId = app.globalData.loginData.openid
  // var NiName = app.globalData.userInfo.nickName
  // var headUrl = app.globalData.userInfo.avatarUrl
  // var that = this
  var UId = 1223

  var NiName = userInfo.nickName
  var headUrl = userInfo.avatarUrl
  // console.log(userInfo.nickName)

  if (app.globalData.loginData != null && UId != null){
    // console.log("用户！")
    // console.log(app.globalData.loginData)
    console.log("用户信息！")
    console.log(app.globalData.userInfo)
    if (app.globalData.userInfo == null){
      NiName = '0'
      headUrl = '0'
    }
    // console.log(UId + NiName + headUrl)
    // 添加注册用户
    wx.request({
      url: 'https://www.jdxlrx.com/phpmysql/saveUserMsg.php',
      data: {
        userId: UId,
        nickName: NiName,
        avatarUrl: headUrl
      },
      //POST请求要添加下面的header设置
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: res => {
        //openid:"o0buV5DEk-B1i8DpbgYvItK60qqM"
        // if (that.loginDataReadyCallback) {
        //   that.loginDataReadyCallback(res)
        // }
      }
    })
  }
  
}