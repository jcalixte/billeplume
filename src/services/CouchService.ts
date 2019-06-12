import PouchDb from 'pouchdb'
import PouchDbAuthentication from 'pouchdb-authentication'
import bus, { SYNC } from '@/utils/bus-event'
import IUser from '@/models/IUser'
import notif from '@/utils/notif'
import { debounce } from 'lodash-es'
import { confirmation } from '@/utils'

PouchDb.plugin(PouchDbAuthentication)
const emit = debounce((ev: string, arr?: string[]) => bus.$emit(ev, arr), 150)

const remoteConfig = {
  skip_setup: true,
  ajax: {
    cache: true,
    withCredentials: true
  }
}
const LOCALE_DB: string = 'BILLE_PLUME_LOCALE_DB'
const REMOTE: string = 'https://juliencalixte.ddns.net'

class CouchService {
  public remote: PouchDB.Database = new PouchDb(
    `${REMOTE}/billeplume`,
    remoteConfig
  )
  public db: PouchDB.Database | null = new PouchDb(LOCALE_DB)
  public remoteUserDb: PouchDB.Database | null = null
  public userDb: PouchDB.Database | null = null
  private user: IUser | null = null
  private sync: PouchDB.Replication.Sync<{}> | null = null
  private userSync: PouchDB.Replication.Sync<{}> | null = null
  private eventListened: boolean = false

  constructor() {
    if (!this.eventListened) {
      this.eventListened = true
      window.addEventListener('online', () => {
        if (!this.sync) {
          this.initLive()
        }
      })
      window.addEventListener('offline', () => {
        this.cancelSync()
      })
    }
  }

  public async initLive(): Promise<boolean> {
    if (!this.user || !this.db) {
      return false
    }
    await this.cancelSync()
    if (this.userDb && this.remoteUserDb) {
      this.userSync = this.userDb
        .sync(this.remoteUserDb, {
          live: true,
          retry: true
        })
        .on('change', (result) => {
          if (result.direction === 'pull') {
            emit(SYNC, result.change.docs.map((doc) => doc._id))
          }
        })
    }

    this.sync = this.db
      .sync(this.remote, {
        live: true,
        retry: true,
        filter: 'account/by_user',
        query_params: { userId: this.user.userId }
      })
      .on('change', (result) => {
        if (result.direction === 'pull') {
          const docNoCurrency = result.change.docs.find(
            (doc) => !doc._id.startsWith('cur')
          )
          if (docNoCurrency) {
            emit(SYNC)
            confirmation('Mise à jour...')
          }
        } else if (result.direction === 'push') {
          emit(SYNC)
        }
      })
      .on('error', (error: any) => {
        // tslint:disable-next-line:no-console
        console.warn('on error', { error })
        if (error.name !== 'unauthorized') {
          notif.alert(`une erreur s'est produite`)
        }
      })
    return true
  }

  public async hasLocaleDoc(): Promise<boolean> {
    if (!this.db || this.db.name !== LOCALE_DB) {
      return false
    }
    const docs = await this.db.allDocs()
    return !!docs.total_rows
  }

  public setUser(
    user: IUser | null,
    hexUser: string | null,
    replicateLocale: boolean
  ): void {
    const newUser: boolean =
      !this.user || (!!user && this.user.userId !== user.userId)
    this.user = user
    if (user) {
      if (newUser) {
        if (replicateLocale && this.db) {
          const vaquantDb = new PouchDb(`vaquant-${user.userId}`)
          this.db.replicate.to(vaquantDb).on('complete', async () => {
            if (this.db) {
              await this.db.destroy()
              this.db = vaquantDb
            }
          })
        } else {
          this.db = new PouchDb(`vaquant-${user.userId}`)
        }
      }
      this.remoteUserDb = hexUser
        ? new PouchDb(`${REMOTE}/userdb-${hexUser}`, remoteConfig)
        : null
      this.userDb = hexUser ? new PouchDb(`userdb-${hexUser}`) : null
      this.initLive()
    } else {
      this.cancelSync()
    }
  }

  public get online(): boolean {
    return navigator.onLine
  }

  public async get(id: string): Promise<any | null> {
    try {
      if (!this.db) {
        return null
      }
      return await this.db.get(id)
    } catch (error) {
      return null
    }
  }

  public async getFirstByPrefix<T>(
    prefix: string,
    desc: boolean = false
  ): Promise<T | null> {
    if (!this.db) {
      return null
    }
    const response = await this.db.allDocs({
      include_docs: true,
      startkey: desc ? `${prefix}\ufff0` : prefix,
      endkey: desc ? prefix : `${prefix}\ufff0`,
      limit: 1,
      descending: desc
    })

    const rows = response.rows.map((r) => r.doc)
    if (rows.length) {
      return (rows[0] as any) as T
    } else {
      return null
    }
  }

  public async getByPrefix<T>(prefix: string): Promise<T[]> {
    if (!this.db) {
      return []
    }
    const response = await this.db.allDocs({
      include_docs: true,
      startkey: prefix,
      endkey: `${prefix}\ufff0`
    })

    const rows = response.rows.map((r) => r.doc)
    return (rows as any[]) as T[]
  }

  public async query(query: string): Promise<any> {
    if (!this.db) {
      return []
    }
    const response = await this.db.query(query, {
      include_docs: true
    })
    return response.rows.map((row) => row.doc)
  }

  public async save(doc: any): Promise<PouchDB.Core.Response> {
    if (!this.db) {
      return {
        id: '',
        rev: '',
        ok: false
      }
    }
    const response = await this.db.put(doc)
    return response
  }

  public async publish(id: string): Promise<PouchDB.Core.Response> {
    if (!this.remote || !this.db) {
      return {
        id: '',
        rev: '',
        ok: false
      }
    }

    const response = await this.db.replicate.to(this.remote, {
      doc_ids: [id]
    })

    return {
      id,
      rev: '',
      ok: response.ok
    }
  }

  public async multipleSave(
    docs: any[]
  ): Promise<Array<PouchDB.Core.Response | PouchDB.Core.Error>> {
    if (!this.db) {
      return []
    }
    const response = await this.db.bulkDocs(docs)
    return response
  }

  public async remove(id: string): Promise<boolean> {
    if (!this.db) {
      return false
    }
    const doc = await this.db.get(id)
    if (doc) {
      const { ok } = await this.save({
        ...doc,
        _deleted: true
      })
      return ok
    }
    return false
  }

  public newId(...prefixes: string[]): string {
    return `${prefixes.join('-')}${Date.now().toString()}`
  }

  private cancelSync(): any {
    if (this.sync) {
      this.sync.cancel()
      this.sync = null
    }
    if (this.userSync) {
      this.userSync.cancel()
      this.userSync = null
    }
  }
}

export default new CouchService()
