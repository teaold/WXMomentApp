//index.js
//获取应用实例
var app = getApp()
Page({
  data:
    {
      userInfo: {}, // 存放用户信息
      resultData: [], // 存放数据
      imgplace: "../../meheadplace.png",
      userStatus: {}, // 存放地理位置
      scrolltop: 20, // 滚动轴TOP
      page: 1, // 页码值
      cz_flag: false, // 控制点赞评论按钮
      cz_right: 0, // 点赞评论定位right
      cz_top: 80, // 点赞评论定位top
      dz_id: null, // 点赞评论ID
      animationData: {},
      animationData1: {}, // 发布按钮下滑动画
      animationData2: {}, // 位置按钮下滑动画

      zanimg: '/images/dianzan.png'
    },
  // 初始方法
  onLoad: function (e) {
    // 根据不同参数执行不同的操作
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
      //app.globalData.userInfo = userInfo
      //console.log(userInfo.avatarUrl)
    })

    that.data.userStatus['state'] = e.state;
    //console.debug(e.state)
    // 上一个页面传过来的用户信息参数赋值
    that.data.userStatus['name'] = e.name;
    that.data.userStatus['address'] = e.address;
    that.data.userStatus['userId'] = e.userId;
    that.data.userStatus['userId'] = app.userId;

    that.data.userStatus['moment_id'] = e.id;

    that.bindLoding()
    that.onloadRequest(0)


    var dataTop = { 'detail': { 'scrollTop': 0 } }
    that.scrollHandle(dataTop)

    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //console.log(userInfo)
      //更新数据
      that.setData({
        userInfo: userInfo,
      })
    })
  },
  onReloadPage: function () {
    // 重新加载页面 页面显示
    var that = this
    that.onloadRequest(1)
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    console.log('页面显示')
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  onloadRequest: function (e, page) {
    page = page == undefined ? 0 : page
    //console.debug(e+"---"+page)
    var that = this
   
      wx.request({
        url: app.requestDetailMomentUrl,
        data: {
          flag: 'detail',
          moment_id: that.data.userStatus['moment_id'],
          user_id: '1'
        },
        success: function (res) {
          console.log(res)
          if (res.data.code == 0) {
            wx.hideToast()
            wx.stopPullDownRefresh()

            that.setData({
              resultData: res.data.data
            })

            if (e == 1) {//改变更新
              var datatempM = res.data.data[0];
              var pages = getCurrentPages();
              if (pages.length > 1) {
                var prePage = pages[pages.length - 2];
                prePage.onReloadPage()
              }
            }
          }
        },
        fail: function (res) {
          console.log(res)
        }
      })
    
    
  },
  bindLoding: function () { // LOADING加载
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
  },
  onPullDownRefresh: function () { //下拉刷新
    var that = this
    that.bindLoding()
    that.onloadRequest(0)
    that.setData({
      page: 1,
      resultData: []
    })

  },
  scrollHandle: function (e) { //滚动事件
    // console.log(e.detail.scrollTop)
    var anum = e.detail.scrollTop <= 20 ? 20 : e.detail.scrollTop
    var that = this
    that.donghua(anum)
  },
  donghua: function (topNum) // 发布按钮动画
  {
    var that = this
    // 动画1
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
      delay: 0,
    })

    var animation1 = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
      delay: 0,
    })

    animation.opacity(0).translateY(topNum + 5).step()
    animation1.opacity(0).translateY(topNum + 5).step()

    that.setData({
      animationData1: animation.export(),
      animationData2: animation1.export()
    })

    setTimeout(function () {
      animation.opacity(1).step()
      animation1.opacity(1).step()

      that.setData({
        animationData1: animation.export(),
        animationData2: animation1.export()
      })
    }, 1500)


    // this.setData({
    //   animationData1:animation.export(),
    //   animationData2:animation1.export()
    // })



    // animation.translateY(topNum).step().opacity(1).step()
    // animation1.translateY(topNum).opacity(1).step()




  },
  scrollLoading: function () { //滚动加载
    var that = this
    //console.log(that.data.page)
    that.setData({
      page: that.data.page + 1
    })
    // 临时关闭
    // that.bindLoding()
    // that.onloadRequest(1,that.data.page)
    // that.setData({
    //   scrolltop: that.data.scrolltop
    // })
  },
  bindDele: function (event) { //删除动态
    var that = this
    var del_moment_id = event.target.dataset.deleid
    // 弹出提示让用户确认是否删除
    wx.showModal({
      content: '您确定要删除当前动态吗, 删除后将无法恢复!',
      success: function (res) {
        if (res.confirm) {

          wx.showLoading({
            title: '删除中...',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
          // 执行REQUEST 删除当前记录
          wx.request({
            url: app.requestDelMomentUrl,
            data: {
              flag: 'dele',
              // openid:event.target.dataset.deleuserid,
              user_id: '1',
              moment_id: del_moment_id
            },
            // header: {
            //     'content-type': 'application/x-www-form-urlencoded',
            // },
            // method:'POST',
            success: function (res) {
              wx.hideLoading()
              // console.log(res.data);
              if (res.data['code'] == 0) {
                that.showMessage('已删除')
                var dataM = that.data.resultData[0]
                
                var pages = getCurrentPages();
                if (pages.length > 1) {
                  //上一个页面实例对象
                  var prePage = pages[pages.length - 2];
                  //关键在这里
                  prePage.onReloadPage()
                }
                setTimeout(function () {
                  wx.navigateBack();
                }, 1000)
              }
            },
            fail: function (res) {
              wx.hideLoading()
            },
            complete: function (res) {
              wx.hideLoading()
            }
          })
        }
      }
    })
  },
  bindAdd: function () {// 跳转朋友圈
    var that = this
    // 用户朋友圈输入
    wx.showActionSheet({
      itemList: ['发布'],
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex)

          if (res.tapIndex == 0) {
            wx.navigateTo({
              url: '../../pages/addComment/addComment?userId=' + that.data.userStatus.userId + '&address=' + that.data.userStatus.address + '&name=' + that.data.userStatus.name + '&lat=' + that.data.userStatus.lat + '&lnt=' + that.data.userStatus['lnt']
            })
          }
        }
      }
    })
  },
  // 详情页
  detailpage: function (e) {
    
  },
  previewImage: function (e) { // 展示图片
    var current = e.target.dataset.src
    // var count = e.target.dataset.count.split(",")
    var count = [current]
    // console.log(count)
    wx.previewImage({
      current: current,
      urls: count
    })
  },
  locationWb: function () { //选择地理位置跳转进入微博友圈

    wx.redirectTo({
      url: '../../pages/address/address'
    })

  },
  bindCaoZuo: function (e) {  //评论点赞
    var that = this
    var userId = app.userId
    var dz_id = e.currentTarget.dataset.id
    // 获取当前节点的偏移TOP值计算当前点赞操作的位置
    var offsetTop = Math.floor(e.currentTarget.offsetTop)
    // 赋值计算好的TOP值显示按钮
    that.setData({
      dz_id: dz_id,
      cz_top: offsetTop,
      cz_flag: true
    })

    // 动画
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
      delay: 0,
    })

    // 0.3秒后滑动
    setTimeout(function () {
      animation.right(40).opacity(1).step()
      that.setData({
        animationData: animation.export()
      })
    }, 300)

    // 5秒后自动隐藏按钮
    var timeout = setTimeout(function () {
      animation.right(0).opacity(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 2000)

  },
  // bindDianZan: function () // 处理点赞
  // {
  //   var that = this
  //   that.setData({
  //     zanimg: '/images/yidianzan.png'
  //   })
  // },
  bindDianZan: function (e) // 处理点赞
  {
    var that = this
    var dataM = e.currentTarget.dataset.model
    if (dataM.praise == 0) {//未点赞

      wx.request({
        url: app.requestaddLikeUrl,
        data: {
          user_id: '1',
          user_name: app.globalData.userInfo.nickName,
          like: '1',//1 : 点赞 ,0 取消赞
          moment_id: dataM.moment_id
        },
        // header: {
        //     'content-type': 'application/x-www-form-urlencoded',
        // },
        // method:'POST',
        success: function (res) {
          wx.hideLoading()
          console.log(res.data);
          if (res.data['code'] == 0) {
            // this.showMessage('已赞')
            var dataList = that.data.resultData
            for (var i = 0; i < dataList.length; i++) {
              var datatempM = dataList[i];
              datatempM['praise'] = '1';
              dataList[i] = datatempM;
              
              var pages = getCurrentPages();
              if (pages.length > 1) {
                //上一个页面实例对象
                var prePage = pages[pages.length - 2];
                //关键在这里
                prePage.onReloadPage()
              }
            }

            // 构成新对象并且展示
            that.setData({
              resultData: dataList
            })
          }
        },
        fail: function (res) {
          wx.hideLoading()
        },
        complete: function (res) {
          wx.hideLoading()
        }
      })
    }

  },
  bindPingLunA: function (e) // 处理评论
  {
    var that = this
    var moment_id = e.currentTarget.dataset.id

    wx.navigateTo({
      url: '../addPingLun/addPingLun?id=' + moment_id + '&state=0'
    })
  },
  bindPingLunB: function (e) { // 处理已有评论的回复
    var dataM = e.currentTarget.dataset.model
    // console.log(dataM)
    if (dataM.replyed_id == 0) {
      wx.navigateTo({
        url: '../addPingLun/addPingLun?id=' + dataM.moment_id + '&userId=' + dataM.reply_id + '&nickname=' + dataM.reply_name + '&state=1'
      })
    } else {
      wx.navigateTo({
        url: '../addPingLun/addPingLun?id=' + dataM.moment_id + '&userId=' + dataM.reply_id + '&nickname=' + dataM.reply_name + '&hf_userId=' + dataM.replyed_id + '&hf_nickname=' + dataM.replyed_name + '&state=2'
      })
    }
  },
})

