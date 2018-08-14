//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    defaultText:'请选择您要查看的省份',
    province:false,
    city:false,
    provinceArr:[],
    cityArr:[],
    getAddress:null,
    buttona:false
  },
  onLoad: function (e) 
  {
    var that = this
    // 执行REQUEST请求相应的数据
    wx.request({
      url: app.requestUrl, 
      data: {
        flag:'getAddress',
        state:0
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded',
      },
      method:'POST',
      success: function(res) 
      {
        that.setData({
          provinceArr:res.data,
          province:true
        })  

        console.debug(that.data.provinceArr)     
      },
      fail: function(res)
      {
        console.log(res)
      }
    })

  },
  bindProvince: function(e) //选择省份
  {
    // console.log(e.currentTarget.dataset.id)
    // console.log(e.currentTarget.dataset.province)
    var that = this
    var text = '您选择了'+e.currentTarget.dataset.province+'，请继续选择区域';

    // 执行REQUEST请求相应的数据
    wx.request({
      url: app.requestUrl, 
      data: {
        flag:'getAddress',
        state:1,
        pid:e.currentTarget.dataset.id
      },
      header: {
          'content-type': 'application/x-www-form-urlencoded',
      },
      method:'POST',
      success: function(res) 
      {
        //console.log(res.data)
        that.setData({
          defaultText:text,
          province:false,
          city:true,
          getAddress:e.currentTarget.dataset.province,
          cityArr:res.data
        })
      },
      fail: function(res)
      {
        console.log(res)
      }
    })
  },
  bindCity:function(e)
  {
    // console.log(e.currentTarget.dataset.id)
    // console.log(e.currentTarget.dataset.province)
    var that = this
    var text = '您选择了：'+ that.data.getAddress + e.currentTarget.dataset.city
    that.setData({
      defaultText:text,
      getAddress: that.data.getAddress + e.currentTarget.dataset.city,
      buttona:true
    })
  },
  bindAdd:function()
  {
    var that = this
    var userId = app.userId
    var address = that.data.getAddress
     wx.redirectTo({
        url: '../../pages/showAddress/showAddress?userId=' + userId +'&state=1' +'&name='+ address + '&address=' + address
     })
  }
})
 




