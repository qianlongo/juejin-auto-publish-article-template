const nodemailer = require('nodemailer')
const emailTemplate = require('./emailTemplate')
const { email, titleMap, subTitleMap } = require('./config')
const { 
  sendUserEmail,
  sendUserPass,
  toUserEmail,
} = email

const sendMail = async (data) => {
  const title = titleMap[data.templateType]
  const subTitle = subTitleMap[data.templateType]
  const html = emailTemplate(data)
  let transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: '465',
    secureConnection: true,
    auth: {
      user: sendUserEmail,
      pass: sendUserPass,
    }
  })
  const sendEmailOptions = {
    from: `"${title}" ${sendUserEmail}`,
    to: toUserEmail,
    subject: subTitle,
    html: html,
  }

  await transporter.sendMail(sendEmailOptions)
}

module.exports = sendMail