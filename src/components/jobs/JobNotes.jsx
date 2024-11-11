import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Send, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function JobNotes({ jobId, notes = [], className }) {
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmitNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await api.addJobNote(jobId, { note: newNote });
      if (result.success) {
        setNewNote('');
        queryClient.invalidateQueries(['job', jobId]);
        toast.success('Note added successfully');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to add note');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="border-b bg-muted/5 px-3 py-2">
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <MessageSquare className="h-3.5 w-3.5 text-primary" />
          Job Notes
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-3">
          {/* Notes List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {notes.length > 0 ? (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-muted/5 rounded-lg p-2.5 space-y-2 hover:bg-muted/10 transition-colors"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="bg-primary/10 rounded-full p-1">
                      <User className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-relaxed">{note.content}</p>
                      <div className="flex items-center justify-between mt-1.5 text-[9px] text-muted-foreground">
                        <span className="font-medium">{note.createdBy}</span>
                        <time dateTime={note.createdAt}>
                          {new Date(note.createdAt).toLocaleString()}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No notes yet</p>
              </div>
            )}
          </div>

          {/* Add Note Form */}
          <form onSubmit={handleSubmitNote} className="space-y-2 pt-2 border-t">
            <div className="space-y-1.5">
              <div className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70">
                Add New Note
              </div>
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Type your note here..."
                className="min-h-[80px] resize-none text-xs"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting || !newNote.trim()}
              className="w-full text-xs h-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Adding Note...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  Add Note
                </>
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
} 