//app.js
var baseUrl = 'http://localhost/public/index.php/index/moments/'
App({
  onLaunch: function () 
  {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (lb) {
          //console.log(lb.code);
          //console.log(that.requestUrl);
          //拿到code后请求服务器获取身份标识写入缓存
          wx.request({
            url: that.requestUrl,
            data: 
            {
              flag: 'code' ,
              code: lb.code
            },
            header: 
            {
                'content-type': 'application/x-www-form-urlencoded',
            },
            method:'POST',
            success: function(lb) 
            {
              console.log(lb.data)
              that.userId = lb.data.userid
            },
            fail: function(lb)
            {
              console.log(lb)
            }
          })

          // 用户OBJ写入全局对象
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    // userInfo:null
    userInfo: {openId:'1',nickName:'波波'}
  },
  requestUserinfoUrl: baseUrl+'modifyuserinfo',
  requestUrl: baseUrl +'momentlist',
  requestAddMomentUrl: baseUrl + 'addMoment',
  requestDelMomentUrl: baseUrl + 'delemoment',
  requestAddCommentUrl: baseUrl + 'addComment',
  requestliveUrl: baseUrl +'livelist',
  requestBannerUrl: baseUrl +'banner',
  requestcouponUrl: baseUrl +'couponlist',
  requestgetcouponUrl: baseUrl +'getcoupon',
  requestusercouponlisturl: baseUrl +'usercouponlist',
  userId:null,
  // http://47.52.142.116/friend/pengyuquan.php
})