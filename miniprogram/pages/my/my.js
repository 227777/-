// pages/my/my.js

Page({
    /**
     * 页面的初始数据
     */
    data: {
        nickName:"hey",
        avatarUrl:"../../images/my.png",
        denglu:false,
    },
    //授权登录
    getuserInfo()
    {
        let that =this
        //登录功能
        wx.getUserProfile({
          desc: '用于登录',
          success:(res)=>{
            //  获取openid
            wx.cloud.callFunction({
                name:'openid',
                data:{
                  message:'helloCloud',
                }
              }).then(res=>{
                console.log(res)//res就将appid和openid返回了
                  //做一些后续操作，不用考虑代码的异步执行问题。
                  wx.setStorageSync("openid", res.result.openid)    
              })

              that.setData({
                  nickName:res.userInfo.nickName,
                  avatarUrl:res.userInfo.avatarUrl,
                  denglu:true
              })
              //登录成功信息
              wx.showToast({
                title: '登录成功',
                icon:"none"
              })
              //缓存登录信息
              wx.setStorageSync("massage", res.userInfo) 
          }
        })
     
    },
    //退出登录
    signOut()
    {
        let that =this
        wx.showModal({
            title:"退出登录",
            content:"退出后个人功能无法使用",
            success:(res)=>{
                if(res.confirm==true)
                {
                    wx.removeStorageSync('massage')
                    wx.removeStorageSync('openid')
                    that.setData({
                        denglu:false,
                        nickName:"hey",
                        avatarUrl:"../../images/my.png",
                })
                    wx.showToast({
                      title: '已退出',
                      icon:"none"
                    })
                }              
            }
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let that =this
        if(wx.getStorageSync('massage'))
        {
            let userInfo = wx.getStorageSync('massage')
            that.setData({
                nickName:userInfo.nickName,
                avatarUrl:userInfo.avatarUrl,
                denglu:true
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})