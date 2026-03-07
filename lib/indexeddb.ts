import { openDB, DBSchema, IDBPDatabase } from 'idb'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
  userId?: string
  synced: boolean
}

export interface SyncQueue {
  id: string
  noteId: string
  action: 'create' | 'update' | 'delete'
  data: Partial<Note>
  timestamp: number
  attempts: number
}

interface NoteDB extends DBSchema {
  notes: {
    key: string
    value: Note
    indexes: { 'by-date': number; 'by-synced': boolean }
  }
  syncQueue: {
    key: string
    value: SyncQueue
    indexes: { 'by-timestamp': number }
  }
}

let db: IDBPDatabase<NoteDB> | null = null

export async function initDB(): Promise<IDBPDatabase<NoteDB>> {
  if (db) return db

  db = await openDB<NoteDB>('notes-app', 1, {
    upgrade(db) {
      // Notes store
      if (!db.objectStoreNames.contains('notes')) {
        const notesStore = db.createObjectStore('notes', { keyPath: 'id' })
        notesStore.createIndex('by-date', 'updatedAt')
        notesStore.createIndex('by-synced', 'synced')
      }

      // Sync queue store
      if (!db.objectStoreNames.contains('syncQueue')) {
        const queueStore = db.createObjectStore('syncQueue', { keyPath: 'id' })
        queueStore.createIndex('by-timestamp', 'timestamp')
      }
    },
  })

  return db
}

export async function createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
  const db = await initDB()
  const newNote: Note = {
    ...note,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    synced: false,
  }

  await db.add('notes', newNote)
  await addToSyncQueue('create', newNote.id, newNote)

  return newNote
}

export async function updateNote(id: string, data: Partial<Note>): Promise<Note> {
  const db = await initDB()
  const note = await db.get('notes', id)

  if (!note) throw new Error('Note not found')

  const updated: Note = {
    ...note,
    ...data,
    updatedAt: Date.now(),
    synced: false,
  }

  await db.put('notes', updated)
  await addToSyncQueue('update', id, data)

  return updated
}

export async function deleteNote(id: string): Promise<void> {
  const db = await initDB()
  const note = await db.get('notes', id)

  if (!note) throw new Error('Note not found')

  await db.delete('notes', id)
  await addToSyncQueue('delete', id, { id })
}

export async function getNote(id: string): Promise<Note | undefined> {
  const db = await initDB()
  return db.get('notes', id)
}

export async function getAllNotes(): Promise<Note[]> {
  const db = await initDB()
  return db.getAll('notes')
}

export async function getNotesByDate(): Promise<Note[]> {
  const db = await initDB()
  const allNotes = await db.getAllFromIndex('notes', 'by-date')
  return allNotes.reverse()
}

export async function addToSyncQueue(action: string, noteId: string, data: any): Promise<void> {
  const db = await initDB()
  const syncItem: SyncQueue = {
    id: crypto.randomUUID(),
    noteId,
    action: action as any,
    data,
    timestamp: Date.now(),
    attempts: 0,
  }

  await db.add('syncQueue', syncItem)
}

export async function getSyncQueue(): Promise<SyncQueue[]> {
  const db = await initDB()
  return db.getAll('syncQueue')
}

export async function removeSyncItem(id: string): Promise<void> {
  const db = await initDB()
  await db.delete('syncQueue', id)
}

export async function markNoteAsSynced(id: string): Promise<void> {
  const db = await initDB()
  const note = await db.get('notes', id)

  if (note) {
    note.synced = true
    await db.put('notes', note)
  }
}

export async function clearAllData(): Promise<void> {
  const db = await initDB()
  await db.clear('notes')
  await db.clear('syncQueue')
}
