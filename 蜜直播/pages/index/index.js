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
    loadfail:false,
    homedata: {}, //首页加载数据
    
// ('title' => '在线直播','icon' => 'menuliveA.png','rightbtn' => '1','data' => $datalive,'datacount' => count($datalive))
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    swiperItemShow: "swipershow",
    swiperItemHid: "swiperhid",
    swiperlefttxt: "swiper-left-txt",
    swiperrighttxt: "swiper-right-txt"
  },
  onShareAppMessage: function() {
    return {
      title: '蜜源直播平台',
      path: 'pages/index/index'
    }
  },
  // 认证成功
  didcertpicman: function() {
    app.globalData.userInfo.authenticate = '1'
  },
  // 拍手认证
  photomancheckA: function(e) {
    console.log(app.globalData.userInfo)
    var user_auth = app.globalData.userInfo.authenticate
    console.log(user_auth)
    if (user_auth == 1) {
      wx.navigateTo({
        url: '../paishouInfo/paishouInfo'
      })
    } else {
      wx.navigateTo({
        url: '../photograHig/photograHig'
      })
    }

  },
  // 拍手 新手
  photomancheckB: function(e) {
    if (app.globalData.userInfo.authenticate == '1') {
      wx.navigateTo({
        url: '../paishouInfo/paishouInfo'
      })
    } else {
      wx.navigateTo({
        url: '../photograLow/photograLow'
      })
    }
  },
  // 录课预约
  photomancheckE: function (e) {
    wx.navigateTo({
      url: '../courseREC/index'
    })
  },
  // 拍摄 预约
  photomancheckC: function(e) {
    wx.navigateTo({
      url: '../photobookA/photobookA'
    })
  },
  // 活动策划
  photomancheckD: function(e) {
    wx.navigateTo({
      url: '../photobookB/photobookB'
    })
  },
  // 直播 预约
  livebooking: function(e) {
    wx.navigateTo({
      url: '../booking/booking'
    })
  },
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: '13918344690',
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  // 详情页
  detailpage: function(e) {

    var itemM = e.currentTarget.dataset.model
    var that = this
    var pageurl = itemM.url;
    // pageurl = 'http'
    if (pageurl == 'video') {
      wx.navigateTo({
        url: '../player/player?url=' + pageurl
      })
    } else if (pageurl == 'menuA') {
      that.photomancheckA(e);
    } else if (pageurl == 'menuB') {
      that.photomancheckB(e);
    } else if (pageurl == 'menuC') {
      that.photomancheckC(e);
    } else if (pageurl == 'menuD') {
      that.photomancheckD(e);
    } else if (itemM.type == 'scan') {
      that.previewImage(itemM.scanurl);
    }else if (pageurl.length > 10) {
      wx.navigateTo({
        // url:'../player/player'
        // url: '../webview/webview?url=https://www.miyuanlive.com/player'
        url: '../webview/webview?url=' + pageurl //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀'../test/test?id=1&page=4',
      })
    }
    // console.log(pageurl)
    // console.log('url=' + pageurl)

  },
  previewImage: function (e) { // 展示图片
    var current = e
    var count = [current]
    // console.log(count)
    wx.previewImage({
      current: current,
      urls: count
    })
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
  bannerpage: function(e) {
    var that = this
    var itemM = e.currentTarget.dataset.model
    if (itemM.type == 'coupon') { //优惠券
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
  reloadhomedata: function () {
    // console.log('reloadhomedata')
    var that = this
    GetList(that)
  },
  onLoad: function() {
    var that = this

    GetList(that)
    // GetBannerpics(that)
    GetBanner(that)

    loginuser(that)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },

  clickMe: function() {
    this.setData({
      msg: "是我啊"
    })
  },
  //添加  
  liuyan: function(e) {
    var that = this
    wx.navigateTo({
      url: '../case/case' //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀'../test/test?id=1&page=4',
    })
  },
  // 点击左侧菜单
  swiperLeftTap: function() {
    console.log("点击左侧菜单")
    this.setData({
      swiperItemShow: "swipershow",
      swiperItemHid: "swiperhid",
      swiperlefttxt: "swiper-left-txt",
      swiperrighttxt: "swiper-right-txt"
    })
  },
  // 点击右侧菜单
  swiperRightTap: function() {
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
var GetList = function(that) {
  var url = app.requestliveUrl;
  that.setData({
    hidden: false
  });
  wx.request({
    url: url,
    data: {
      user_id: '1'
    },
    success: function(res) {
      // console.log(res)
      if (res.data['code'] == 0) {
        that.setData({
          homedata: res.data['data']
        });
      }

      that.setData({
        hidden: true,
        loadfail: false
      });
    },
    fail: function (res) {
      this.setData({
        loadfail: true
      })
    }
  });
}
// 加载banner pics
var GetBannerpics = function (that) {
  var url = app.requestBannerpicUrl;
  that.setData({
    hidden: false
  });
  wx.request({
    url: url,
    data: {},
    success: function (res) {
      that.setData({
        imgUrls: res.data['data']
      });
      that.setData({
        hidden: true,
        loadfail: false
      });
    }
  });
}
// 加载banner
var GetBanner = function(that) {
  var url = app.requestBannerUrl;
  that.setData({
    hidden: false
  });
  wx.request({
    url: url,
    data: {},
    success: function(res) {
      var l = that.data.imgUrls
      for (var i in res.data['data']) {
        l.push(res.data['data'][i])
      }

      that.setData({
        imgUrls: l,
        loadfail: false
      });

      that.setData({
        hidden: true
      });
    }
  });
}

//登录
var loginuser = function(that) {
  // console.log('开始登录');
  wx.login({
    success: function(lb) {
      // console.log(lb.code);
      // console.log(app.requestLoginUrl);
      // 拿到code后请求服务器获取身份标识写入缓存
      wx.request({
        url: app.requestLoginUrl,
        data: {
          flag: 'code',
          code: lb.code
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function(lb) {
          // console.log(lb.data)
          app.globalData.openid = lb.data.openid,
            app.globalData.session_key = lb.data.session_key,
            registerser(that)

        },
        fail: function(lb) {
          // console.log(lb)
          that.setData({
            loadfail: true
          });
        }
      })

    }
  })
}

//注册
var registerser = function(that) {
    //requestregisterUrl
    var gender = '2'
    
    wx.request({
      url: app.requestregisterUrl,
      data: {
        user_id: app.globalData.openid,
        user_name: app.globalData.userInfo.nickName,
        avatar: app.globalData.userInfo.avatarUrl,
        sex: gender
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        // console.log(lb.data)
        if (res.data['code'] == '0') {
          app.globalData.userInfo = res.data['data']
        }
        that.setData({
          loadfail: false
        });
      },
      fail: function(res) {
        // console.log(lb)
        that.setData({
          loadfail: true
        });
      }
    })
  }

  // var uploadimg = function(that) {
      
  //       var that = this
  //       var pics = this.data.chooseImageUrl;


  //       wx.uploadFile({
  //         url: app.requestUploadImgUrl,
  //         filePath: pics[that.data.uploadimgindex],
  //         name: 'file',
  //         formData: {},
  //         //POST请求要添加下面的header设置
  //         // method: 'POST',
  //         // header: { "Content-Type": "application/x-www-form-urlencoded" },
  //         success: function(res) {
  //           console.log(res)
            
  //         },
  //         fail: (res) => {
  //           console.log(res)
  //         },
  //         complete: () => {
            
  //         }
  //       })
  //     }