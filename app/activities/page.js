"use client";
// ============================================================
// app/activities/page.js  →  becomes the URL  /activities
// ------------------------------------------------------------
// Records school activities: clubs, sports, volunteering,
// competitions, events. Tracks hours — later you can chart
// "time budget" the same way the ledger charts money.
// (Economists call this time allocation — same theory!)
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

const KINDS = ["Club", "Sports", "Volunteering", "Competition", "Event", "Other"];

const DEMO_DATA = [
  { id: 1, title: "Economics Society weekly meeting", kind: "Club", activity_date: "2026-07-02", hours: 2, notes: "Debate on minimum wage" },
  { id: 2, title: "Beach cleanup at East Coast", kind: "Volunteering", activity_date: "2026-07-05", hours: 4, notes: "" },
  { id: 3, title: "Inter-faculty badminton", kind: "Sports", activity_date: "2026-07-09", hours: 3, notes: "Won first round!" },
];

export default function ActivitiesPage() {
  const demoMode = supabase === null;

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("Club");
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");
  const [notes, setNotes] = useState("");

  // ---------- LOAD ----------
  useEffect(() => {
    async function load() {
      if (demoMode) {
        setActivities(DEMO_DATA);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("activity_date", { ascending: false });
      if (error) console.error("Load failed:", error.message);
      setActivities(data ?? []);
      setLoading(false);
    }
    load();
  }, [demoMode]);

  // ---------- SUMMARY: total hours ----------
  const totalHours = useMemo(
    () => activities.reduce((sum, a) => sum + Number(a.hours || 0), 0),
    [activities]
  );

  // ---------- ADD ----------
  async function addActivity() {
    if (!title.trim() || !date) {
      alert("Please fill in the activity name and date.");
      return;
    }
    const newRow = {
      title: title.trim(),
      kind,
      activity_date: date,
      hours: parseFloat(hours) || 0,
      notes: notes.trim(),
    };

    if (demoMode) {
      setActivities([{ ...newRow, id: Date.now() }, ...activities]);
    } else {
      const { data, error } = await supabase
        .from("activities")
        .insert(newRow)
        .select()
        .single();
      if (error) {
        alert("Save failed: " + error.message);
        return;
      }
      setActivities([data, ...activities]);
    }
    setTitle("");
    setDate("");
    setHours("");
    setNotes("");
  }

  // ---------- DELETE ----------
  async function deleteActivity(id) {
    if (!demoMode) {
      const { error } = await supabase.from("activities").delete().eq("id", id);
      if (error) {
        alert("Delete failed: " + error.message);
        return;
      }
    }
    setActivities(activities.filter((a) => a.id !== id));
  }

  return (
    <main className="wrap">
      <header className="header">
        <h1>Activities</h1>
        <p className="tagline">Where my time goes — the other scarce resource</p>
        {demoMode && (
          <p className="demo-banner">
            Demo mode: data is not saved. Connect Supabase (see README) to make it real.
          </p>
        )}
      </header>

      <section className="cards">
        <div className="card">
          <span className="card-label">Activities</span>
          <span className="card-value">{activities.length}</span>
        </div>
        <div className="card">
          <span className="card-label">Total hours</span>
          <span className="card-value">{totalHours}</span>
        </div>
      </section>

      <section className="panel">
        <h2>Add an activity</h2>
        <div className="form-row">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What did you do? e.g. Case competition workshop"
          />
        </div>
        <div className="form-row">
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            {KINDS.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            style={{ flex: 1, minWidth: 140 }}
          />
          <input
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Hours"
            type="number"
            min="0"
            step="0.5"
            style={{ flex: 1, minWidth: 90 }}
          />
        </div>
        <div className="form-row">
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
          />
          <button onClick={addActivity}>Add</button>
        </div>
      </section>

      <section className="panel">
        <h2>Activity log</h2>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : activities.length === 0 ? (
          <p className="muted">No activities yet. Add your first one above.</p>
        ) : (
          <ul className="ledger">
            {activities.map((a) => (
              <li key={a.id} className="ledger-row">
                <div className="ledger-main">
                  <span className="ledger-title">{a.title}</span>
                  <span className="ledger-meta">
                    {a.kind} · {String(a.activity_date).slice(0, 10)}
                    {a.notes ? ` · ${a.notes}` : ""}
                  </span>
                </div>
                <span className="ledger-amount">{a.hours} h</span>
                <button className="delete-btn" title="Delete" onClick={() => deleteActivity(a.id)}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
