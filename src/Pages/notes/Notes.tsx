import { useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../supabase";

type Note = {
  id: string;
  date: string;
  text: string;
};

const Notes = () => {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const raw = localStorage.getItem("daily_notes");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const save = (items: Note[]) => {
    setNotes(items);
    try {
      localStorage.setItem("daily_notes", JSON.stringify(items));
    } catch {
      // ignore
    }
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
      const row = data as { id: number; created_at: string; notes: string };
      const item: Note = {
        id: String(row.id),
        date: row.created_at.slice(0, 10),
        text: row.notes ?? "",
      };
      const next = [item, ...notes];
      save(next);
      setText("");
      toast.success("Note added");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to add note";
      toast.error(msg);
    }
  };

  const remove = async (id: string) => {
    try {
      const { error } = await supabase.from("notes").delete().eq("id", Number(id));
      if (error) throw error;
      const next = notes.filter((n) => n.id !== id);
      save(next);
      toast.success("Note removed");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to delete";
      toast.error(msg);
    }
  };

  const startEdit = (n: Note) => {
    setEditId(n.id);
    setEditText(n.text);
  };

  const saveEdit = async () => {
    if (!editId) return;
    const textVal = editText.trim();
    if (!textVal) {
      toast.error("Note can't be empty");
      return;
    }
    try {
      const { error } = await supabase.from("notes").update({ notes: textVal }).eq("id", Number(editId));
      if (error) throw error;
      const next = notes.map((n) => (n.id === editId ? { ...n, text: textVal } : n));
      save(next);
      setEditId(null);
      setEditText("");
      toast.success("Note updated");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update";
      toast.error(msg);
    }
  };

  const syncFromCloud = async () => {
    try {
      const { data, error } = await supabase.from("notes").select("*").order("id", { ascending: false });
      if (error) throw error;
      const items: Note[] = (data ?? []).map((r: { id: number; created_at: string; notes: string }) => ({
        id: String(r.id),
        date: r.created_at.slice(0, 10),
        text: r.notes ?? "",
      }));
      save(items);
      toast.success("Synced from cloud");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Sync failed";
      toast.error(msg);
    }
  };

  return (
    <div className="pb-16 w-full">
      <div className="mx-auto max-w-md p-4">
        {/* <h1 className="text-xl font-semibold text-gray-900 mb-3">Notes</h1> */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-semibold text-gray-900">Notes</h1>
          <button
            onClick={syncFromCloud}
            className="px-3 py-1 rounded-md bg-gray-200 text-gray-800 text-sm hover:bg-gray-300"
          >
            Refresh
          </button>
        </div>
        <textarea
          className="w-full min-h-24 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Write your daily note..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={addNote}
          className="mt-2 w-full rounded-md bg-orange-600 text-white py-2 font-medium hover:bg-orange-700"
        >
          Add Note
        </button>
        <div className="mt-4 space-y-3">
          {notes.map((n) => (
            <div key={n.id} className="rounded-lg border border-gray-200 p-3 bg-white shadow-sm">
              <div className="text-xs text-gray-500">{n.date}</div>
              {editId === n.id ? (
                <>
                  <textarea
                    className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <div className="mt-2 flex gap-2 justify-end">
                    <button
                      className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                      onClick={saveEdit}
                    >
                      Save
                    </button>
                    <button
                      className="px-3 py-1 rounded-md bg-gray-200 text-gray-800 text-sm hover:bg-gray-300"
                      onClick={() => {
                        setEditId(null);
                        setEditText("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-1 text-gray-800 whitespace-pre-wrap">{n.text}</div>
                  <div className="mt-2 flex gap-2 justify-end">
                    <button
                      className="px-3 py-1 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700"
                      onClick={() => startEdit(n)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 rounded-md bg-rose-600 text-white text-sm hover:bg-rose-700"
                      onClick={() => remove(n.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {notes.length === 0 && <div className="text-center text-sm text-gray-600">No notes yet</div>}
        </div>
      </div>
    </div>
  );
};

export default Notes;
