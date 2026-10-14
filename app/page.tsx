const metrics = [
  { label: "Today's service charges", value: "₹ —", note: "Will calculate from posted transactions" },
  { label: "Centre funds", value: "₹ —", note: "Cash + wallets + centre bank" },
  { label: "Credit outstanding", value: "₹ —", note: "Receivables, not cash in hand" },
  { label: "Advances held", value: "₹ —", note: "Outstanding customer advances" }
];

const modules = [
  ["01", "Counter & customers", "Record services with separate department fee and service charge. GST is optional for customers who do not have GST."],
  ["02", "Money destinations", "Record where money actually went: centre cash, E-district, CSC, centre bank or personal GPay."],
  ["03", "Daily closing", "Reconcile actual balance movement against explicitly recorded receipts and payments."],
  ["04", "Credit & advances", "Track partial repayments and advance usage without counting receivables as cash."],
  ["05", "Staff & operations", "Separate staff access, salaries, leave, expenses and activity history."],
  ["06", "Reports & backups", "Date-wise reports, exports and a documented restore process."]
];

export default function Home() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">AKSHAYA <span style={{ color: "#77c8b3" }}>CENTRE</span></div>
        <div className="brand-sub">THRIKKADEERI · NEW SYSTEM</div>
        <nav className="nav" aria-label="Main navigation">
          <div className="nav-item active">◫ &nbsp; Overview</div>
          <div className="nav-item">▦ &nbsp; Counter</div>
          <div className="nav-item">⇄ &nbsp; Transactions</div>
          <div className="nav-item">▤ &nbsp; Daily closing</div>
          <div className="nav-item">◷ &nbsp; Credit & advances</div>
          <div className="nav-item">♙ &nbsp; Staff</div>
          <div className="nav-item">▧ &nbsp; Expenses</div>
          <div className="nav-item">▥ &nbsp; Reports</div>
          <div className="nav-item">⚙ &nbsp; Settings</div>
        </nav>
        <div className="sidebar-note">Foundation build<br />Demo interface only. No production connection and no real customer data.</div>
      </aside>
      <main className="main">
        <div className="topline">
          <div><div className="eyebrow">Centre operations / Overview</div><h1>Good morning</h1></div>
          <span className="pill">● Development build</span>
        </div>
        <section className="welcome">
          <div>
            <h2>Your centre. One clear picture.</h2>
            <p>A new management system designed around the way an Akshaya centre actually handles service charges, department payments, advances, credit and daily balances.</p>
          </div>
          <div className="welcome-mark" aria-hidden="true">✳</div>
        </section>
        <section className="grid" aria-label="Dashboard metrics">
          {metrics.map((m) => <article className="metric" key={m.label}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value">{m.value}</div>
            <div className="metric-note">{m.note}</div>
          </article>)}
        </section>
        <section className="panel-row">
          <article className="panel">
            <h3>System modules</h3>
            {modules.map(([num, title, desc]) => <div className="step" key={num}>
              <div className="step-num">{num}</div><div><strong>{title}</strong><p>{desc}</p></div>
            </div>)}
          </article>
          <article className="panel">
            <h3>Build status</h3>
            <div className="status-list">
              <div className="status"><span className="status-dot" /><div><strong>Architecture selected</strong><br />Next.js + TypeScript + Neon PostgreSQL + Drizzle ORM.</div></div>
              <div className="status"><span className="status-dot" /><div><strong>Accounting rules separated</strong><br />Core calculations are isolated from the interface and use paise for money arithmetic.</div></div>
              <div className="status"><span className="status-dot pending" /><div><strong>Database not connected</strong><br />Create a fresh Neon database before applying migrations.</div></div>
              <div className="status"><span className="status-dot pending" /><div><strong>Authentication not yet enabled</strong><br />Staff accounts and role permissions must be implemented before live use.</div></div>
              <div className="status"><span className="status-dot pending" /><div><strong>Not deployed</strong><br />No GitHub push, Vercel deployment or production data changes have been made.</div></div>
            </div>
          </article>
        </section>
        <div className="footer">Version 0.1 foundation · Built for separate development and testing. Dashboard figures are intentionally blank until tested data and the database are connected.</div>
      </main>
    </div>
  );
}
