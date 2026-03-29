import Link from "next/link";

const petrol = "#1A6B5A";
const petrolLight = "#2A8F78";
const petrolPale = "#E6F5F1";
const ink = "#1C2024";
const inkSoft = "#4A5056";
const inkMuted = "#8B9299";
const surface = "#FAFAF8";
const cardBg = "#FFFFFF";
const border = "#E8E8E4";

const RETRO_CARDS = [
  {
    type: "went",
    accent: "#2D9B6E",
    bg: "#EEFBF4",
    bdr: "#C2EDCF",
    icon: "✓",
    label: "Co šlo dobře",
    text: "Pair programming na auth modulu byl super produktivní.",
    author: "Tomáš K.",
    votes: 7,
  },
  {
    type: "improve",
    accent: "#D9534F",
    bg: "#FEF1F0",
    bdr: "#F5C6C4",
    icon: "△",
    label: "Co zlepšit",
    text: "Code review trvají příliš dlouho — 2+ dny na approval.",
    author: "Jana M.",
    votes: 12,
  },
  {
    type: "action",
    accent: "#C78C20",
    bg: "#FFF8EB",
    bdr: "#F0DDA8",
    icon: "→",
    label: "Akční bod",
    text: "Zavést max 24h SLA na code review, rotovat reviewery.",
    author: "Petr S.",
    votes: 5,
  },
];

function RekapkaLogo({ dark = false }: { dark?: boolean }) {
  const color = dark ? "#fff" : petrol;
  const mirrorColor = dark ? "rgba(255,255,255,0.18)" : "rgba(26,107,90,0.18)";
  const lineColor = dark ? "rgba(255,255,255,0.12)" : "rgba(26,107,90,0.12)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={36} height={36} viewBox="0 0 52 52" fill="none">
        <text x="6" y="39" fontFamily="'Sora', sans-serif" fontWeight="700" fontSize="36" fill={color}>R</text>
        <line x1="28" y1="6" x2="28" y2="46" stroke={lineColor} strokeWidth="1.5" strokeDasharray="3 4" />
        <g transform="translate(50,0) scale(-1,1)">
          <text x="6" y="39" fontFamily="'Sora', sans-serif" fontWeight="700" fontSize="36" fill={mirrorColor}>R</text>
        </g>
      </svg>
      <span style={{
        fontFamily: "'Sora', sans-serif",
        fontWeight: 700,
        fontSize: 22,
        letterSpacing: -0.5,
        color: dark ? "#fff" : ink,
      }}>rekapka</span>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div style={{ background: surface, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: ink }}>

      {/* Header */}
      <header style={{
        borderBottom: `1px solid ${border}`,
        padding: "0 24px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: cardBg,
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}>
        <RekapkaLogo />
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/login" style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            color: petrol,
            padding: "8px 16px",
            borderRadius: 8,
            textDecoration: "none",
            transition: "background 0.15s",
          }}>
            Přihlásit se
          </Link>
          <Link href="/signup" style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            color: "#fff",
            background: petrol,
            padding: "8px 20px",
            borderRadius: 8,
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(26,107,90,0.20)",
          }}>
            Začít zdarma
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: "72px 24px 64px", textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: petrolPale,
          border: `1px solid ${petrolLight}40`,
          borderRadius: 100,
          padding: "6px 14px",
          marginBottom: 28,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: petrol, display: "inline-block" }} />
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 600, color: petrol, letterSpacing: 0.3 }}>
            Retrospektivy pro agile týmy
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Sora', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(32px, 6vw, 52px)",
          lineHeight: 1.15,
          letterSpacing: -1,
          color: ink,
          marginBottom: 20,
        }}>
          Retros, které <span style={{ color: petrol }}>skutečně</span>
          <br />posouvají týmy dál
        </h1>

        <p style={{
          fontSize: 17,
          lineHeight: 1.7,
          color: inkSoft,
          maxWidth: 520,
          margin: "0 auto 36px",
        }}>
          Mobilní retrospektivní nástroj s real-time spoluprací,
          AI seskupováním karet a akcemi, které se nezapomínají.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/signup" style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            color: "#fff",
            background: petrol,
            padding: "12px 28px",
            borderRadius: 10,
            textDecoration: "none",
            boxShadow: "0 4px 16px rgba(26,107,90,0.25)",
          }}>
            Začít první retro →
          </Link>
          <Link href="/login" style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            color: petrol,
            background: petrolPale,
            border: `1.5px solid ${petrolLight}50`,
            padding: "12px 28px",
            borderRadius: 10,
            textDecoration: "none",
          }}>
            Přihlásit se
          </Link>
        </div>
      </section>

      {/* Card preview */}
      <section style={{
        background: ink,
        padding: "48px 24px",
        overflow: "hidden",
      }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <RekapkaLogo dark />
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 10, fontFamily: "'DM Sans', sans-serif" }}>
              Reflektuj · Diskutuj · Posuň se dál
            </p>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}>
            {RETRO_CARDS.map((c) => (
              <div key={c.type} style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: 14,
                padding: "14px 16px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 6,
                    background: c.accent, color: "#fff",
                    fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontFamily: "'Sora', sans-serif", flexShrink: 0,
                  }}>{c.icon}</span>
                  <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" as const, color: c.accent }}>
                    {c.label}
                  </span>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.55, color: "rgba(255,255,255,0.72)", margin: "0 0 12px" }}>
                  {c.text}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{c.author}</span>
                  <span style={{
                    fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 600,
                    color: c.accent, background: `${c.accent}20`,
                    border: `1px solid ${c.accent}40`,
                    borderRadius: 7, padding: "3px 9px",
                    display: "flex", alignItems: "center", gap: 4,
                  }}>▲ {c.votes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "72px 24px", maxWidth: 880, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{
            fontFamily: "'Sora', sans-serif", fontSize: 11, letterSpacing: 3,
            textTransform: "uppercase" as const, color: inkMuted,
          }}>Proč rekapka</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {[
            { icon: "⚡", title: "Real-time spolupráce", desc: "Sleduj přidávání karet živě, hlasujte společně a diskutujte v reálném čase." },
            { icon: "🤖", title: "AI seskupování", desc: "Automaticky shlukuje karty podle témat, aby se tým mohl soustředit na to podstatné." },
            { icon: "✅", title: "Sledování akcí", desc: "Diskuse se promění v akční body s přiřazením a termíny, které se přenášejí." },
          ].map((f) => (
            <div key={f.title} style={{
              background: cardBg,
              border: `1.5px solid ${border}`,
              borderRadius: 14,
              padding: "24px 22px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{
                fontFamily: "'Sora', sans-serif", fontWeight: 600,
                fontSize: 15, color: ink, marginBottom: 8,
              }}>{f.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: inkSoft }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${border}`,
        padding: "24px",
        textAlign: "center",
        color: inkMuted,
        fontSize: 13,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <RekapkaLogo />
        <p style={{ marginTop: 12, color: inkMuted }}>Retrospektiva pro týmy. Reflektuj · Diskutuj · Posuň se dál.</p>
      </footer>
    </div>
  );
}
