const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const axios = require('axios')
const { log, getLogs, clear } = require('./console')

const sendEmail = require('./sendEmail')
const { headers } = require('./config')

const PUB_ARTICLE_RE = /[\【\[]AR(?: )?(\d{4}-\d{2}-\d{2})?[\]\】]/i

dayjs.extend(utc)
dayjs.extend(timezone)

axios.interceptors.response.use(function (response) {
  const wrapData = response.data

  if (wrapData.err_no === 0) {
    return wrapData
  } else {
    return Promise.reject(wrapData)
  }
}, function (error) {
  return Promise.reject(error);
});

// 过滤即将发布的文章
const filterPubArticle = (articles = []) => {
  const today = dayjs(new Date()).add(8, 'h').format('YYYY-MM-DD HH:mm:ss')

  log(`第② 步：开始筛选需今日(${today})发布的文章`)

  const filterResult = articles.filter((article) => {
    const matchResult = article.title.match(PUB_ARTICLE_RE)
    const pubDate = matchResult && matchResult[1]

    if (pubDate) {
      const isTodayPub = today === pubDate

      log(`文章${article.title}, 指定了发布日期${pubDate}, 今天是${today}, ${isTodayPub ? '今日即将发布' : '未到发布日期'}`)

      return isTodayPub
    } else {
      return matchResult
    }
  }).map((it) => {
    return {
      ...it,
      title: it.title.replace(PUB_ARTICLE_RE, ''),
      link: `https://juejin.cn/post/${it.id}`
    }
  })

  log(`----筛选出${filterResult.length}篇已标志且今日即将发布的文章----`)

  return filterResult
}



// 获取草稿箱内所有文章
const getAllDraftArticles = async (allDraftArticles = [], page_no = 1) => {
  const result = await axios({
    url: 'https://api.juejin.cn/content_api/v1/article_draft/list_by_user',
    method: 'post',
    headers,
    data: { "keyword": "", "page_size": 10, page_no }
  })
  const draftArticles = result.data
  const count = result.count

  allDraftArticles = allDraftArticles.concat(draftArticles)
  
  if (allDraftArticles.length === count) {
    log(`第① 步：检测到草稿箱内有${allDraftArticles.length}篇文章`)
    return allDraftArticles
  } else {
    return getAllDraftArticles(allDraftArticles, page_no + 1)
  }
}
// 获取草稿内文章详情
const getDraftDetail = async (draft_id) => {
  const result = await axios({
    url: 'https://api.juejin.cn/content_api/v1/article_draft/detail',
    method: 'post',
    data: {
      draft_id
    },
    headers
  })

  return result.data
}

// 更新文章
const updateDraftDetails = async (draft_articles = []) => {
  log('第③ 步：去除文章标题中定时发布标识')
  return Promise.all(draft_articles.map(async (article) => {
    const { article_draft } = await getDraftDetail(article.id)
    const originTitle = article_draft.title.replace(PUB_ARTICLE_RE, '')

    const result = await axios({
      url: 'https://api.juejin.cn/content_api/v1/article_draft/update',
      method: 'post',
      headers,
      data: {
        ...article_draft,
        title: originTitle,
        tag_ids: article.tag_ids.map((tagId) => '' + tagId)
      }
    })

    log(`${article.title}：已去除标识，可原文发布`)

    return result
  }))
}

// 发布文章
const publishArticles = (articles = []) => {
  log('第④ 步：开始挨个发布文章')
  return Promise.all(articles.map(async (article) => {
    log(`发布文章: ${article.title} ${article.link}`)
    const result = await axios({
      url: 'https://api.juejin.cn/content_api/v1/article/publish',
      method: 'post',
      headers,
      data: {
        draft_id: article.id,
        sync_to_org: false,
        column_ids: []
      }
    })

    log(`发布成功`)

    return result
  })) 
}

const init = async () => {
  try {
    // 1. 获取草稿箱内所有的文章
    const draftArticles = await getAllDraftArticles()
    // 2. 筛选需今日发布的文章
    const filterPubArticles = filterPubArticle(draftArticles)
    
    if (filterPubArticles.length) {
      // 3. 更新筛选结果的文章标题，去除[AR 2021-11-08]、[AR]标识
      await updateDraftDetails(filterPubArticles)
      // 4. 开始发布文章
      await publishArticles(filterPubArticles)
      // log(filterPubArticleResult)

      sendEmail({
        templateType: 'success',
        articleInfos: filterPubArticles
      })
    }
    
  } catch (err) {
    console.log('出错了', err)
    try {
      log(JSON.stringify(err))
    } catch (e) {
      console.log(e)
    }
    
    sendEmail({
      templateType: 'error',
      errorInfo: getLogs(),
    })
    clear()
  }  
}

init()