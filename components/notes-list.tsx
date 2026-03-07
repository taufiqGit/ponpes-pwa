'use client'

import { Note, deleteNote } from '@/lib/indexeddb'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trash2, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface NotesListProps {
  notes: Note[]
  selectedNote: Note | null
  onSelectNote: (note: Note) => void
  onDeleteNote: (id: string) => void
}

export default function NotesList({
  notes,
  selectedNote,
  onSelectNote,
  onDeleteNote,
}: NotesListProps) {
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    try {
      await deleteNote(id)
      onDeleteNote(id)
    } catch (error) {
      console.error('[v0] Delete error:', error)
    }
  }

  if (notes.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="space-y-3">
          <div className="text-3xl">📝</div>
          <p className="text-sm text-muted-foreground">No notes yet</p>
          <p className="text-xs text-muted-foreground">
            Create your first note to get started
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-2 max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
      {notes.map((note) => (
        <button
          key={note.id}
          onClick={() => onSelectNote(note)}
          className={cn(
            'w-full text-left p-4 rounded-lg border transition-all hover:border-primary/50',
            selectedNote?.id === note.id
              ? 'border-primary bg-primary/5'
              : 'border-border hover:bg-muted/50'
          )}
        >
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium truncate flex-1">
                {note.title || 'Untitled'}
              </h3>
              {!note.synced && (
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {note.content || 'No content'}
            </p>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatDistanceToNow(note.updatedAt, { addSuffix: true })}</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => handleDelete(e, note.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
