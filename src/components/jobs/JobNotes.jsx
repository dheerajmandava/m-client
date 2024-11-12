import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { api } from '@/lib/api/index';

export default function JobNotes({ jobId, notes = [] }) {
  const [newNote, setNewNote] = useState('');
  const queryClient = useQueryClient();

  const addNoteMutation = useMutation({
    mutationFn: (note) => api.jobs.addNote(jobId, note),
    onSuccess: () => {
      queryClient.invalidateQueries(['job', jobId]);
      setNewNote('');
      toast.success('Note added successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add note');
    }
  });

  if (addNoteMutation.isLoading) {
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
            onClick={() => addNoteMutation.mutate(newNote)}
            disabled={!newNote.trim()}
            className="w-full"
          >
            Add Note
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}