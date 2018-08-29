//app.js
var baseUrl = 'https://www.miyuanlive.com/home/'
App({
  onLaunch: function () 
  {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  // getUserInfo:function(cb){
    // var that = this
    // if(this.globalData.userInfo){
    // //   typeof cb == "function" && cb(this.globalData.userInfo)
    // // }else{
    //   //调用登录接口
    //   console.log('开始登录');
    //   wx.login({
    //     success: function (lb) {
    //       console.log(lb.code);
    //       console.log(that.requestLoginUrl);
    //       // 拿到code后请求服务器获取身份标识写入缓存
    //       wx.request({
    //         url: that.requestLoginUrl,
    //         data: 
    //         {
    //           flag: 'code' ,
    //           code: lb.code
    //         },
    //         header: 
    //         {
    //             'content-type': 'application/x-www-form-urlencoded',
    //         },
    //         method:'POST',
    //         success: function(lb) 
    //         {
    //           console.log(lb.data)
    //           that.globalData.userId = lb.data.userid
    //         },
    //         fail: function(lb)
    //         {
    //           console.log(lb)
    //         }
    //       })

    //       // 用户OBJ写入全局对象
    //       wx.getUserInfo({
    //         success: function (res) {
    //           that.globalData.userInfo = res.userInfo
    //           typeof cb == "function" && cb(that.globalData.userInfo)
    //         }
    //       })
    //     }
    //   })
    // }
  // },
  
  globalData:{
    openid: null,
    session_key: null,
    userInfo:null
    // userInfo: {openId:'1',nickName:'波波'}
  },
  requestLoginUrl: baseUrl + 'userlogin',
  requestregisterUrl: baseUrl + 'register',
  requestUserinfoUrl: baseUrl+'modifyuserinfo',
  requestUrl: baseUrl +'momentlist',
  requestuserinfoUrl: baseUrl + 'userinfo',
  requestAddMomentUrl: baseUrl + 'addMoment',
  requestUploadImgUrl: baseUrl + 'uploadimage',
  requestDelMomentUrl: baseUrl + 'delemoment',
  requestDetailMomentUrl: baseUrl + 'momentdetail',
  requestAddCommentUrl: baseUrl + 'addComment',
  requestliveUrl: baseUrl +'livelist',
  requestBannerUrl: baseUrl +'banner',
  requestcouponUrl: baseUrl +'couponlist',
  requestgetcouponUrl: baseUrl +'getcoupon',
  requestusercouponlisturl: baseUrl +'usercouponlist',
  requestaddLikeUrl: baseUrl + 'addLike',
  requestlivebookingUrl: baseUrl + 'livebooking',
  requestcertyphotomanUrl: baseUrl + 'certyphotoman',
  requestuserlivebookUrl: baseUrl + 'userlivebooklist',
  requestcertyphotomanInfoUrl: baseUrl + 'certyphotomanInfo',
  userId:null,
  // http://47.52.142.116/friend/pengyuquan.php
})

//多张图片上传
function uploadimg(data) {
  var that = this,
    i = data.i ? data.i : 0,//当前上传的哪张图片
    success = data.success ? data.success : 0,//上传成功的个数
    fail = data.fail ? data.fail : 0;//上传失败的个数
  wx.uploadFile({
    url: data.url,
    filePath: data.path[i],
    name: 'file',//这里根据自己的实际情况改
    formData: {
      content: data.content,
      address:data.address
    },//这里是上传图片时一起上传的数据
    success: (resp) => {
      success++;//图片上传成功，图片上传成功的变量+1
      console.log(resp)
      console.log(i);
      //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
    },
    fail: (res) => {
      fail++;//图片上传失败，图片上传失败的变量+1
      console.log('fail:' + i + "fail:" + fail);
    },
    complete: () => {
      console.log(i);
      i++;//这个图片执行完上传后，开始上传下一张
      if (i == data.path.length) {   //当图片传完时，停止调用          
        console.log('执行完毕');
        console.log('成功：' + success + " 失败：" + fail);
      } else {//若图片还没有传完，则继续调用函数
        console.log(i);
        data.i = i;
        data.success = success;
        data.fail = fail;
        that.uploadimg(data);
      }

    }
  });
}