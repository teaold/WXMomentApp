//index.js
//获取应用实例
var app = getApp()
var imgArr = []; //这个数组用来临时存储图片数据
Page({
  data: {
    userInfo: {},
    addressData: null,
    userStatus: {},
    addRessName: false,
    content: false,
    imgStr: null,
    httpImg: [],
    latitude: '',
    chooseImageUrl: [], //绑定到页面的数据
    imgCount: 0, //图片的张数
    imgLenght: 0
  },
  onLoad: function(e) {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })

    that.data.userStatus['name'] = e.name;
    that.data.userStatus['address'] = e.address;
    that.data.userStatus['lat'] = e.lat;
    that.data.userStatus['lnt'] = e.lnt;
    that.data.userStatus['userId'] = e.userId;

    // console.log(event);
  },

  // 表单提交
  formSubmit: function(e) {
    var that = this
    // 如果文本为空提示用户输入 否则提交表单
    if (e.detail.value.content == '' && that.data.imgStr == null) {
      this.showMessage('请输入内容或选择图片！')
    } else {
      if (that.data.addressData == null) {
        that.data.addressData = that.data.userStatus
      }

      //console.log('地点:' + that.data.addressData.address + '内容:' + e.detail.value.content)

      var url1 = app.requestAddMomentUrl;
      wx.showLoading({
        title: '提交中...',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
      wx.request({
        url: url1,
        data: {
          //userId: that.data.appid,
          user_id: '1',
          text_box: e.detail.value.content,
          address: that.data.addressData.address
        },
        //POST请求要添加下面的header设置
        // method: 'POST',
        // header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {

          that.setData({
            hidden: true
          });
          wx.hideLoading()
          wx.showToast({
            title: res.data['msg'],
          })
          if (res.data['code'] == '0') {
            var pages = getCurrentPages();
            if (pages.length > 1) {
              //上一个页面实例对象
              var prePage = pages[pages.length - 2];
              //关键在这里
              prePage.onReloadPage()
            } 
            setTimeout(function () {
              wx.navigateBack();
            }, 2000)
            
          }
        },
        fail: function (res) {
          wx.hideLoading()
          wx.showToast({
            title: '网络错误,请稍后再试',
          })

        }

      });

    }
  },
  // 清除
  formReset: function() {
    console.log('form发生了reset事件')
  },

  // 选择地理位置
  bindAddress: function() {
    var that = this

    // 取消选择地理位置后获取当前人经纬度调用后台接口接收当前地理位置
    wx.chooseLocation({
      success: function(lb) {
        //console.log(lb)
        that.data.addressData = lb
        that.setData({
          addRessName: lb.name
        })
        //console.debug(that.data.addressData)  
      },
      cancel: function(lb) // 取消选择
      {
        //that.data.addressData = that.data.userStatus
      },
      fail: function(lb) {
        console.log(lb)
      }
    })
  },

  // 相册
  chooseImage: function() {

    var that = this

    var attach = []
    //wx.chooseImage 不多介绍看文档
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      sizeType: ['original'],
      count: 9,
      success: function(res) {

        var tempFilePaths = res.tempFilePaths;
        var len = that.data.imgCount + tempFilePaths.length
        //len 是此时已有的张数和本次上传的张数的和，也就是本次操作完成页面应该有的张数，因为用户可能会多次选择图片，所以每一次的都要记录下来。

        if (len > 9) {

          wx.showToast({
            title: '最大数量为9',
            icon: 'loading',
            duration: 1000
          })
          //超过结束
          return false
        }
        for (var i = 0; i < tempFilePaths.length; i++) {
          //将api 返回的图片数组push进一开始的imgArr，一定要循环一个个添加，因为用户上传多张图直接push就会多个路径在imgArr的同一个元素里。报错
          imgArr.push(tempFilePaths[i]);
        }
        //将此时的图片长度和存放路径的数组加到要渲染的数据中
        that.setData({
          imgCount: len,
          chooseImageUrl: imgArr
        })



      }

    })
  },
  previewImage: function(e) // 显示图片大图
  {
    var current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  bindLoding: function() { // LOADING加载
    wx.showToast({
      title: '图片上传中',
      icon: 'loading'
    })
  },
  //点关闭按键
  Close: function(e) {
    var mylen = this.data.chooseImageUrl.length; //当前渲染的数组长度

    var myindex = e.currentTarget.dataset.index; //当前点击的是第几张图片 data-index
    imgArr.splice(myindex, 1) //将这张图充存放图片的数组中删除

    this.setData({
      imgCount: mylen - 1, //长度减一
      chooseImageUrl: imgArr //将删除图片后的数组赋给要渲染的数组
    })
  }

  // 结束
})