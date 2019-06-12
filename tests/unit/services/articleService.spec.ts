import articleService from '@/services/ArticleService'
import IArticle from '@/models/IArticle'

describe('Article Service', () => {
  it('Create an empty article', () => {
    const article: IArticle = articleService.create()
    expect(article.title).toStrictEqual('')
    expect(article.content).toStrictEqual('')
  })
})
