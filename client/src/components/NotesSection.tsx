import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Note {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

interface NotesSectionProps {
  notes: Note[];
}

export function NotesSection({ notes }: NotesSectionProps) {
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (newNote.trim()) {
      console.log("Adding note:", newNote);
      setNewNote("");
    }
  };

  return (
    <Card data-testid="card-notes">
      <CardHeader>
        <CardTitle>Activity & Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Add a note about this customer..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-20"
            data-testid="input-new-note"
          />
          <div className="flex justify-end">
            <Button onClick={handleAddNote} disabled={!newNote.trim()} data-testid="button-add-note">
              Add Note
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          {notes.map((note) => {
            const initials = note.createdBy
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            return (
              <div key={note.id} className="flex gap-3 p-3 rounded-md bg-muted/30" data-testid={`note-${note.id}`}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{note.createdBy}</span>
                    <span className="text-xs text-muted-foreground">{note.createdAt}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{note.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
