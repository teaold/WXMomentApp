var area = require('../../data/area')
var p = 0, c = 0, d = 0
var app = getApp()
Page({
  /**
   * 初始化数据
   */
  data: {
    checkData: {},
    bookdata: '',
    payname: '预 约',

    dates: '2018-01-08',

    // 城市
    provinceName: [],
    provinceCode: [],
    provinceSelIndex: '',
    cityName: [],
    cityCode: [],
    citySelIndex: '',
    districtName: [],
    districtCode: [],
    districtSelIndex: '',
    showMessage: false,
    messageContent: '',
    showDistpicker: false
  },

  listenerPhoneInput: function (e) {
    this.data.checkData['phone'] = e.detail.value;
  },
  listenerNameInput: function (e) {
    this.data.checkData['name'] = e.detail.value;
  },
  sexChange: function (e) {// 性别
    this.data.checkData['sexArr'] = e.detail.value;
  },
  listenerDetailAddrInput: function (e) {// 详细地点
    this.data.checkData['street'] = e.detail.value;
  },
  /**
   * 监听登录按钮
   */
  formSubmit: function (e) {
  //listenerLogin: function () {
    this.data.checkData['street'] = "china";
    // console.log(specialStr)
    var sendData = this.data.checkData
    var telRule = /^1[2-9]\d{9}$/, nameRule = /^[\u2E80-\u9FFF]+$/
    if (sendData['name'] == undefined || sendData['name'] == '') {
      this.showMessage('请输入姓名')
    } else if (sendData['phone'] == undefined || sendData['phone'] == '') {
      this.showMessage('请输入手机号码')
    } else if (!telRule.test(sendData['phone'])) {
      this.showMessage('手机号码格式不正确')
    } 
    // else if (this.data.provinceSelIndex == '') {
    //   this.showMessage('请选择所在地区')
    // } 
    else if (sendData['street'] == undefined || sendData['street'] == '') {
      this.showMessage('请输入详细地址')
    } else {
      
      var pindex = this.data.provinceSelIndex;
      var cindex = this.data.citySelIndex;
      var dindex = this.data.districtSelIndex;
      var address = this.data.provinceName[pindex] + this.data.cityName[cindex] + this.data.districtName[dindex];

      sendData['address'] = '';

      //模板信息
      var formID = e.detail.formId;
      sendData['form_id'] = formID;
      sendData['keyword1'] = " 拍摄预约";
      sendData['keyword2'] = sendData['name'] + '提交了预约申请,请尽快处理哦!'
      sendData['keyword3'] = '联系电话:' + sendData['phone'];
      sendData['user_id'] = app.globalData.openid;
      sendData['type'] = 'photo';

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

          wx.hideLoading()
          if (res.data['code'] == '0') {
            that.setData({
              bookdata: sendData
            })
            //发送模板信息
            that.submitTemplateMsg();
            that.msgShowPage(true);//成功
          }
        },
        fail: function (res) {
          wx.hideLoading()
          that.msgShowPage(false);//失败

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
    var that = this
    // 设置城市
    this.setAreaData()
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
  // 选择城市 - start
  setAreaData: function (p, c, d) {
    var p = p || 0 // provinceSelIndex
    var c = c || 0 // citySelIndex
    var d = d || 0 // districtSelIndex
    // 设置省的数据
    var province = area['100000']
    var provinceName = [];
    var provinceCode = [];
    for (var item in province) {
      provinceName.push(province[item])
      provinceCode.push(item)
    }
    this.setData({
      provinceName: provinceName,
      provinceCode: provinceCode
    })
    // 设置市的数据
    var city = area[provinceCode[p]]
    var cityName = [];
    var cityCode = [];
    for (var item in city) {
      cityName.push(city[item])
      cityCode.push(item)
    }
    this.setData({
      cityName: cityName,
      cityCode: cityCode
    })
    // 设置区的数据
    var district = area[cityCode[c]]
    var districtName = [];
    var districtCode = [];
    for (var item in district) {
      districtName.push(district[item])
      districtCode.push(item)
    }
    this.setData({
      districtName: districtName,
      districtCode: districtCode
    })
  },
  changeArea: function (e) {
    p = e.detail.value[0]
    c = e.detail.value[1]
    d = e.detail.value[2]
    this.setAreaData(p, c, d)
  },
  showDistpicker: function () {
    this.setData({
      showDistpicker: true
    })
  },
  distpickerCancel: function () {
    this.setData({
      showDistpicker: false
    })
  },
  distpickerSure: function () {
    this.setData({
      provinceSelIndex: p,
      citySelIndex: c,
      districtSelIndex: d
    })
    this.distpickerCancel()
  },
  savePersonInfo: function (e) {
    var data = e.detail.value
    var telRule = /^1[3|4|5|7|8]\d{9}$/, nameRule = /^[\u2E80-\u9FFF]+$/
    if (data.name == '') {
      this.showMessage('请输入姓名')
    } else if (!nameRule.test(data.name)) {
      this.showMessage('请输入中文名')
    } else if (data.tel == '') {
      this.showMessage('请输入手机号码')
    } else if (!telRule.test(data.tel)) {
      this.showMessage('手机号码格式不正确')
    } else if (data.province == '') {
      this.showMessage('请选择所在地区')
    } else if (data.city == '') {
      this.showMessage('请选择所在地区')
    } else if (data.district == '') {
      this.showMessage('请选择所在地区')
    } else if (data.address == '') {
      this.showMessage('请输入详细地址')
    } else {
      this.showMessage(' 保存成功')
      console.log(data)
    }
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
  }

  // 城市 - end
})