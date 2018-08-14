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

    // 当前人信息
    that.data.userStatus['id'] = e.id;
    that.data.userStatus['userId'] = e.userId;
    that.data.userStatus['state'] = e.state;

    // 回复人信息
    that.data.userStatus['hf_nickname'] = e.hf_nickname;
    that.data.userStatus['hf_userId'] = e.hf_userId;
    console.debug(e)
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

      // 执行REQUEST写入数据库
      wx.request({
        url: app.requestUrl,
        data: 
        {
          flag: 'addPl' ,
          content:e.detail.value.content,
          nickname:that.data.userInfo.nickName,
          userId:that.data.userStatus.userId,
          id:that.data.userStatus.id,
          flagc:that.data.userStatus.state,
          hf_userId:that.data.userStatus.hf_userId,
          hf_nickname:that.data.userStatus.hf_nickname
        },
        header: 
        {
           'content-type': 'application/x-www-form-urlencoded',
        },
        method:'POST',
        success: function(lb) 
        {

          wx.redirectTo({
            url: '../../pages/main/main?userId=' + app.userId +'&state=0'
            //url: '../../pages/main/main?userId='+that.data.userStatus.userId+'&address='+that.data.userStatus.address+'&name='+that.data.userStatus.name+'&lat='+that.data.userStatus.lat+'&lnt='+that.data.userStatus['lnt'] 
          });
          // console.log(lb.data)
          // return
          // if(lb.data.status)
          // {
          //     wx.showModal({
          //     content: lb.data.text,
          //     showCancel:false,
          //     success: function(res) 
          //     {
          //       if (res.confirm) 
          //       {
          //           wx.redirectTo({
          //             url: '../../pages/main/main?userId=' + app.userId +'&state=0'
          //             //url: '../../pages/main/main?userId='+that.data.userStatus.userId+'&address='+that.data.userStatus.address+'&name='+that.data.userStatus.name+'&lat='+that.data.userStatus.lat+'&lnt='+that.data.userStatus['lnt'] 
          //           });
          //       }
          //     }
          //   });
          // }
          // else
          // {
          //   wx.showModal({
          //     content: lb.data.text,
          //     showCancel:false,
          //     success: function(res) {
          //       if (res.confirm) 
          //       {
          //         //console.log('用户点击确定');
          //       }
          //     }
          //   });
          // }
        },
        fail: function(lb)
        {
          console.log(lb)
        }
      })
    }
  }


// 结束
})







 