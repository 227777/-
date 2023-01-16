// pages/friend/friend.js
let db=wx.cloud.database()
Page({
    data: {
        list:[],
        show1:true,
        show2:true
    },  
    // 跳转详情页面
    showDetail(e)
    {  
        console.log(e)
        let id=e.currentTarget.dataset.id
        let pagesview =e.currentTarget.dataset.pagesview
        this.updataPagesview(id,pagesview)
        wx.navigateTo({
          url: '/pages/detail/detail?id='+id,
        })
    },
    // 跟新浏览量
    updataPagesview(e,pagesview)
    {
        db.collection("friend").doc(e).update({
            data:
            {
                pagesview:pagesview+1
            }
        }).then(res=>{
            console.log("c")
        })
    },
    //点击发表图文
    post()
    {
        if(!wx.getStorageSync('openid'))
        {
            wx.showModal({
              title:'发表失败',
              content:'请先登录!',
              success:res=>
              {
                  if(res.confirm==true)
                  {
                    wx.switchTab({
                        url: '/pages/my/my',
                    })
                  }
              }
            })
        }else
        {
               wx.navigateTo({
               url: '/pages/post/post'
          })
        }
     
    },
    //查看图片
    lookimages(e)
    {
        console.log(e)
       let index =e.currentTarget.dataset.index
       wx.previewImage({
         urls: [e.currentTarget.dataset.src],
       })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
     
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow(e) {
        let that =this
        wx.cloud.database().collection("friend").get()
        .then(res=>{
            that.setData({
                list:res.data
            })
        })
        .catch(err=>{
            console.log("无法获取数据库")
        })     
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