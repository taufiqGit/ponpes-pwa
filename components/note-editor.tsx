'use client'

import { useEffect, useState } from 'react'
import { Note, updateNote, deleteNote } from '@/lib/indexeddb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Trash2, Save, Check, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface NoteEditorProps {
  note: Note
  onUpdate: (note: Note) => void
  onDelete: (id: string) => void
  isOnline: boolean
}

export default function NoteEditor({
  note,
  onUpdate,
  onDelete,
  isOnline,
}: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('saving')

    try {
      const updated = await updateNote(note.id, {
        title: title || 'Untitled',
        content,
      })
      onUpdate(updated)
      setSaveStatus('saved')

      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      console.error('[v0] Save error:', error)
      setSaveStatus('idle')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this note?')) return

    try {
      await deleteNote(note.id)
      onDelete(note.id)
    } catch (error) {
      console.error('[v0] Delete error:', error)
    }
  }

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        handleSave()
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [title, content])

  return (
    <Card className="flex flex-col h-full">
      {/* Editor Header */}
      <div className="border-b border-border p-4 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="text-lg font-semibold border-0 bg-transparent px-0 py-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
          />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {saveStatus === 'saving' && (
            <div className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400 animate-pulse" />
              Saving
            </div>
          )}

          {saveStatus === 'saved' && (
            <div className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
              <Check className="w-3 h-3" />
              Saved
            </div>
          )}

          {!isOnline && (
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Offline
            </div>
          )}

          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing..."
        className="flex-1 p-4 bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none resize-none font-mono text-sm leading-relaxed border-0"
      />

      {/* Editor Footer */}
      <div className="border-t border-border p-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3" />
          <span>Updated {formatDistanceToNow(note.updatedAt, { addSuffix: true })}</span>
        </div>

        {!note.synced && (
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
            <span className="text-xs font-medium">Pending sync</span>
          </div>
        )}
      </div>
    </Card>
  )
}
