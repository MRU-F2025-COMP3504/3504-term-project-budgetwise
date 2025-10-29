"use client";

import { useMemo, useState } from "react";
import Table from "../components/Table";

export default function TransactionsPage({ transactions }) {
  const rows = Array.isArray(transactions) ? transactions : [];

  // Key detection helpers to work with any schema
  const keyHints = useMemo(() => {
    const allKeys = Array.from(
      rows.reduce((set, r) => {
        Object.keys(r || {}).forEach((k) => set.add(k));
        return set;
      }, new Set())
    );

    const findKey = (regexList) =>
      allKeys.find((k) => regexList.some((re) => re.test(k))) || null;

    const dateKey = findKey([/^(post(ed|ing)_)?date$/i, /transaction.*date/i, /date/i, /created_at/i]);
    const amountKey = findKey([/^(amount|amt|value|total|balance)$/i, /(debit|credit)_?amount/i]);
    const typeKey = findKey([/^(type|transaction_?type)$/i, /(debit|credit)/i]);
    const descKey = findKey([/^(description|memo|narrative|details?)$/i, /merchant|payee/i]);
    const categoryKey = findKey([/^category$/i, /tag|group/i]);

    return { dateKey, amountKey, typeKey, descKey, categoryKey };
  }, [rows]);

  // Filters state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [type, setType] = useState("all"); // 'all' | 'debit' | 'credit'

  // Utility parsers
  const parseDate = (v) => {
    if (!v) return null;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  };

  const parseAmount = (v) => {
    if (v == null) return null;
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const cleaned = v.replace(/[^0-9.-]/g, "");
      const n = Number(cleaned);
      return isNaN(n) ? null : n;
    }
    return null;
  };

  const filtered = useMemo(() => {
    const sd = startDate ? new Date(startDate) : null;
    const ed = endDate ? new Date(endDate) : null;
    const minA = minAmount !== "" ? Number(minAmount) : null;
    const maxA = maxAmount !== "" ? Number(maxAmount) : null; // dual-thumb range

    return rows.filter((r) => {
      const { dateKey, amountKey, typeKey } = keyHints;

      // Date filter
      if (dateKey) {
        const d = parseDate(r[dateKey]);
        if (sd && (!d || d < sd)) return false;
        if (ed && (!d || d > ed)) return false;
      }

      // Amount filter
      if (minA != null || maxA != null) {
        const a = parseAmount(amountKey ? r[amountKey] : null);
        if (minA != null && (a == null || a < minA)) return false;
        if (maxA != null && (a == null || a > maxA)) return false;
      }

      // Type filter
      if (type !== "all") {
        let rowType = null;
        if (typeKey && r[typeKey] != null) {
          const t = String(r[typeKey]).toLowerCase();
          if (/debit|dr|-/.test(t)) rowType = "debit";
          else if (/credit|cr|\+/.test(t)) rowType = "credit";
        }
        if (!rowType) {
          const a = parseAmount(amountKey ? r[amountKey] : null);
          if (a != null) rowType = a < 0 ? "debit" : "credit";
        }
        if (rowType && rowType !== type) return false;
      }

      return true;
    });
  }, [rows, keyHints, startDate, endDate, minAmount, maxAmount, type]);

  const clear = () => {
    setStartDate("");
    setEndDate("");
    setMinAmount("");
    setMaxAmount("");
    setType("all");
  };

  return (
    <div className="bw-container">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <p className="bw-text-muted">All your parsed and categorized transactions.</p>
      </header>

      {/* Filters */}
      <div className="bw-card p-4 mb-4">
        <div className="grid md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs bw-text-muted mb-1">Type</label>
            <select
              className="w-full px-3 py-2 rounded-md bg-[var(--color-surface-2)] border border-white/10"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="debit">Debit (−)</option>
              <option value="credit">Credit (+)</option>
            </select>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs bw-text-muted mb-1">Start Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 rounded-md bg-[var(--color-surface-2)] border border-white/10"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs bw-text-muted mb-1">End Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 rounded-md bg-[var(--color-surface-2)] border border-white/10"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          {/* Amount slider (dual-thumb range) */}
          {(() => {
            // Compute amount domain from data
            const amounts = rows
              .map((r) => (keyHints.amountKey ? r[keyHints.amountKey] : null))
              .map((v) => {
                if (v == null) return null;
                if (typeof v === "number") return v;
                if (typeof v === "string") {
                  const n = Number(v.replace(/[^0-9.-]/g, ""));
                  return isNaN(n) ? null : n;
                }
                return null;
              })
              .filter((n) => typeof n === "number");

            let domainMin = amounts.length ? Math.min(...amounts) : 0;
            let domainMax = amounts.length ? Math.max(...amounts) : 1000;
            if (domainMin === domainMax) {
              const pad = Math.max(100, Math.abs(domainMax) * 0.1);
              domainMin -= pad;
              domainMax += pad;
            }

            const currMin = minAmount !== "" ? Number(minAmount) : domainMin;
            const currMax = maxAmount !== "" ? Number(maxAmount) : domainMax;
            const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

            const toCAD = (n) =>
              new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(n);

            const rangeSpan = domainMax - domainMin || 1;
            const leftPct = ((Math.min(currMin, currMax) - domainMin) / rangeSpan) * 100;
            const rightPct = 100 - ((Math.max(currMin, currMax) - domainMin) / rangeSpan) * 100;

            return (
              <>
                <div className="md:col-span-2">
                  <label className="block text-xs bw-text-muted mb-1">Amount Range (CAD)</label>
                  <div className="relative py-2">
                    {/* Highlighted selected range */}
                    <div
                      className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-white/10 rounded"
                      aria-hidden
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-1 bg-[var(--color-accent-2)] rounded"
                      style={{ left: `${leftPct}%`, right: `${rightPct}%` }}
                      aria-hidden
                    />
                    {/* Two thumbs over one track */}
                    <input
                      type="range"
                      min={domainMin}
                      max={domainMax}
                      step={0.01}
                      value={currMin}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        const next = clamp(Math.min(v, currMax), domainMin, domainMax);
                        setMinAmount(String(next));
                      }}
                      className="w-full cursor-pointer appearance-none bg-transparent relative z-10 accent-[var(--color-accent-2)]"
                    />
                    <input
                      type="range"
                      min={domainMin}
                      max={domainMax}
                      step={0.01}
                      value={currMax}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        const next = clamp(Math.max(v, currMin), domainMin, domainMax);
                        setMaxAmount(String(next));
                      }}
                      className="w-full cursor-pointer appearance-none bg-transparent relative -mt-6 z-20 accent-[var(--color-accent)]"
                    />
                  </div>
                  <div className="mt-1 text-xs font-mono flex justify-between items-center">
                    <span className="bw-text-muted">{toCAD(domainMin)}</span>
                    <span>{toCAD(Math.min(currMin, currMax))} — {toCAD(Math.max(currMin, currMax))}</span>
                    <span className="bw-text-muted">{toCAD(domainMax)}</span>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
        <div className="mt-3 flex justify-center gap-3">
          <button
            type="button"
            onClick={clear}
            className="px-3 py-2 rounded-md bg-[var(--color-surface-2)] border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors"
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* Table renders ALL fields dynamically */}
      <Table rows={filtered} emptyText="No transactions found." />
    </div>
  );
}
