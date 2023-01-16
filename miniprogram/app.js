// app.js
App({
  onLaunch: function () {
      if(!wx.cloud)
      {
          console.log("wx.cloud Err")
      }else
      {
              wx.cloud.init({
              env:"music-1gzf7qihc57085d6",
              traceUser:true
          })
      }
  }
});
