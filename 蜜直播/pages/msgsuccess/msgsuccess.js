Page({

  data: {
    statemsg: '操作成功',
    
  },
  homeback: function (e) {
    wx.switchTab({
      url: '../../pages/index/index'
    })
  },
});