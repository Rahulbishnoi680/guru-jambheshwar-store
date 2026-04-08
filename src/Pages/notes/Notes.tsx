import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../supabase";

type Note = {
  id: string;
  created_at: string;
  updated_at?: string;
  text: string;
};

const Notes = () => {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // ✅ DELETE CONFIRM STATE
  const [confirm, setConfirm] = useState<{ open: boolean; id?: string }>({
    open: false,
  });

  const save = (items: Note[]) => {
    setNotes(items);
  };

  const addNote = async () => {
    if (!text.trim()) {
      toast.error("Write something first");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("notes")
        .insert([{ notes: text.trim() }])
        .select()
        .single();

      if (error) throw error;

      const row = data as {
        id: number;
        created_at: string;
        updated_at?: string;
        notes: string;
      };

      const item: Note = {
        id: String(row.id),
        created_at: row.created_at,
        updated_at: row.updated_at,
        text: row.notes ?? "",
      };

      save([item, ...notes]);
      setText("");
      toast.success("Note added");
    } catch (e: unknown) {
      toast.error("Failed to add note");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", Number(id));
        
      fetchNotes();

      if (error) throw error;

      save(notes.filter((n) => n.id !== id));
      toast.success("Note deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setConfirm({ open: false });
    }
  };

  const startEdit = (n: Note) => {
    setEditId(n.id);
    setEditText(n.text);
  };

  const saveEdit = async () => {
    if (!editId) return;

    try {
      const { error } = await supabase
        .from("notes")
        .update({
          notes: editText,
          updated_at: new Date().toISOString(), // ✅ updated_at set
        })
        .eq("id", Number(editId));

      if (error) throw error;

      const next = notes.map((n) =>
        n.id === editId
          ? { ...n, text: editText, updated_at: new Date().toISOString() }
          : n,
      );

      save(next);
      setEditId(null);
      setEditText("");
      toast.success("Updated");
    } catch {
      toast.error("Update failed");
    }
  };

  // ✅ DATE FORMAT FUNCTION
  const formatDateTime = (created: string, updated?: string) => {
    const date = updated || created;

    const d = new Date(date);

    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchNotes = async () => {
    const { data } = await supabase
      .from("notes")
      .select("*")
      .order("id", { ascending: false });

    const items: Note[] = (data ?? []).map((r: any) => ({
      id: String(r.id),
      created_at: r.created_at,
      updated_at: r.updated_at,
      text: r.notes,
    }));

    save(items);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-2">Notes</h1>

      <textarea
        className="w-full border p-2 rounded"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={addNote}
        className="w-full mt-2 bg-orange-600 text-white py-2 rounded"
      >
        Add Note
      </button>

      <div className="mt-4 space-y-3">
        {notes.map((n) => (
          <div key={n.id} className="border p-3 rounded shadow">
            {/* ✅ UPDATED / CREATED DATE */}
            <div className="text-xs text-gray-500">
              {formatDateTime(n.created_at, n.updated_at)}
            </div>

            {editId === n.id ? (
              <>
                <textarea
                  className="w-full border mt-2 p-2"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />

                <div className="flex gap-2 justify-end mt-2">
                  <button onClick={saveEdit}>Save</button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="mt-2">{n.text}</div>

                <div className="flex gap-2 justify-end mt-2">
                  <button onClick={() => startEdit(n)}>Edit</button>

                  {/* ✅ DELETE WITH CONFIRM */}
                  <button
                    onClick={() => setConfirm({ open: true, id: n.id })}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* ✅ CONFIRM MODAL */}
      {confirm.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow w-80">
            <h2 className="font-semibold mb-2">Delete Note?</h2>
            <p className="text-sm mb-4">This action cannot be undone.</p>

            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirm({ open: false })}>
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(confirm.id!)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
