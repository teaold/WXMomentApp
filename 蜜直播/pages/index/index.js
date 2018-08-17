//index.js
//获取应用实例
const app = getApp()

Page({

  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,

    homedata: {},

    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    swiperItemShow: "swipershow",
    swiperItemHid: "swiperhid",
    swiperlefttxt: "swiper-left-txt",
    swiperrighttxt: "swiper-right-txt"
  },
  onShareAppMessage: function () {
    return {
      title: '蜜源直播平台',
      path: 'pages/index/index'
    }
  },
  // 拍手认证
  photomancheckA: function(e) {
    wx.navigateTo({
      url: '../photograHig/photograHig'
    })
  },
  // 拍手 新手
  photomancheckB: function (e) {
    wx.navigateTo({
      url: '../photograLow/photograLow'
    })
  },
  // 拍摄 预约
  photomancheckC: function (e) {
    wx.navigateTo({
      url: '../photobookA/photobookA'
    })
  },
  // 活动策划
  photomancheckD: function (e) {
    wx.navigateTo({
      url: '../photobookB/photobookB'
    })
  },
  // 直播 预约
  livebooking: function (e) {
    wx.navigateTo({
      url: '../booking/booking'
    })
  },
  
  // 详情页
  detailpage: function (e) {
    var that = this
    var pageurl = "http://play.yunxi.tv/livestream/4f3725c779cb4315a1e2aec170feff8e";
    // pageurl = 'http'
    if (pageurl.length > 10) {
      wx.navigateTo({
        url: '../webview/webview?url=' + pageurl //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀'../test/test?id=1&page=4',
      })
    }
    // console.log(pageurl)
    // console.log('url=' + pageurl)

  },
  // detailpage: function (e) {
  //   var that = this
  //   var userid = e.currentTarget.dataset.userid
  //   var usertype = e.currentTarget.dataset.usertype
  //   console.log(e)
  //   console.log('id=' + userid + 'type=' + usertype)
  //   wx.navigateTo({
  //     url: '../detailT/detailT?id=' + userid + "&type=" + usertype //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀'../test/test?id=1&page=4',
  //   })
  // },
  //banner网页
  bannerpage: function (e) {
    var that = this
    var itemM = e.currentTarget.dataset.model
    if (itemM.type == 'coupon'){//优惠券
      wx.navigateTo({
        url: '../../pages/coupon/coupon'
      })
    } else {
      var pageurl = itemM.url
      // pageurl = 'http'
      if (pageurl.length > 10) {
        wx.navigateTo({
          url: '../webview/webview?url=' + pageurl //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀'../test/test?id=1&page=4',
        })
      }
    }

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  
  onLoad: function () {
    var that = this

    GetList(that)
    GetBanner(that)

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  clickMe: function () {
    this.setData({ msg: "是我啊" })
  },
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: '021-39590800',  
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  //添加  
  liuyan: function (e) {
    var that = this
    console.log("拨打电话成功！")
    wx.navigateTo({
      url: '../case/case'  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀'../test/test?id=1&page=4',
    })
  },
  // 点击左侧菜单
  swiperLeftTap: function () {
    console.log("点击左侧菜单")
    this.setData({
      swiperItemShow: "swipershow",
      swiperItemHid: "swiperhid",
      swiperlefttxt: "swiper-left-txt",
      swiperrighttxt: "swiper-right-txt"
    })
  },
  // 点击右侧菜单
  swiperRightTap: function () {
    console.log("点击右侧菜单")
    this.setData({
      swiperItemShow: "swiperhid",
      swiperItemHid: "swipershow",
      swiperlefttxt: "swiper-right-txt",
      swiperrighttxt: "swiper-left-txt"
    })
  },

})

// 加载列表
var GetList = function (that) {
  var url = app.requestliveUrl;
  that.setData({
    hidden: false
  });
  wx.request({
    url: url,
    data: {
      
    },
    success: function (res) {
      if (res.data['code'] == 0){
        that.setData({
          homedata: res.data['data']
        });
      }
      
      that.setData({
        hidden: true
      });
    }
  });
}

// 加载banner
var GetBanner = function (that) {
  var url = app.requestBannerUrl;
  that.setData({
    hidden: false
  });
  wx.request({
    url: url,
    data: {
    },
    success: function (res) {
      var l = that.data.imgUrls
      for (var i in res.data['data']) {
        l.push(res.data['data'][i])
      }
      
      that.setData({
        imgUrls: l
      });
      
      that.setData({
        hidden: true
      });
    }
  });
}

