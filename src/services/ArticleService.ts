import IArticle from '@/models/IArticle'
import couchService from '@/services/CouchService'
import Doctype from '@/enums/Doctype'
import bus, { ARTICLE_CHANGE } from '@/utils/bus-event'
import colors from '@/data/colors'
import Font from '@/enums/Font'
import ProgressType from '@/enums/ProgressType'
import { slug } from '@/utils'

class ArticleService {
  public async get(id: string): Promise<IArticle | null> {
    const account: IArticle = await couchService.get(id)
    return account || null
  }

  public async getLast(): Promise<IArticle | null> {
    const account: IArticle | null = await couchService.getFirstByPrefix<
      IArticle
    >(Doctype.article, true)
    return account
  }

  public create(): IArticle {
    return {
      title: '',
      slug: '',
      date: new Date(),
      content: '',
      publish: false,
      chapter: 0,
      color: colors[0].value,
      font: Font.monospace,
      progressType: ProgressType.year,
      version: 0
    }
  }

  public newChapter(article: IArticle): IArticle {
    const newChapter: IArticle = {
      ...article,
      chapter: (article.chapter || 0) + 1,
      content: '',
      version: 0,
      publish: false
    }
    return this.resetModel(newChapter)
  }

  public async add(article: IArticle): Promise<boolean> {
    const id = couchService.newId(Doctype.article)
    article._id = id
    article.doctype = Doctype.article
    article.slug = slug(article.title)
    const { ok, rev } = await couchService.save(article)
    if (ok) {
      article._rev = rev
      bus.$emit(ARTICLE_CHANGE)
    }
    return ok
  }

  public async save(article: IArticle, emit?: boolean): Promise<boolean> {
    article.slug = slug(article.title)
    const { ok, rev } = await couchService.save(article)
    if (ok) {
      article._rev = rev
      if (emit) {
        bus.$emit(ARTICLE_CHANGE)
      }
    }
    return ok
  }

  public async publish(article: IArticle, emit?: boolean): Promise<boolean> {
    article.version++
    article.publish = true
    const { ok, rev } = await couchService.save(article)
    await couchService.publish(article._id || '')
    if (ok) {
      article._rev = rev
      if (emit) {
        bus.$emit(ARTICLE_CHANGE)
      }
    }
    return ok
  }

  public async remove(id: string): Promise<boolean> {
    const ok = await couchService.remove(id)
    if (ok) {
      bus.$emit(ARTICLE_CHANGE)
    }
    return ok
  }

  public async getAll(): Promise<IArticle[]> {
    return await couchService.getByPrefix<IArticle>(Doctype.article)
  }

  public resetModel(article: IArticle): IArticle {
    const unmodel = { ...article }
    delete unmodel._id
    delete unmodel._rev
    delete unmodel._conflicts
    delete unmodel._deleted
    return unmodel
  }

  public unmodel(...articles: IArticle[]) {
    return articles.map((article: IArticle) => this.resetModel(article))
  }
}

export default new ArticleService()
