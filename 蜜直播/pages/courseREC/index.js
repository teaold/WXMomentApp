
var app = getApp()
Page({
  /**
   * 初始化数据
   */
  data: {
    checkData: {},
    bookdata: '',
    payname: '预 约',
    errormsg: '',
    showTopTips: false,
  },

  listenerPhoneInput: function (e) {
    this.data.checkData['phone'] = e.detail.value;
  },
  listenerNameInput: function (e) {
    this.data.checkData['name'] = e.detail.value;
  },
  listenerTimeInput: function (e) {
    this.data.checkData['rectime'] = e.detail.value;
  },
  sexChange: function (e) {// 性别
    this.data.checkData['sexArr'] = e.detail.value;
  },
  listenerDetailUnitInput: function (e) {// 单位
    this.data.checkData['unit'] = e.detail.value;
  },
  /**
   * 监听登录按钮
   */
  formSubmit: function (e) {
  // listenerLogin: function () {
    var that = this;
    // console.log(specialStr)
    var sendData = this.data.checkData
    var telRule = /^1[2-9]\d{9}$/, nameRule = /^[\u2E80-\u9FFF]+$/
    if (sendData['unit'] == undefined || sendData['unit'] == '') {
      that.showTopTips('请输入单位名称')
    } else if (sendData['name'] == undefined || sendData['name'] == '') {
      that.showTopTips('请输入联系人')
    } else if (sendData['phone'] == undefined || sendData['phone'] == '') {
      that.showTopTips('请输入联系电话')
    } else if (!telRule.test(sendData['phone'])) {
      that.showTopTips('手机号码格式不正确')
    } else if (sendData['rectime'] == undefined || sendData['rectime'] == '') {
      that.showTopTips('请输入录制时间')
    }   else  {
      
      var formID = e.detail.formId;
      //模板信息
      sendData['form_id'] = formID;
      sendData['keyword1'] = " 录课预约";
      sendData['keyword2'] = sendData['name'] + '提交了预约申请,请尽快处理哦!'
      sendData['keyword3'] = '单位:' + sendData['unit'];

      sendData['user_id'] = app.globalData.openid;
      sendData['type'] = 'course';

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
            bookdata: sendData
          })
          wx.hideLoading();
          //发送模板信息
          that.submitTemplateMsg();
          that.msgShowPage(true);//成功
        },
        fail: function (res) {
          wx.hideLoading()
          that.msgShowPage(false);//支付失败
          
        },

        complete: function (res) {
          wx.hideLoading()
        }

      });
    }
  },
  /**
   * 更新支付状态, 同时发送模板信息
   */
  submitTemplateMsg: function () {
    var send_data = this.data.bookdata;
    var url1 = app.sendtemplatemessageUrl;
    wx.request({
      url: url1,
      data: send_data,
      //POST请求要添加下面的header设置
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
      },
      fail: function (res) {
      },
      complete: function (res) {

      }
    });

  },
  msgShowPage: function (state) {
    if (state == true) {
      wx.redirectTo({
        url: '../../pages/msgsuccess/msgsuccess',
      })
    } else {
      wx.redirectTo({
        url: '../../pages/msgsuccess/msg_fail',
      })
    }

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    
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
  
  showTopTips: function (e) {
    var that = this;
    this.setData({
      showTopTips: true,
      errormsg: e
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false,
        errormsg: ''
      });
    }, 3000);
  }
  // 城市 - end
})