//index.js
//获取应用实例
var app = getApp()
Page({
  data: 
  {
    userInfo: {},
    userStatus:{}
  },
  onLoad: function (e) 
  {
      var that = this
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function(userInfo){
        //更新数据
        that.setData({
          userInfo:userInfo
        })
      })
    //动态id
    that.data.userStatus['id'] = e.id;
    
    //状态
    that.data.userStatus['state'] = e.state;
    if (e.state > 0) {
      // 回复人信息
      // 当前人信息
      that.data.userStatus['userId'] = e.userId;
      that.data.userStatus['nickname'] = e.nickname;
    } else {
      that.data.userStatus['nickname'] = '0';
      that.data.userStatus['userId'] = '0';
    }
    
    // console.log(that.data.userStatus)
     // console.log(event);
  },

  // 表单提交
  formSubmit:function(e)
  {
    var that = this

    // 如果文本为空提示用户输入 否则提交表单
    if(e.detail.value.content == '')
    {
       wx.showModal({
            content: '请填写内容后点击提交保存！',
            showCancel:false,
            success: function(res) 
            {
              if (res.confirm) 
              {
                //console.log('用户点击确定');
              }
            }
          });
    }
    else
    {
      var url1 = app.requestAddCommentUrl;
      wx.showLoading({
        title: '提交中...',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
      wx.request({
        url: url1,
        data: {
          state: that.data.userStatus.state,
          moment_id: that.data.userStatus.id,
          reply_id: '1',
          reply_name: app.globalData.userInfo.nickName,
          comment: e.detail.value.content,
          replyed_id: that.data.userStatus.userId,
          replyed_name: that.data.userStatus.nickname
        },
        //POST请求要添加下面的header设置
        // method: 'POST',
        // header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {

          that.setData({
            hidden: true
          });
          wx.hideLoading()
          console.log(res)
          wx.showToast({
            title: res.data['msg'],
          });
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
            }, 1000)

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
  }


// 结束
})







 