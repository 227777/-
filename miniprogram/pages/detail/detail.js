// pages/detail/detail.js
let db = wx.cloud.database()
let comment=""

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        show:false,//评论弹窗
        show1: true,
        show2: true
    },
    //获取数据
    getFrienddata(e) {
        let that = this
        wx.cloud.database().collection("friend").doc(e).get()
            .then(res => {
                that.setData({
                    list: res.data
                })
            }).catch(res => {
                console.log("失败")
            })
    },
    // 点赞事件
    interactiveP(e) {
        let that = this
        //判断是否登录 否 跳转登录
        if (!wx.getStorageSync('openid')) {
            wx.showModal({
                title: "点赞失败",
                content: "请先登录！",
                success: res => {
                    if (res.confirm == true) {
                        wx.switchTab({
                            url: '/pages/my/my',
                        })
                    }
                }
            })
        } else {//判断是否登录 是 可以点赞          
            if (this.data.show1 == true) { //判断点赞图标是否为灰色 是 进行点赞             
                if (!that.data.list.prizelist) {//判断数据库中是否有prizelist 否 为第一个点赞
                    let prizelist = [{
                        openid: wx.getStorageSync('openid')
                    }]
                    db.collection("friend").doc(that.data.list._id).update({
                        data: {
                            prizelist: prizelist
                        }
                    }).then(res => {
                        wx.showToast({
                            title: '点赞成功',
                            icon: "none"
                        })
                        console.log(that.data.list.prizelist)
                        this.updateP()
                        that.setData({
                            show1: false,
                        })
                    })
                } else {//判断数据库中是否有prizelist 是 非第一个点赞
                    let newprizelist = that.data.list.prizelist
                    newprizelist.push({
                        openid: wx.getStorageSync('openid')
                    })
                    db.collection("friend").doc(that.data.list._id).update({
                        data: {
                            prizelist: newprizelist
                        }
                    }).then(res => {
                        wx.showToast({
                            title: '点赞成功2',
                            icon: "none"
                        })
                        this.updateP()
                        that.setData({
                            show1: false,   
                        })
                    })
                }
            } else {//判断点赞图标是否为灰色 否 进取消点赞   
                let prizelist = that.data.list.prizelist
                if(prizelist.length==undefined)
                {
                    prizelist.splice(0,1)
                    that.setData({
                        show1: true
                    })
                }else{
                    for (let i = 0; i < prizelist.length; i++) {
                        console.log(prizelist.length)
                        if (prizelist[i].openid == wx.getStorageSync('openid')) {
                            prizelist.splice(i, 1)
                        }
                            db.collection("friend").doc(that.data.list._id).update({
                                data: {
                                    prizelist: prizelist
                                }
                            }).then(res => {
                                wx.showToast({
                                    title: '取消成功',
                                    icon: "none"
                                })
                                this.updateP()
                                that.setData({
                                    show1: true
                                })
                            })
                     
                    }
                }
             
            }
        }
    },
    //收藏事件
    interactiveP2(e) {
        console.log(e)
        let that = this
        //判断是否登录 否 跳转登录
        if (!wx.getStorageSync('openid')) {
            wx.showModal({
                title: "点赞失败",
                content: "请先登录！",
                success: res => {
                    if (res.confirm == true) {
                        wx.switchTab({
                            url: '/pages/my/my',
                        })
                    }
                }
            })
        } else {//判断是否登录 是 可以点赞          
            if (this.data.show2 == true) { //判断点赞图标是否为灰色 是 进行点赞             
                if (!that.data.list.collectlist) {//判断数据库中是否有prizelist 否 为第一个点赞
                    let collectlist = [{
                        openid: wx.getStorageSync('openid')
                    }]
                    db.collection("friend").doc(that.data.list._id).update({
                        data: {
                            collectlist: collectlist
                        }
                    }).then(res => {
                        wx.showToast({
                            title: '收藏成功',
                            icon: "none"
                        })
                        that.updateP()
                        that.setData({
                            show2: false
                        })
                    })
                } else {//判断数据库中是否有prizelist 是 非第一个点赞
                    let newcollectlist = that.data.list.collectlist
                    newcollectlist.push({
                        openid: wx.getStorageSync('openid')
                    })
                    db.collection("friend").doc(that.data.list._id).update({
                        data: {
                            collectlist: newcollectlist
                        }
                    }).then(res => {
                        wx.showToast({
                            title: '收藏成功2',
                            icon: "none"
                        })
                        that.updateP()
                        that.setData({
                            show2: false
                        })
                    })
                }
            } else {//判断点赞图标是否为灰色 否 进取消点赞   
                let collectlist = that.data.list.collectlist
                for (let i = 0; i < collectlist.length; i++) {
                    console.log(collectlist[i].openid)
                    if (collectlist[i].openid == wx.getStorageSync('openid')) {
                        collectlist.splice(i, 1)
                    }
                        db.collection("friend").doc(that.data.list._id).update({
                            data: {
                                collectlist: collectlist
                            }
                        }).then(res => {
                            wx.showToast({
                                title: '取消收藏',
                                icon: "none"
                            })
                            that.updateP()
                            that.setData({
                                show2: true
                            })
                        })
                 
                }
            }
        }
    },
    //评论弹出事件
    showPopup() {
        this.setData({ show: true });
      },
    //更新点赞 收藏 评论数
    updateP()
    {
        let that=this
        let p= "list.prizelist"
        let c= "list.collectlist"
        let c2= "list.commentlist"
        that.setData({
            [p]:that.data.list.prizelist,
            [c]:that.data.list.collectlist,
            [c2]:that.data.list.commentlist
        })
    },
    //评论收回事件
    onClose() {
        this.setData({ show: false });
      },
    //获取评论文字
    getComment(e)
    {
        console.log(e.detail)
        comment =e.detail
    },
    //发送评论
    onCancel()
    {
        let that = this
        //判断是否登录 否 跳转登录
        if (!wx.getStorageSync('openid')) {
            wx.showModal({
                title: "评论失败",
                content: "请先登录！",
                success: res => {
                    if (res.confirm == true) {
                        wx.switchTab({
                            url: '/pages/my/my',
                        })
                    }
                }
            })
        }else
        {
         
            // comment = comment.replace(/(^\s*)|(\s*$)/g, '');//去除空格;
            if(comment.replace(/(^s*)|(s*$)/g, "").length ==0||comment==undefined||comment==null)
            {
                wx.showToast({
                  title: '输入为空',
                  icon:"none"
                })
            }else
            {
                    if (!that.data.list.commentlist) {//判断数据库中是否有prizelist 否 为第一个点赞
                let commentlist = [{
                    openid: wx.getStorageSync('openid'),
                    nickName:wx.getStorageSync('massage').nickName,
                    avatarUrl:wx.getStorageSync('massage').avatarUrl,
                    comment:comment
                }]
                db.collection("friend").doc(that.data.list._id).update({
                    data: {
                        commentlist: commentlist
                    }
                }).then(res => {
                    wx.showToast({
                        title: '评论成功',
                        icon: "none"
                    })
                    that.updateP()
                })
            } else {//判断数据库中是否有prizelist 是 非第一个点赞
                let newcommentlist = that.data.list.commentlist
                newcommentlist.push({
                    openid: wx.getStorageSync('openid'),
                    nickName:wx.getStorageSync('massage').nickName,
                    avatarUrl:wx.getStorageSync('massage').avatarUrl,
                    comment:comment
                })
                db.collection("friend").doc(that.data.list._id).update({
                    data: {
                        commentlist: newcommentlist
                    }
                }).then(res => {
                    wx.showToast({
                        title: '评论成功2',
                        icon: "none"
                    })
                    that.updateP()
                })
            }
            }
        
        } 
      },
    //查看图片
    lookimages(e)
      {
          console.log(e)
         wx.previewImage({
           urls: [e.currentTarget.dataset.src],
         })
      },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getFrienddata(options.id)
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