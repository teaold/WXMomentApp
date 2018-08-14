//index.js
//获取应用实例
var app = getApp()
Page({
  data: 
  {
    userInfo: {}, // 存放用户信息
    resultData:[], // 存放数据
    userStatus:{}, // 存放地理位置
    scrolltop:20, // 滚动轴TOP
    page:1, // 页码值
    cz_flag:false, // 控制点赞评论按钮
    cz_right:0, // 点赞评论定位right
    cz_top:80, // 点赞评论定位top
    dz_id:null, // 点赞评论ID
    animationData: {},
    animationData1: {}, // 发布按钮下滑动画
    animationData2: {} // 位置按钮下滑动画
  },
  // 初始方法
  onLoad: function (e) 
  {

    // 修改标题
    wx.setNavigationBarTitle({
      title: '当前地区：' + e.address
    })


    // 根据不同参数执行不同的操作
    var that = this
    that.data.userStatus['state'] = e.state;
    //console.debug(e.state)
    // 上一个页面传过来的用户信息参数赋值
    that.data.userStatus['name'] = e.name;
    that.data.userStatus['address'] = e.address;
    that.data.userStatus['userId'] = e.userId;

    that.bindLoding()
    that.onloadRequest(0)
    

    var dataTop = {'detail':{'scrollTop':0}}
    that.scrollHandle(dataTop)

    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //console.log(userInfo)
      //更新数据
      that.setData({
        userInfo:userInfo,
      })
    })
  },

  onloadRequest: function(e,page)
  {
    page = page == undefined?0:page
    //console.debug(e+"---"+page)
    var that = this
    // 0是下滑刷新
    if(e == 0)
    {
         // 执行REQUEST请求相应的数据
         wx.request({
            url: app.requestUrl, 
            data: {
              flag:'pageData',
              data:that.data.userStatus,
              state:1,
              page:page,
              name: that.data.userStatus.name,
              address: that.data.userStatus.address
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            method:'POST',
            success: function(res) 
            {
              console.log(res.data)
              // return;
              // 如果没有数据直接返回首页 有数据则展示
              if(res.data.length)
              {
                  wx.hideToast()
                  wx.stopPullDownRefresh()
                  that.setData({
                    resultData:res.data
                  })
                  
              }          
            },
            fail: function(res)
            {
              console.log(res)
            }
        })
    }
    else if(e == 1)
    {
      // 执行REQUEST请求相应的数据
         wx.request({
            url: app.requestUrl, 
            data: {
              flag:'pageData',
              data:that.data.userStatus,
              state:1,
              page:page,
              name: that.data.userStatus.name,
              address: that.data.userStatus.address
            },
            header: {
                //'Content-Type': 'application/json',
                'content-type': 'application/x-www-form-urlencoded',
            },
            method:'POST',
            success: function(res) 
            {
              // console.log(res.data)
              // console.log(res.data.length)
              // return;
              // 如果没有数据直接返回首页 有数据则展示
              if(res.data.length)
              {
                  wx.hideToast()
                  wx.stopPullDownRefresh()
                  for(var ii = 0; ii < res.data.length;ii++)
                  {
                    that.data.resultData.push(res.data[ii])
                  }
                 // console.log(that.data.resultData)
                  that.setData({
                    resultData:that.data.resultData
                  })
              }
              // else
              // {
              //     wx.showModal({
              //     content: '评论已经加载完了',
              //     showCancel:false
              //   })
              // }          
            },
            fail: function(res)
            {
              console.log(res)
            }
        })
    }  
  },
  bindLoding:function(){ // LOADING加载
     wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
  },
  onPullDownRefresh:function(){ //下拉刷新
    var that = this
    that.bindLoding()
    that.onloadRequest(0)
    that.setData({
      page:1,
      resultData:[]
    })
    
  },
  scrollHandle:function(e){ //滚动事件
    console.log(e.detail.scrollTop)
    var anum = e.detail.scrollTop <= 20?20:e.detail.scrollTop
    var that = this
    that.donghua(anum)
  },
  donghua: function(topNum) // 发布按钮动画
  {
    var that = this
    // 动画1
    var animation = wx.createAnimation({
        duration: 400,
        timingFunction: 'linear',
        delay:0,
    })

    var animation1 = wx.createAnimation({
        duration: 400,
        timingFunction: 'linear',
        delay:0,
    })

    animation.opacity(0).translateY(topNum + 5).step()
    animation1.opacity(0).translateY(topNum + 5).step()

    that.setData({
      animationData1:animation.export(),
      animationData2:animation1.export()
    })

    setTimeout(function(){
      animation.opacity(1).step()
      animation1.opacity(1).step()

      that.setData({
        animationData1:animation.export(),
        animationData2:animation1.export()
      })
    },1500)


    // this.setData({
    //   animationData1:animation.export(),
    //   animationData2:animation1.export()
    // })

    
    
    // animation.translateY(topNum).step().opacity(1).step()
    // animation1.translateY(topNum).opacity(1).step()

    

    
  },
  scrollLoading:function(){ //滚动加载
      var that = this
      //console.log(that.data.page)
      that.setData({
          page:that.data.page + 1
      })
      that.bindLoding()
      that.onloadRequest(1,that.data.page)
      that.setData({
        scrolltop: that.data.scrolltop
      })
  },
  bindDele: function(event){ //删除评论
    var that = this
    // 弹出提示让用户确认是否删除
    wx.showModal({
      content: '您确定要删除当前评论吗, 删除后将无法恢复!',
      success: function(res) 
      {
        if (res.confirm) 
        {
            // 执行REQUEST 删除当前记录
            wx.request({
                url: app.requestUrl,
                data: {
                  flag:'dele',
                  openid:event.target.dataset.deleuserid,
                  deleid:event.target.dataset.deleid
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
                method:'POST',
                success: function(res) 
                {
                  console.log(res.data);
                  if(res.data)
                  {
                    // 循环当前所有评论元素 找到当前用户选择的 并进行删除
                    for(var i=0; i<that.data.resultData.length; i++)
                    {
                      if(that.data.resultData[i].id == event.target.dataset.deleid)
                      {
                        // 删除当前用户已选择的元素
                        that.data.resultData.splice(i,1);
                      }
                      //console.log(that.data.resultData[i].id);
                    }

                    // 构成新对象并且展示
                    that.setData({
                      resultData:that.data.resultData
                    })
                  }
                },
                fail: function(res)
                {
                  console.error(res);
                },
                complete:function(res)
                {
                  console.debug(res)
                }
          })
        }
      }
    })
  },
  bindAdd: function(){// 跳转朋友圈
    var that = this
    // 用户朋友圈输入
    wx.showActionSheet({
      itemList: ['发布'],
      success: function(res) 
      {
        if (!res.cancel) 
        {
          console.log(res.tapIndex)

          if(res.tapIndex == 0)
          {
            wx.redirectTo({
              url: '../../pages/addComment/addComment?userId='+that.data.userStatus.userId+'&address='+that.data.userStatus.address+'&name='+that.data.userStatus.name+'&lat='+that.data.userStatus.lat+'&lnt='+that.data.userStatus['lnt'] 
            })
          }    
        }
      }
    })
  },
  previewImage: function (e){ // 展示图片
    var current = e.target.dataset.src
    var count = e.target.dataset.count.split(",")

    wx.previewImage({
      current: current,
      urls: count
    })
  },
  locationWb:function(){ //选择地理位置跳转进入微博友圈
  
    wx.redirectTo({
      url: '../../pages/address/address'
    })

  },
  bindCaoZuo: function(e){  //评论点赞
    var that = this
    var userId = app.userId
    var dz_id = e.currentTarget.dataset.id
    // 获取当前节点的偏移TOP值计算当前点赞操作的位置
    var offsetTop = Math.floor(e.currentTarget.offsetTop) 
    // 赋值计算好的TOP值显示按钮
    that.setData({
      dz_id:dz_id,
      cz_top:offsetTop,
      cz_flag:true
    })

    // 动画
    var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'linear',
        delay:0,
    })

    // 0.3秒后滑动
    setTimeout(function(){
       animation.right(40).opacity(1).step()
        that.setData({
          animationData:animation.export()
        })
    },300)

    // 5秒后自动隐藏按钮
    var timeout = setTimeout(function(){
      animation.right(0).opacity(0).step()
        that.setData({
          animationData:animation.export()
        })
    },5000)
    
  },

  bindDianZan: function() // 处理点赞
  {
      var that = this
      var userId = app.userId
      var dz_id = that.data.dz_id

      wx.request({
        url: app.requestUrl,
        data: 
        {
          flag:'addDZ',
          userId:userId,
          id: dz_id,
          nickname: that.data.userInfo.nickName
        },
        header: 
        {
            'content-type': 'application/x-www-form-urlencoded',
        },
        method:'POST',
        success: function(res) 
        {
          console.log(res.data.status)
          // 1是点赞 2是取消点赞
          if(res.data.status == 1)
          {
            // 循环当前节点找到点赞ID对应的节点
            for(var ii=0; ii<that.data.resultData.length;ii++)
            {
                if(that.data.resultData[ii].id == dz_id)
                {
                  // 如果当前数组下dianzan为null证明还没有人点赞则直接添加 否则添加当前人昵称+之前人的点赞
                  if(that.data.resultData[ii]['dianzan'] == 'null')
                  {
                    that.data.resultData[ii]['dianzan'] = that.data.userInfo.nickName
                  }
                  else
                  {
                    that.data.resultData[ii]['dianzan'] = that.data.userInfo.nickName + "," + that.data.resultData[ii]['dianzan']
                  }
                  break
                }
            }
          }
          else if(res.data.status == 2)
          {
            // 循环当前节点找到点赞ID对应的节点
            for(var ii=0; ii<that.data.resultData.length;ii++)
            {
              if(that.data.resultData[ii].id == dz_id)
              {
                // 当前点赞列表拆分数组
                var dzArr = that.data.resultData[ii]['dianzan'].split(",")
                // 计算当前数组的长度 如果长度小于2则赋值为null 否则删除当前元素后返回新的数组
                if(dzArr.length < 2)
                {
                  that.data.resultData[ii]['dianzan'] = 'null'
                }
                else
                {
                  // 循环数组删除当前点赞的昵称
                  for(var dz=0; dz<dzArr.length;dz++)
                  {
                    if(dzArr[dz] == that.data.userInfo.nickName)
                    {
                      dzArr.splice(dz,1)
                      break
                    }
                  }

                  that.data.resultData[ii]['dianzan'] = dzArr.join(",")
                }
                break
              }
            }
          }
          // 重置数据
          that.setData({
            resultData:that.data.resultData,
            cz_flag:false
          })

        },
        fail: function(lb)
        {
          console.log(lb)
        }
    })
  },
  bindPingLunA: function() // 处理评论
  {
      var that = this
      var userId = app.userIdd
      var dz_id = that.data.dz_id
      wx.redirectTo({
        url: '../addPingLun/addPingLun?id='+dz_id+'&userId='+userId+'&state=0'
      })
  },
  bindPingLunB: function(e){ // 处理已有评论的回复
    var userId = app.userId
    var id = e.currentTarget.dataset.id
    var pl_id = e.currentTarget.dataset.pl_id
    var hf_nickname = e.currentTarget.dataset.pl_nickname
    var hf_userid = e.currentTarget.dataset.pl_userid

    wx.redirectTo({
      url: '../addPingLun/addPingLun?id='+id+'&userId='+userId+'&hf_userId='+hf_userid+'&hf_nickname='+hf_nickname+'&state=1'
    })
  },


})

  
 




