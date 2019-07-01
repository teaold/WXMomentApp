var area = require('../../data/area')
var p = 0, c = 0, d = 0
var app = getApp()
Page({
  /**
   * 初始化数据
   */
  data: {
    checkData: {},
    
    payname:'预 约',
    
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

  /**
   * 监听登录按钮
   */
  listenerLogin: function () {
    // console.log(specialStr)
    var sendData = this.data.checkData
    var telRule = /^1[2-9]\d{9}$/, nameRule = /^[\u2E80-\u9FFF]+$/
    if (sendData['name'] == undefined || sendData['name'] == '') {
      this.showMessage('请输入姓名')
    } else if (sendData['phone'] == undefined || sendData['phone'] == '') {
      this.showMessage('请输入手机号码')
    } else if (!telRule.test(sendData['phone'])) {
      this.showMessage('手机号码格式不正确')
    } else if (sendData['sexArr'] == undefined || sendData['sexArr'] == '') {
      this.showMessage('请选择性别')
    } else if (this.data.provinceSelIndex == '') {
      this.showMessage('请选择所在地区')
    } else {
      //性别
      var sexArr = sendData['sexArr']
      if (sexArr[0] == 1) {
        sendData['sex'] = '男'
      } else {
        sendData['sex'] = '女'
      }

      var pindex = this.data.provinceSelIndex;
      var cindex = this.data.citySelIndex;
      var dindex = this.data.districtSelIndex;
      var address = this.data.provinceName[pindex] + this.data.cityName[cindex] + this.data.districtName[dindex];

      sendData['address'] = address;
      sendData['user_id'] = app.globalData.openid;
      sendData['type'] = 'new';

      var that = this
      var url1 = app.requestcertyphotomanUrl;

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
          wx.showToast({
            title: res.data['msg'],
          })
          if (res.data['code'] == '0') {
            wx.redirectTo({
              url: '../../pages/msgsuccess/msgsuccess',
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
    }, 3000)
  }

  // 城市 - end
})