// pages/post/post.js
let db=wx.cloud.database()
const util =require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        images:[],
        video:[],
        showv:true
    },
    submitform(e)
    {
        let that =this
        if(e.detail.value.content=="")
        {
            wx.showToast({
              title: '请先输入内容',
              icon:'none'
            })
            that.setData({
               showv:true,
               video:[]
            })
        }else
        {
            wx.showModal({
              title:'确定发表？',
              content:'发表后所有人可见',
              success:res=>
              {
                  if(res.confirm==true)
                  {
                      db.collection('friend').add({
                          data:
                          {
                              picture:that.data.images,
                              avatar:wx.getStorageSync('massage').avatarUrl,
                              nickName:wx.getStorageSync('massage').nickName,
                              content:e.detail.value.content,
                              video:that.data.video,
                              pagesview:0,
                              time:util.formatTime(new Date())
                          }
                      }).then(res=>{
                          that.setData({
                            video:[],
                            showv:true
                        })
                        wx.navigateBack({
                          delta: 1,
                          success:res=>{
                            wx.showToast({
                                title: '发表成功',
                                icon:'none'
                              })
                          }
                        })
                      })
                  }else if(res.confirm==false)
                  {
                    // that.setData({
                    //     video:[]
                    // })
                  }
              }
            })
        }
    },
    //上传图片
    postImage()
    {
        let that =this
        wx.showActionSheet({
          itemList: ["上传图片","上传视频"],
          success:res=>
          {
              if(res.tapIndex==0)
              {
                wx.chooseImage({
                  count: 9,//可上传的数量
                  sizeType:['original'],
                  sourceType:['album','camera'],
                  success:res=>
                   {
                       wx.showLoading({
                         title: '上传中',
                         icon: 'none'
                       })
                       let time=Date.now()
                       for(var i=0;i<res.tempFilePaths.length;i++)
                       {
                           wx.cloud.uploadFile({
                               cloudPath:"friend.images/"+time+i,
                               filePath:res.tempFilePaths[i]
                           }).then(res=>{
                               console.log(res)
                               that.setData({
                                   images:that.data.images.concat(res.fileID)
                               })
                               wx.hideLoading()
                               wx.showToast({
                                 title: '上传成功',
                                 icon:'none'
                               })
                           })
                       }
                   }
                })
              }else//上传视频
              {
                wx.chooseMedia({
                    count:1,
                    mediaType: ['image','video'],
                    sourceType: ['album', 'camera'],
                    success:res=>
                    {
                        wx.showLoading({
                          title: '上传中',
                          icon: 'none'
                        })
                        // console.log(res.tempFiles)
                            wx.cloud.uploadFile({
                                cloudPath:"friend.video/",
                                filePath:res.tempFiles[0].tempFilePath
                            }).then(res=>{
                                console.log(res)
                                that.setData({
                                    video:that.data.video.concat(res.fileID),
                                    showv:false
                                })
                                wx.hideLoading()
                                wx.showToast({
                                  title: '上传成功',
                                  icon:'none'
                                })
                            })                  
                 }
                })       
              }
          }
        })
    },
    //查看图片
    lookimages(e)
    {
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
    onShow() {
        let time =util.formatTime(new Date());//当前时间
        console.log(time)
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