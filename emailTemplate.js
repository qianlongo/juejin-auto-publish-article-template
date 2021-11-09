
const { userInfo } = require('./config')

module.exports = emailTemplate = (options) => {
  const { articleInfos = [], ...others } = options || {}
  const { avatar, nickName, introduce } = userInfo || {}
  const { templateType = 'success', errorInfo= '' } = others || {}
  const templateMap = {
    success: `
      <div class="user-info" style="display: flex;  align-items: center; padding: 8px 20px;">
        <img style="width: 60px; height: 60px; border-radius: 50%; margin-right: 10px;" class="avatar" src="${avatar}" alt="">
        <div class="user-detail">
          <div class="nick-name" style="font-size: 16px; font-weight: bold; line-height: 1.2; color: #000;">${nickName}</div>
          <div class="desc" style="color: #30445a; font-size: 12px; padding-top: 6px;">${introduce}</div>
        </div>
      </div>
      <div class="main">
        ${
          articleInfos.map((articleInfo) => {
            const { title, link, brief_content: briefContent, cover_image: coverImage } = articleInfo || []
            return `
              <div
              class="content-wrapper"
              style="
                display: flex;
                padding-bottom: 12px;
                border-bottom: 1px solid #e5e6eb;
                padding: 12px 20px;
              "
            >
              <div class="content-main" style="flex: 1 1 auto">
                <div class="title-row" style="display: flex; margin-bottom: 8px">
                  <a
                    href="${link}"
                    target="_blank"
                    rel=""
                    title="${title}"
                    class="title"
                    style="
                      font-weight: 700;
                      font-size: 16px;
                      line-height: 24px;
                      color: #1d2129;
                      width: 100%;
                      display: -webkit-box;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      -webkit-box-orient: vertical;
                      -webkit-line-clamp: 1;
                      text-decoration: none;
                      cursor: pointer;
                    "
                    >${title}</a
                  >
                </div>
                <div class="abstract" style="margin-bottom: 10px">
                  <a
                    href="${link}"
                    target="_blank"
                    rel=""
                    style="
                      color: #86909c;
                      font-size: 13px;
                      line-height: 22px;
                      display: -webkit-box;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      -webkit-box-orient: vertical;
                      text-decoration: none;
                      -webkit-line-clamp: 2;
                    "
                  >
                    ${briefContent}
                  </a>
                </div>
              </div>
              <div
                class="lazy thumb"
                style="
                  flex: 0 0 auto;
                  width: 120px;
                  height: 80px;
                  margin-left: 24px;
                  background-color: #e0e0e0;
                  position: relative;
                  border-radius: 6px;
                  -o-object-fit: cover;
                  object-fit: cover;
                  background-image: url(${coverImage});
                  background-size: cover;
                "
              ></div>
            </div>
            `
          })
        }
       
      </div>
    `,
    error: `
    <div style="max-width: 375px; padding: 12px 20px; display: flex; justify-content: center; align-items: center; flex-direction: column;">
      <img style="width: 80%;" src="https://img13.360buyimg.com/ddimg/jfs/t1/158409/29/29190/14574/618a67a3E5125f564/b678db2f277c1d1b.jpg" alt="">
      <div style="color: #86909c; font-size: 13px; font-weight: 500;">啊哦！定时发布出错了，快去github action看看吧</div>
      <pre style="width: 100%; margin-top: 10px; padding: 0; overflow: scroll; color: #86909c;">
        ${ errorInfo }
      </pre>
    </div>
    `,
    notLogin: `
    <div style="max-width: 375px; padding: 12px 20px; display: flex; justify-content: center; align-items: center; flex-direction: column;">
      <img style="width: 80%;" src="https://img10.360buyimg.com/ddimg/jfs/t1/208608/4/8737/100853/618a6730Eee9841c1/f10752fd8efda184.png" alt="">
      <div style="color: #86909c; font-size: 13px; font-weight: 500;">啊哦！登录过期啦, 快更新juejin cookie噢</div>
    </div>
    `,
  }

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin: 0">
      ${templateMap[ templateType ]}
    </body>
  </html>
  
  `
}