Page({
  /**
   * 初始化数据
   */
  data: {
    phone: '',
    password: '',
    price: '0',
    payname:'预 约',
    
    dates: '2018-01-08',
  },

  /**
   * 监听手机号输入
   */
  listenerPhoneInput: function (e) {
    this.data.phone = e.detail.value;

  },

  /**
   * 监听密码输入
   */
  listenerPasswordInput: function (e) {
    this.data.password = e.detail.value;
  },

  /**
   * 监听登录按钮
   */
  listenerLogin: function () {
    //打印收入账号和密码
    console.log('手机号为: ', this.data.phone);
    console.log('密码为: ', this.data.password);
  },

  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      dates: e.detail.value
    })
  },
  // 机位选择 1 单机位 ,2 双机位 ,3 多机位
  radioChange: function (e) {
    //console.log(e.detail.value)
    var that = this
    var newprice = that.data.price
    var newpayname = '预 约'
    if (e.detail.value == 1){
      newprice = '3500'
      newpayname = '支付3500元'
    } else if (e.detail.value == 2) {
      newprice = '5000'
      newpayname = '支付5000元'
    }
    //console.log(newprice)
    //console.log(newpayname)
    this.setData({
      price: newprice,
      payname: newpayname
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    
    // 当前时间
    var myDate = new Date();//获取系统当前时间
    var year = myDate.getFullYear()
    var month = myDate.getMonth() + 1
    var day = myDate.getDate()
    var datas = year + '-' + month + '-' + day
    this.setData({
      dates: datas
    })

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
  }
})