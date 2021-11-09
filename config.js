// 配置信息
module.exports = {
  headers: {
    origin: 'https://juejin.cn',
    referer: 'https://juejin.cn/',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
    'content-type': 'application/json',
    // 主需要关注sessionid即可
    cookie: 'sessionid=xxxx',
  },
  email: {
    sendUserEmail: 'xxxx@qq.com', // 发送者邮箱
    sendUserPass: 'xxxx', // 发送者邮箱MTP协议密码
    toUserEmail: 'xxxx@qq.com', // 发送到谁，填邮箱  
  },
  // success error notLogin
  // 根据你自己的喜好配置即可
  // 不同状态下的标题
  titleMap: {
    success: '掘金定时发布提醒',
    error: '掘金定时发布提醒',
    notLogin: '掘金定时发布提醒'
  },
  // 不同状态下的副标题
  subTitleMap: {
    success: '恭喜！文章发布成功啦！',
    error: '文章发布出错了！',
    notLogin: '登录失效啦！'
  },
  // 你的掘金用户信息
  userInfo: {
    // 头像
    avatar: 'xxx',
    // 昵称
    nickName: 'xxx',
    // 介绍
    introduce: '今天又是努力的一天呢,加油加油噢!!!',
  }
}
