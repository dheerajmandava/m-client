import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function JobNotes({ jobId, notes = [], onAddNote, isLoading }) {
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddNote(newNote);
      setNewNote('');
      toast.success('Note added successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to add note');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b bg-muted/5 py-3">
        <CardTitle className="text-lg font-medium">Notes</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          {Array.isArray(notes) && notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-muted/5 rounded-lg p-3 space-y-1"
              >
                <p className="text-sm">{note.content}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No notes yet
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="min-h-[100px] resize-none"
          />
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !newNote.trim()}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding Note...
              </>
            ) : (
              'Add Note'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}