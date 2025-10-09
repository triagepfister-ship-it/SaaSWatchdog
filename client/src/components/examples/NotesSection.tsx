import { NotesSection } from "../NotesSection";

const mockNotes = [
  { id: "1", content: "Had a great call with the team. They're very happy with the product and looking to expand.", createdBy: "Sarah Johnson", createdAt: "2 hours ago" },
  { id: "2", content: "Customer mentioned budget concerns. Scheduled follow-up meeting for next week.", createdBy: "Mike Chen", createdAt: "1 day ago" },
];

export default function NotesSectionExample() {
  return (
    <div className="p-8">
      <NotesSection notes={mockNotes} />
    </div>
  );
}
