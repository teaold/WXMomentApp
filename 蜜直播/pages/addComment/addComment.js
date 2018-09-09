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
    content: '',
    imgStr: null,
    httpImg: [],
    latitude: '',
    chooseImageUrl: [], //绑定到页面的数据
    imgCount: 0, //图片的张数
    imgLenght: 0,
    chooseImagehid:false,
    uploadimgindex:0,//当前上传第几张
    uploadimgnameArr: [] //上传图片文件名称
  },
  onLoad: function(e) {
    var that = this
    //调用应用实例的方法获取全局数据
    that.setData({
      userInfo: app.globalData.userInfo
    })

    that.data.userStatus['name'] = e.name;
    that.data.userStatus['address'] = e.address;
    that.data.userStatus['lat'] = e.lat;
    that.data.userStatus['lnt'] = e.lnt;
    that.data.userStatus['userId'] = e.userId;


    console.log(imgArr);
    imgArr = [];
  },
  formSubmit: function (e) {//这里触发图片上传的方法
    var tempc = e.detail.value.content;
    
    var that = this
    var pics = this.data.chooseImageUrl;
    
    // that.data.uploadimgnameArr = {};
    wx.showLoading({
      title: '提交中...',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)

    wx.uploadFile({
      url: app.requestUploadImgUrl, 
      filePath: pics[that.data.uploadimgindex],
      name: 'file',
      formData: {
      },
      //POST请求要添加下面的header设置
      // method: 'POST',
      // header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log(res)
        console.log(res.data)
        var obj = JSON.parse(res.data);
        if (obj.code == 0) {
          that.data.uploadimgnameArr.push(obj['imgname']);
          console.log(that.data.uploadimgnameArr)
        } else {
          console.log('失败')
          console.log(obj['msg'])
        }
        
      },
      fail: (res) => {
        // that.data.uploadimgnameArr[uploadimgindex] = 'fail';
        console.log(res)
        // console.log(that.data.uploadimgnameArr)
      },
      complete: () => {
        var uploadTempindex = that.data.uploadimgindex + 1;
        that.setData({
          uploadimgindex: uploadTempindex
        })
        if (that.data.uploadimgindex >= pics.length) {
          console.log('上传完成')
          that.data.uploadimgindex = 0;
          that.formSubmit2(e);
        } else {
          that.formSubmit(e);
        }
      }
    })

  },

  // 表单提交
  formSubmit2: function(e) {
    var that = this
    // 如果文本为空提示用户输入 否则提交表单
    if (e.detail.value.content == '' && that.data.imgCount == 0) {
      this.showMessage('请输入内容或选择图片！')
    } else {
      if (that.data.addRessName) {
        that.data.userStatus['address'] = that.data.addRessName;
      } else {
        that.data.userStatus['address'] = '0';
      }

      var imageurls = ''
      for (var i = 0; i < that.data.uploadimgnameArr.length; i++) {
        if (imageurls != ''){
          imageurls = imageurls + ','
        }
        imageurls = imageurls + that.data.uploadimgnameArr[i]
      }
      console.log(imageurls)
      var url1 = app.requestAddMomentUrl;
      
      wx.request({
        url: url1,
        data: {
          //userId: that.data.appid,
          user_id: app.globalData.openid,
          text_box: e.detail.value.content,
          urls: imageurls,
          address: that.data.userStatus['address']
        },
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
  // 输入内容
  listenercontent: function (e) {
    var tempc = e.detail.value;

    if (tempc.length > 10){
      tempc = tempc.substring(0, 9)
    }
    console.log(tempc)
    that.setData({
      content: tempc
    })
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
  chooseImage: function(e) {
    
    var that = this

    var attach = []
    //wx.chooseImage 不多介绍看文档
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],//压缩图
      count: 6 - that.data.imgCount,
      success: function(res) {

        var tempFilePaths = res.tempFilePaths;
        var len = that.data.imgCount + tempFilePaths.length
        //len 是此时已有的张数和本次上传的张数的和，也就是本次操作完成页面应该有的张数，因为用户可能会多次选择图片，所以每一次的都要记录下来。
        
        for (var i = 0; i < tempFilePaths.length; i++) {
          //将api 返回的图片数组push进一开始的imgArr，一定要循环一个个添加，因为用户上传多张图直接push就会多个路径在imgArr的同一个元素里。报错
          imgArr.push(tempFilePaths[i]);
        }
        var addImagehid = false
        if (len >= 6) {
          addImagehid = true
        }
        //将此时的图片长度和存放路径的数组加到要渲染的数据中
        that.setData({
          imgCount: len,
          chooseImageUrl: imgArr,
          chooseImagehid: addImagehid
        })

      }
    })
  },
  // previewImage: function (e) {
  //   wx.previewImage({
  //     current: e.currentTarget.id, // 当前显示图片的http链接
  //     urls: this.data.files // 需要预览的图片http链接列表
  //   })
  // },
  previewImage: function(e) // 显示图片大图
  {
    var current = e.target.dataset.index
    console.log(current)
    console.log(imgArr[current])
    if (current != undefined){
      wx.previewImage({
        current: imgArr[current],
        urls: imgArr
      })
    }
    
  },
  bindLoding: function() { // LOADING加载
    wx.showToast({
      title: '图片上传中',
      icon: 'loading'
    })
  },
  //点关闭按键
  deleteImg: function(e) {
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