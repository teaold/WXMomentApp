var app = getApp()
Page({
  /**
   * 初始化数据
   */
  data: {
    checkData: {},
    price: '0',
    payname:'免费预约',
    dates: '2018-01-08',
    showMessage: false,
    messageContent: ''
  },
  listenerPhoneInput: function (e) {
    this.data.checkData['phone'] = e.detail.value;
  },
  listenerNameInput: function (e) {
    this.data.checkData['name'] = e.detail.value;
  },
  listenerThemeInput: function (e) {// 性别
    this.data.checkData['theme'] = e.detail.value;
  },
  listenerDetailAddrInput: function (e) {// 详细地点
    this.data.checkData['address'] = e.detail.value;
  },
  showMessage: function (text) {
    var that = this
    that.setData({
      showMessage: true,
      messageContent: text
    })
    setTimeout(function () {
      that.setData({
        showMessage: false,
        messageContent: ''
      })
    }, 1000)
  },
  /**
   * 监听登录按钮
   */
  listenerLogin: function () {
    var sendData = this.data.checkData
    var telRule = /^1[2-9]\d{9}$/, nameRule = /^[\u2E80-\u9FFF]+$/
    if (sendData['name'] == undefined || sendData['name'] == '') {
      this.showMessage('请输入姓名')
    } else if (sendData['phone'] == undefined || sendData['phone'] == '') {
      this.showMessage('请输入手机号码')
    } else if (!telRule.test(sendData['phone'])) {
      this.showMessage('手机号码格式不正确')
    } else if (sendData['theme'] == undefined || sendData['theme'] == '') {
      this.showMessage('请选择活动主题')
    } else if (sendData['date'] == undefined || sendData['date'] == '') {
      this.showMessage('请选择活动时间')
    } else if (sendData['address'] == undefined || sendData['address'] == '') {
      this.showMessage('请输入详细地点')
    } else if (sendData['machine'] == undefined || sendData['machine'] == '') {
      this.showMessage('请选择机位需求')
    } else {

      sendData['user_id'] = app.globalData.openid,
      sendData['type'] = 'live';
      sendData['pay'] = 'not';

      var that = this
      var url1 = app.requestlivebookingUrl;

      wx.showLoading({
        title: '提交中...',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)

      wx.request({
        url: url1,
        data: sendData,
        //POST请求要添加下面的header设置
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {

          that.setData({
            hidden: true
          });
          wx.hideLoading()
          // wx.showToast({
          //   title: res.data['msg'],
          // })
          if (res.data['code'] == '0') {
            wx.showModal({
              content: '预约成功, 我们将会尽快审核!请勿重复预约哦',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack();
                }
              }
            })
            
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

  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    this.data.checkData['date'] = e.detail.value;
    this.setData({
      dates: e.detail.value
    })
  },
  // 机位选择 1 单机位 ,2 双机位 ,3 多机位
  radioChange: function (e) {
    //console.log(e.detail.value)
    var that = this
    // var newprice = that.data.price
    // var newpayname = '预 约'
    if (e.detail.value == 1){
      // newprice = '3500'
      // newpayname = '支付3500元'
      this.data.checkData['machine'] = '单机位'
    } else if (e.detail.value == 2) {
      // newprice = '5000'
      // newpayname = '支付5000元'
      this.data.checkData['machine'] = '双机位'
    } else {
      this.data.checkData['machine'] = '多机位'
    }
    // this.setData({
    //   price: newprice,
    //   payname: newpayname
    // })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    
    // 当前时间
    var myDate = new Date();//获取系统当前时间
    var year = myDate.getFullYear()
    var month = myDate.getMonth() + 1
    var day = myDate.getDate()
    var datas = year + '-' + month + '-' + day
    this.setData({
      dates: datas
    })

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //支付
  listenerLogin3: function () {
    //app.globalData.openid,
    var that = this
    wx.request({
      url: 'https://www.miyuanlive.com/home/wxplay',
      data: {
        openid: app.globalData.openid
      },
      success: function (res) {
        that.pay(res.data)
      }
    })

  },
  /*
调起微信支付 
@param 支付价格，不填写默认为1分钱
*/
  listenerLogin8: function () {

    var total_fee = 1;
    //code 用于获取openID的条件之一
    wx.request({
      url: 'https://www.miyuanlive.com/home/wxpay',
      method: "POST",
      data: {
        total_fee: total_fee,
        openid: app.globalData.openid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {  //后端返回的数据
        console.log(res);
        var data = res.data;
        console.log(data);
        
        var timeStampS = String(data['timeStamp']);
        if (data['state'] == 200){
          wx.requestPayment({
            timeStamp: timeStampS,
            nonceStr: data['nonceStr'],
            package: data['package'],
            signType: data['signType'],
            paySign: data['paySign'],
            success: function (res) {
              console.log('支付成功:');
              console.log(res);
              wx.showModal({
                title: '支付成功',
                content: '',
              })
            },
            fail: function (res) {
              console.log('支付失败:');
              console.log(res);
            }
          })
        } else {
          console.log('请求支付失败');
        }
        
      }
    });

  }
})