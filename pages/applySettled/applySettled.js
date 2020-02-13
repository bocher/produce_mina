// pages/applySettled/applySettled.js
var util = require('../../utils/util.js');
var shopApi = require('../../http/shopApi.js').default;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadUrl: 'http://47.106.130.46:8000/common/file/upload/qxkj-test/qxkj/test',
    isAccept: 0,
    step: 0,
    cardTime: '',
    addresseeData: {},
    shopInfo: {
      customerTypeArr: [],
      address: '', // 商户地址 ,
      auditStatus: '', // 审核状态 ,
      businessLicense: '', // 营业执照照片 ,
      cardBsPath: '', // 身份证半身照 ,
      cardEffectiveDate: '', // 有效日期 ,
      cardZmPath: '', // 身份证正面 ,
      cardFmPath: '', // 身份证反面 ,
      cardNumber: '', // 身份证号码 ,
      createName: '', // 创建人名称 ,
      createTime: '', // 创建时间 ,
      customerType: '', // 客户类型 ,
      customerType_name: '请选择', // 客户类型 ,
      desction: '', // 备注 ,
      headAddress: '', // 总店地址 ,
      headAddress_name: '', // 总店地址 ,
      id: '', // 主键 ,
      isorder: '', // 是否下单 ,
      mainproject: '', // 主营项目 ,
      merchantName: '', // 商户名称 ,
      personName: '', // 负责人名称 ,
      phone: '', // 手机号码 ,
      regionId: '', // 地区id ,
      shopSuperior: '', // 店铺上级 ,
      shopType: '', // 商户类型 ,
      type: '', // 店铺类型 ,
      updateName: '', // 修改人名称 ,
      updateTime: '', // 修改时间 ,
      userId: '', // 用户id ,
      validity: '' // 身份证期限
    }
  },
  // 同意选中协议
  checkDeal: function(e) {
    console.log(e);
    let isAccept = e.detail.value[0] ? e.detail.value[0] : 0;
    this.setData({
      isAccept: isAccept
    });
  },
  // 身份证期限
  changeTime: function(e) {
    let cardTime = this.data.cardTime;
    cardTime = e.detail.value;
    this.setData({
      cardTime: cardTime
    });
  },
  // 店铺信息--下一步按钮
  nextSubmit: function() {
    var shopInfo = this.data.shopInfo;
    shopInfo.validity = this.data.cardTime;
    if (!shopInfo.merchantName) {
      return wx.showToast({
        title: '请输入商户名称',
        icon: 'none',
        duration: 2000
      })
    } else if (!shopInfo.mainproject) {
      return wx.showToast({
        title: '请输入主营项目',
        icon: 'none',
        duration: 2000
      })
    } else if (!shopInfo.personName) {
      return wx.showToast({
        title: '请输入负责人名称',
        icon: 'none',
        duration: 2000
      })
    } else if (!shopInfo.cardNumber) {
      return wx.showToast({
        title: '请输入身份证',
        icon: 'none',
        duration: 2000
      })
    } else if (!shopInfo.validity) {
      return wx.showToast({
        title: '请选择身份证期限',
        icon: 'none',
        duration: 2000
      })
    } else if (!shopInfo.headAddress) {
      return wx.showToast({
        title: '请选择总店地址',
        icon: 'none',
        duration: 2000
      })
    } else if (!shopInfo.customerType) {
      return wx.showToast({
        title: '请选择客户类型',
        icon: 'none',
        duration: 2000
      })
    } else if (!this.data.isAccept) {
      return wx.showToast({
        title: '请阅读并勾选商家入驻协议',
        icon: 'none',
        duration: 2000
      })
    }
    this.setData({
      step: 1
    });
  },
  bindAndSet: function (e) {
    let key = e.currentTarget.dataset.key;
    let shopInfo = this.data.shopInfo;
    shopInfo[key] = e.detail.value;
    this.setData({
      shopInfo: shopInfo
    })
  },
  // 选择身份证期限
  selectCardDate: function() {

  },
  // 选择总店地址
  selectAddress: function() {
    var id = this.data.shopInfo.headAddress ? this.data.shopInfo.headAddress : '';
    wx.navigateTo({
      url: '/pages/shippingAddress/shippingAddress?isSelect=1&addressId=' + id,
    })
  },
  // 定时器
  timeInterval: function() {
    var shopInfo = this.data.shopInfo;
    shopInfo.sendFlag = false;
    var timer = setInterval(() => {
      shopInfo.time--;
      shopInfo.sendMsg = shopInfo.time + ' 秒后重新发送';
      if (shopInfo.time == 0) {
        clearInterval(timer);
        shopInfo.sendMsg = '重新发送';
        shopInfo.time = 10;
        shopInfo.sendFlag = true;
      }
      this.setData({
        shopInfo: shopInfo
      })
    }, 1000)
  },
  // 发送验证码
  sendEMS: function() {
    var shopInfo = this.data.shopInfo;
    if (!shopInfo.sendFlag) {
      return
    }
    this.timeInterval();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let sj_userId = wx.getStorageSync('sj_userId');
    let addresseeData = getApp().globalData.addresseeData;
    if (sj_userId) {
      let shopInfo = this.data.shopInfo;
      shopInfo.userId = sj_userId;
      shopInfo.headAddress = addresseeData.id;
      shopInfo.headAddress_name = addresseeData.addresses || '请选择';
      this.setData({
        shopInfo: shopInfo,
        addresseeData: addresseeData
      });
      this.getData();
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 返回上一页
  back: function() {
    wx.navigateBack({
      delta: 1
    })
  },

  // 获取数据
  getData: function() {
    this.getCustomerType();
  },
// 获取客户类型
  getCustomerType: function() {
    let shopInfo = this.data.shopInfo;
    shopApi.customertypeList().then((res) => {
      shopInfo.customerTypeArr = res.data;
      this.setData({
        shopInfo: shopInfo
      });
    }).catch((error) => {
      console.log(error);
    })
  },
  changeCustom: function(e) {
    let index = e.detail.value;
    let shopInfo = this.data.shopInfo;
    shopInfo.customerType = shopInfo.customerTypeArr[index].id;
    shopInfo.customerType_name = shopInfo.customerTypeArr[index].name;
    this.setData({
      shopInfo: shopInfo
    });
  },
  // 申请入驻店铺
  addShop: function() {
    let params = this.data.shopInfo;
    if (!params.cardZmPath) {
      return wx.showToast({
        title: '身份证头像面不能为空',
        icon: 'none'
      })
    } else if (!params.cardFmPath) {
      return wx.showToast({
        title: '身份证国徽面不能为空',
        icon: 'none'
      })
    } else if (!params.cardBsPath) {
      return wx.showToast({
        title: '手持身份证半身照不能为空',
        icon: 'none'
      })
    } else if (!params.businessLicense) {
      return wx.showToast({
        title: '营业执照',
        icon: 'none'
      })
    }
    shopApi.addShop(params).then((res) => {
      this.setData({
        step: 2
      });
    }).catch((error) => {
      console.log(error);
    })
  },
  // 选择身份证头像面
  changeAvatar: function(e) {
    let key = e.currentTarget.dataset.key;
    this.uploadImg(key);
  },
  // 上传图片
  uploadImg: function(key) {
    let _this = this;
    let uploadUrl = this.data.uploadUrl;
    wx.chooseImage({
      count: 1,
      success: function(res) {
        wx.showLoading({
          title: '上传中...',
        })
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: uploadUrl,
          filePath: tempFilePaths[0],
          name: 'files',
          success: function(res) {
            let shopInfo = _this.data.shopInfo;
            shopInfo[key] = JSON.parse(res.data)[0].url;
            _this.setData({
              shopInfo: shopInfo
            });
            wx.showToast({
              title: '上传成功'
            })
          },
          fail: function(error) {
            wx.showToast({
              title: error.message ? error.message : '上传失败',
              icon: 'none'
            })
          },
          complete: function() {
            wx.hideLoading();
          }
        })
      },
      fail: function(error) {
        console.log(error);
      }
    });
  }
})