Page({

  data: {
    statemsg: '操作失败',

  },
  homeback: function (e) {
    wx.switchTab({
      url: '../../pages/index/index'
    })
  },
});