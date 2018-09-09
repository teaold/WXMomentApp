// pages/webview/webview.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    errormsg:'警告',
    userinfo: {},
    accounts: ["男", "女",'未填'],
    sexname: '未填',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    GetList(that)
  },
  // 修改性别
  bindAccountChange: function (e) {
    this.data.userinfo['sex'] = this.data.accounts[e.detail.value]
    this.setData({
      sexname: this.data.accounts[e.detail.value]
    })
  },
  /**
   * 监听手机号输入
   */
  listenerPhone: function (e) {
    this.data.userinfo['phone'] = e.detail.value
  },

  /**
   * 监听名称输入
   */
  listenerName: function (e) {
    this.data.userinfo['user_name'] = e.detail.value
  },
  listenerAddr: function (e) {
    this.data.userinfo['addr'] = e.detail.value
  },
  /**
   * 监听登录按钮
   */
  listenerEdit: function () {
    
    var telRule = /^1[2-9]\d{9}$/, nameRule = /^[\u2E80-\u9FFF]+$/
    if (this.data.userinfo['user_name'] == '') {
      this.showTopTips('请输入姓名')
    } else if (this.data.userinfo['phone'] == '') {
      this.showTopTips('请输入手机号码')
    } else if (!telRule.test(this.data.userinfo['phone'])) {
      this.showTopTips('手机号码格式不正确')
    } else if (this.data.userinfo['addr'] == '') {
      this.showTopTips('请输入城市')
    } else {
          
          var that = this
      var url1 = app.requestmodifyuserinfoUrl;

          wx.showLoading({
            title: '提交中...',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)

      that.data.userinfo['user_id'] = app.globalData.openid;
          wx.request({
            url: url1,
            data: that.data.userinfo,
            //POST请求要添加下面的header设置
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {

              that.setData({
                hidden: true
              });
              wx.hideLoading()
              console.log(res)
              if (res.data['code'] == '0') {
                wx.showToast({
                  title: res.data['msg']
                })
                
                setTimeout(function () {
                  wx.navigateBack();
                }, 1000)
                
              }
            },
            fail: function (res) {
              wx.hideLoading()
              wx.showToast({
                title: '网络错误,请稍后再试',
              })

            },

            complete: function (res) {
              wx.hideLoading()
            }

          });

         }
   },
  showMessage: function (text) {
    wx.showToast({
      title: text,
      icon: 'warn',
      duration: 3000
    });
  }, 
  showTopTips: function (text) {
    var that = this;
    this.setData({
      showTopTips: true,
      errormsg:text
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  }
})

var GetList = function (that) {
  var url = app.requestuserinfoUrl;
  that.setData({
    hidden: false
  });
  wx.request({
    url: url,
    data: {
      user_id: app.globalData.openid
    },
    success: function (res) {
      if (res.data['code'] == 0) {
        that.setData({
          userinfo: res.data['data'],
          sexname: res.data['data']['sex']
        });
      }

      that.setData({
        hidden: true
      });
    }
  });
}
