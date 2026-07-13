"use client";
// ============================================================
// app/classes/page.js  →  becomes the URL  /classes
// ------------------------------------------------------------
// Records the courses taken each semester.
// Deliberately uses the SAME patterns as the ledger page
// (load → summarize → add → delete), so you can compare the
// two files side by side and see the repeating shape of a
// CRUD page. Spotting that pattern IS the lesson.
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

const GRADES = ["In progress", "A+", "A", "A-", "B+", "B", "B-", "C+", "C", "D", "F"];

const DEMO_DATA = [
  { id: 1, code: "EC1101", name: "Introduction to Economic Analysis", semester: "Y1S1", credits: 4, grade: "A-" },
  { id: 2, code: "EC2102", name: "Macroeconomic Analysis I", semester: "Y1S2", credits: 4, grade: "In progress" },
  { id: 3, code: "MA1521", name: "Calculus for Computing", semester: "Y1S1", credits: 4, grade: "B+" },
];

export default function ClassesPage() {
  const demoMode = supabase === null;

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [semester, setSemester] = useState("");
  const [credits, setCredits] = useState("4");
  const [grade, setGrade] = useState("In progress");

  // ---------- LOAD ----------
  useEffect(() => {
    async function load() {
      if (demoMode) {
        setClasses(DEMO_DATA);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .order("semester", { ascending: true });
      if (error) console.error("Load failed:", error.message);
      setClasses(data ?? []);
      setLoading(false);
    }
    load();
  }, [demoMode]);

  // ---------- SUMMARY: total credits taken ----------
  const totalCredits = useMemo(
    () => classes.reduce((sum, c) => sum + (c.credits || 0), 0),
    [classes]
  );

  // ---------- ADD ----------
  async function addClass() {
    if (!code.trim() || !name.trim() || !semester.trim()) {
      alert("Please fill in course code, name, and semester.");
      return;
    }
    const newRow = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      semester: semester.trim().toUpperCase(),
      credits: parseInt(credits) || 0,
      grade,
    };

    if (demoMode) {
      setClasses([...classes, { ...newRow, id: Date.now() }]);
    } else {
      const { data, error } = await supabase
        .from("classes")
        .insert(newRow)
        .select()
        .single();
      if (error) {
        alert("Save failed: " + error.message);
        return;
      }
      setClasses([...classes, data]);
    }
    setCode("");
    setName("");
  }

  // ---------- DELETE ----------
  async function deleteClass(id) {
    if (!demoMode) {
      const { error } = await supabase.from("classes").delete().eq("id", id);
      if (error) {
        alert("Delete failed: " + error.message);
        return;
      }
    }
    setClasses(classes.filter((c) => c.id !== id));
  }

  return (
    <main className="wrap">
      <header className="header">
        <h1>Classes</h1>
        <p className="tagline">Courses taken — my human capital investment record</p>
        {demoMode && (
          <p className="demo-banner">
            Demo mode: data is not saved. Connect Supabase (see README) to make it real.
          </p>
        )}
      </header>

      <section className="cards">
        <div className="card">
          <span className="card-label">Courses</span>
          <span className="card-value">{classes.length}</span>
        </div>
        <div className="card">
          <span className="card-label">Total credits</span>
          <span className="card-value">{totalCredits}</span>
        </div>
      </section>

      <section className="panel">
        <h2>Add a course</h2>
        <div className="form-row">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Code, e.g. EC1101"
            style={{ flex: 1, minWidth: 120 }}
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Course name"
            style={{ flex: 3, minWidth: 200 }}
          />
        </div>
        <div className="form-row">
          <input
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            placeholder="Semester, e.g. Y1S2"
            style={{ flex: 1, minWidth: 110 }}
          />
          <input
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            placeholder="Credits"
            type="number"
            min="0"
            style={{ flex: 1, minWidth: 90 }}
          />
          <select value={grade} onChange={(e) => setGrade(e.target.value)}>
            {GRADES.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          <button onClick={addClass}>Add</button>
        </div>
      </section>

      <section className="panel">
        <h2>Transcript</h2>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : classes.length === 0 ? (
          <p className="muted">No courses yet. Add your first one above.</p>
        ) : (
          <ul className="ledger">
            {classes.map((c) => (
              <li key={c.id} className="ledger-row">
                <div className="ledger-main">
                  <span className="ledger-title">
                    {c.code} — {c.name}
                  </span>
                  <span className="ledger-meta">
                    {c.semester} · {c.credits} credits
                  </span>
                </div>
                <span className="ledger-amount">{c.grade}</span>
                <button className="delete-btn" title="Delete" onClick={() => deleteClass(c.id)}>
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
