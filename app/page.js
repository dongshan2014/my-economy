"use client";
// ============================================================
// app/page.js — the home page (the whole app, for now)
// ------------------------------------------------------------
// "use client" means this component runs in the browser, so it
// can use state (useState) and react to clicks and typing.
//
// WHAT THIS PAGE DOES
//   1. Loads your transactions (income & expenses) from Supabase
//   2. Shows your balance, total income, total spending
//   3. Lets you add a new transaction with a small form
//
// If Supabase isn't set up yet, it runs in DEMO MODE with
// sample data so you can explore immediately.
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

// Categories are a tiny taste of how economists classify spending.
// Add your own! (Ideas: Rent, Investing, Charity, Emergency Fund)
const CATEGORIES = ["Food", "Transport", "Books", "Fun", "Savings", "Income", "Other"];

// Sample data for demo mode (before Supabase is connected)
const DEMO_DATA = [
  { id: 1, title: "Monthly allowance", amount: 500, category: "Income", created_at: "2026-07-01" },
  { id: 2, title: "Economics textbook", amount: -68.5, category: "Books", created_at: "2026-07-03" },
  { id: 3, title: "MRT card top-up", amount: -30, category: "Transport", created_at: "2026-07-05" },
  { id: 4, title: "Chicken rice with friends", amount: -6.8, category: "Food", created_at: "2026-07-08" },
  { id: 5, title: "Transfer to savings", amount: -100, category: "Savings", created_at: "2026-07-10" },
];

export default function HomePage() {
  const demoMode = supabase === null;

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [isIncome, setIsIncome] = useState(false);

  // ---------- 1. LOAD data when the page opens ----------
  useEffect(() => {
    async function load() {
      if (demoMode) {
        setTransactions(DEMO_DATA);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error("Load failed:", error.message);
      setTransactions(data ?? []);
      setLoading(false);
    }
    load();
  }, [demoMode]);

  // ---------- 2. SUMMARY numbers (recomputed automatically) ----------
  const { income, spending, balance } = useMemo(() => {
    let income = 0;
    let spending = 0;
    for (const t of transactions) {
      if (t.amount >= 0) income += t.amount;
      else spending += -t.amount;
    }
    return { income, spending, balance: income - spending };
  }, [transactions]);

  // ---------- 3. ADD a transaction ----------
  async function addTransaction() {
    const value = parseFloat(amount);
    if (!title.trim() || isNaN(value) || value <= 0) {
      alert("Please enter a description and a positive amount.");
      return;
    }
    // Convention: income is positive, spending is negative.
    const signedAmount = isIncome ? value : -value;

    const newRow = {
      title: title.trim(),
      amount: signedAmount,
      category: isIncome ? "Income" : category,
    };

    if (demoMode) {
      // Demo mode: keep it in memory only (lost on refresh)
      setTransactions([
        { ...newRow, id: Date.now(), created_at: new Date().toISOString() },
        ...transactions,
      ]);
    } else {
      const { data, error } = await supabase
        .from("transactions")
        .insert(newRow)
        .select()
        .single();
      if (error) {
        alert("Save failed: " + error.message);
        return;
      }
      setTransactions([data, ...transactions]);
    }

    // Clear the form
    setTitle("");
    setAmount("");
  }

  // ---------- 4. DELETE a transaction ----------
  async function deleteTransaction(id) {
    if (!demoMode) {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) {
        alert("Delete failed: " + error.message);
        return;
      }
    }
    setTransactions(transactions.filter((t) => t.id !== id));
  }

  const fmt = (n) =>
    n.toLocaleString("en-SG", { style: "currency", currency: "SGD" });

  // ---------- 5. THE PAGE ITSELF (JSX = HTML inside JavaScript) ----------
  return (
    <main className="wrap">
      <header className="header">
        <h1>Ledger</h1>
        <p className="tagline">A personal ledger — where economics meets real life</p>
        {demoMode && (
          <p className="demo-banner">
            Demo mode: data is not saved. Connect Supabase (see README) to make it real.
          </p>
        )}
      </header>

      {/* ---- Summary cards ---- */}
      <section className="cards">
        <div className="card">
          <span className="card-label">Balance</span>
          <span className={"card-value " + (balance >= 0 ? "pos" : "neg")}>
            {fmt(balance)}
          </span>
        </div>
        <div className="card">
          <span className="card-label">Income</span>
          <span className="card-value pos">{fmt(income)}</span>
        </div>
        <div className="card">
          <span className="card-label">Spending</span>
          <span className="card-value neg">{fmt(spending)}</span>
        </div>
      </section>

      {/* ---- Add transaction form ---- */}
      <section className="panel">
        <h2>Add a transaction</h2>
        <div className="form-row">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What was it? e.g. Lunch at hawker centre"
          />
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            type="number"
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-row">
          <label className="toggle">
            <input
              type="checkbox"
              checked={isIncome}
              onChange={(e) => setIsIncome(e.target.checked)}
            />
            This is income
          </label>
          {!isIncome && (
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.filter((c) => c !== "Income").map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          )}
          <button onClick={addTransaction}>Add</button>
        </div>
      </section>

      {/* ---- Transaction list ---- */}
      <section className="panel">
        <h2>Ledger</h2>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : transactions.length === 0 ? (
          <p className="muted">No transactions yet. Add your first one above.</p>
        ) : (
          <ul className="ledger">
            {transactions.map((t) => (
              <li key={t.id} className="ledger-row">
                <div className="ledger-main">
                  <span className="ledger-title">{t.title}</span>
                  <span className="ledger-meta">
                    {t.category} · {String(t.created_at).slice(0, 10)}
                  </span>
                </div>
                <span className={"ledger-amount " + (t.amount >= 0 ? "pos" : "neg")}>
                  {t.amount >= 0 ? "+" : ""}
                  {fmt(t.amount)}
                </span>
                <button
                  className="delete-btn"
                  title="Delete"
                  onClick={() => deleteTransaction(t.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="footer">
        Built while learning Next.js · Supabase · Vercel — see README for what to build next
      </footer>
    </main>
  );
}
