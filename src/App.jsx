import { useState, useEffect, useCallback } from "react";

const ADMIN_PASSWORD = "admin2025";

const SAMPLE_MOMS = [
  {
    id: "1",
    name: "María González",
    description: "Mamá de 3 hijos, cocinera increíble y siempre con una sonrisa",
    photo: "https://api.dicebear.com/7.x/personas/svg?seed=Maria&backgroundColor=ffdfbf",
    votes: 0,
    voters: [],
  },
  {
    id: "2",
    name: "Carmen López",
    description: "Trabajadora incansable que nunca deja de dar amor a su familia",
    photo: "https://api.dicebear.com/7.x/personas/svg?seed=Carmen&backgroundColor=ffd5e8",
    votes: 0,
    voters: [],
  },
  {
    id: "3",
    name: "Ana Martínez",
    description: "Artista y maestra, inspira creatividad en todos sus hijos",
    photo: "https://api.dicebear.com/7.x/personas/svg?seed=Ana&backgroundColor=d5f5e3",
    votes: 0,
    voters: [],
  },
];

// ─── Tiny helpers ────────────────────────────────────────────────────────────
function getVoterId() {
  let id = localStorage.getItem("voterId");
  if (!id) {
    id = "voter_" + Math.random().toString(36).slice(2, 11);
    localStorage.setItem("voterId", id);
  }
  return id;
}

function flowerIcon(size = 20) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C10.3 2 9 3.3 9 5c0 .9.4 1.7 1 2.3C8.4 7.1 7 8.4 7 10c0 1.3.8 2.5 2 3.1-.2.6-.4 1.2-.4 1.9 0 1.9 1.3 3.5 3 4V21h.8v-2c1.7-.5 3-2.1 3-4 0-.7-.2-1.3-.4-1.9 1.2-.6 2-1.8 2-3.1 0-1.6-1.4-2.9-3-2.7.6-.6 1-1.4 1-2.3 0-1.7-1.3-3-3-3z"/>
    </svg>
  );
}

// ─── Pages ───────────────────────────────────────────────────────────────────

function HeroHeader({ page, setPage }) {
  return (
    <header style={{
      background: "linear-gradient(160deg, #1a3a5c 0%, #1e5799 35%, #2e86c1 65%, #5dade2 100%)",
      padding: "0",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative crosses / circles inspired by NCW */}
      {["8%","25%","50%","72%","90%"].map((left, i) => (
        <div key={i} style={{
          position: "absolute",
          left,
          top: i % 2 === 0 ? "-14px" : "auto",
          bottom: i % 2 !== 0 ? "-14px" : "auto",
          width: 55 + i * 12,
          height: 55 + i * 12,
          borderRadius: i % 3 === 0 ? "50%" : "30% 70% 70% 30% / 30% 30% 70% 70%",
          background: "rgba(255,255,255,0.06)",
          transform: `rotate(${i * 40}deg)`,
        }} />
      ))}
      {/* Golden accent bar */}
      <div style={{ height: 4, background: "linear-gradient(90deg, #c9a227, #f0d060, #c9a227)", width: "100%" }} />

      <div style={{ position: "relative", zIndex: 1, padding: "24px 24px 14px", textAlign: "center" }}>
        {/* NCW-style cross + fish ichthys symbol */}
        <p style={{ color: "rgba(255,255,255,0.65)", margin: "0 0 4px", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 }}>
          Comunidad 10 · Camino Neocatecumenal
        </p>
        <h1 style={{
          fontFamily: "'Georgia', serif",
          fontSize: "clamp(18px, 4.5vw, 30px)",
          color: "#fff",
          margin: "4px 0 2px",
          letterSpacing: "0.04em",
          textShadow: "0 2px 14px rgba(0,0,0,0.4)",
        }}>
          Concurso Día de la Madre 🌸
        </h1>
        <p style={{ color: "rgba(255,220,100,0.95)", margin: "4px 0 0", fontSize: 13, fontStyle: "italic", fontFamily: "'Georgia',serif" }}>
          ¡Vota por la foto más especial y creativa!
        </p>
      </div>

      {/* Nav */}
      <nav style={{
        display: "flex",
        justifyContent: "center",
        gap: 6,
        padding: "10px 16px 18px",
        position: "relative",
        zIndex: 1,
        flexWrap: "wrap",
      }}>
        {[
          { id: "vote", label: "📸 Votar" },
          { id: "results", label: "🏆 Resultados" },
          { id: "admin", label: "⚙️ Admin" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setPage(tab.id)}
            style={{
              padding: "8px 20px",
              borderRadius: 50,
              border: page === tab.id ? "2px solid #f0d060" : "2px solid rgba(255,255,255,0.4)",
              background: page === tab.id ? "rgba(201,162,39,0.3)" : "transparent",
              color: page === tab.id ? "#f0d060" : "#fff",
              fontWeight: page === tab.id ? "700" : "400",
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s",
              backdropFilter: "blur(4px)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      {/* Golden bottom accent */}
      <div style={{ height: 3, background: "linear-gradient(90deg, transparent, #c9a227, #f0d060, #c9a227, transparent)" }} />
    </header>
  );
}

// ── VOTE PAGE ──────────────────────────────────────────────────────────────
function VotePage({ moms, votingOpen, votingDeadline, onVote }) {
  const voterId = getVoterId();
  const hasVoted = moms.some(m => m.voters?.includes(voterId));
  const votedFor = moms.find(m => m.voters?.includes(voterId));
  const [justVoted, setJustVoted] = useState(null);

  const handleVote = (mom) => {
    setJustVoted(mom.id);
    onVote(mom.id);
    setTimeout(() => setJustVoted(null), 1500);
  };

  const deadlineStr = votingDeadline
    ? new Date(votingDeadline).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div style={{ padding: "20px 16px", maxWidth: 700, margin: "0 auto" }}>
      {/* Status banner */}
      <div style={{
        background: votingOpen ? "linear-gradient(90deg,#e8f0fe,#c5d8f7)" : "linear-gradient(90deg,#fce4ec,#ffcdd2)",
        borderRadius: 14,
        padding: "12px 18px",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 14,
        color: votingOpen ? "#1a3a5c" : "#880e4f",
        fontWeight: 600,
      }}>
        <span style={{ fontSize: 22 }}>{votingOpen ? "✅" : "🔒"}</span>
        <div>
          {votingOpen ? "¡Las votaciones están abiertas!" : "Las votaciones están cerradas."}
          {deadlineStr && votingOpen && (
            <span style={{ fontWeight: 400, marginLeft: 6, color: "#1e5799" }}>
              Cierra el {deadlineStr}
            </span>
          )}
        </div>
      </div>

      {hasVoted && (
        <div style={{
          background: "linear-gradient(90deg,#e8f0fe,#c5d8f7)",
          borderRadius: 14,
          padding: "12px 18px",
          marginBottom: 20,
          fontSize: 14,
          color: "#1a3a5c",
          fontWeight: 600,
          textAlign: "center",
          border: "1px solid #a8c8f0",
        }}>
          🙏 Ya votaste por <strong>{votedFor?.name}</strong>.
        </div>
      )}

      {moms.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#aaa" }}>
          <div style={{ fontSize: 48 }}>📸</div>
          <p style={{ fontSize: 16, marginTop: 12 }}>Aún no hay fotos registradas.</p>
          <p style={{ fontSize: 13, color: "#ccc" }}>El administrador debe agregar participantes primero.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {moms.map((mom, i) => {
            const alreadyVotedThis = mom.voters?.includes(voterId);
            return (
              <div
                key={mom.id}
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  overflow: "hidden",
                  boxShadow: alreadyVotedThis
                    ? "0 0 0 3px #2e86c1, 0 4px 20px rgba(46,134,193,0.25)"
                    : "0 2px 16px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  animation: `fadeIn 0.4s ease ${i * 0.08}s both`,
                }}
              >
                <div style={{
                  width: "100%",
                  height: 180,
                  background: "#eaf2fb",
                  overflow: "hidden",
                  position: "relative",
                }}>
                  <img
                    src={mom.photo}
                    alt={mom.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => { e.target.src = `https://api.dicebear.com/7.x/personas/svg?seed=${mom.id}`; }}
                  />
                  {alreadyVotedThis && (
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "rgba(30,87,153,0.18)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{ fontSize: 42 }}>🙏</span>
                    </div>
                  )}
                </div>

                <div style={{ padding: "14px 14px 16px" }}>
                  <h3 style={{
                    fontFamily: "'Georgia', serif",
                    fontSize: 15,
                    margin: "0 0 6px",
                    color: "#1a3a5c",
                  }}>{mom.name}</h3>
                  <p style={{ fontSize: 12, color: "#888", margin: "0 0 12px", lineHeight: 1.4 }}>
                    {mom.description}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "#2e86c1", fontWeight: 700 }}>
                      {mom.votes} {mom.votes === 1 ? "voto" : "votos"}
                    </span>
                    <button
                      onClick={() => handleVote(mom)}
                      disabled={!votingOpen || hasVoted}
                      style={{
                        background: alreadyVotedThis
                          ? "linear-gradient(135deg, #2e86c1, #1a3a5c)"
                          : (!votingOpen || hasVoted)
                            ? "#eee"
                            : "linear-gradient(135deg, #5dade2, #2e86c1)",
                        color: (!votingOpen || hasVoted) && !alreadyVotedThis ? "#aaa" : "#fff",
                        border: "none",
                        borderRadius: 50,
                        padding: "7px 14px",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: (!votingOpen || hasVoted) ? "not-allowed" : "pointer",
                        transition: "all 0.2s",
                        transform: justVoted === mom.id ? "scale(1.1)" : "scale(1)",
                      }}
                    >
                      {alreadyVotedThis ? "✓ Tu voto" : "📸 Votar"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── RESULTS PAGE ──────────────────────────────────────────────────────────
function ResultsPage({ moms, votingOpen, votingDeadline }) {
  const sorted = [...moms].sort((a, b) => b.votes - a.votes);
  const maxVotes = sorted[0]?.votes || 1;
  const deadlineStr = votingDeadline
    ? new Date(votingDeadline).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : null;

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div style={{ padding: "20px 16px", maxWidth: 640, margin: "0 auto" }}>
      <div style={{
        background: votingOpen ? "linear-gradient(90deg,#e8f0fe,#c5d8f7)" : "linear-gradient(90deg,#fff8e1,#fff3cd)",
        borderRadius: 14,
        padding: "14px 18px",
        marginBottom: 24,
        textAlign: "center",
        fontSize: 14,
        color: votingOpen ? "#1a3a5c" : "#7d5c00",
        fontWeight: 600,
        border: votingOpen ? "1px solid #a8c8f0" : "1px solid #f0d060",
      }}>
        {votingOpen ? (
          <>⏳ Votaciones en curso{deadlineStr ? ` · Cierra el ${deadlineStr}` : ""}. Resultados parciales:</>
        ) : (
          <>✝️ ¡Votaciones cerradas! Resultados finales de la Comunidad 10:</>
        )}
      </div>

      {sorted.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#aaa" }}>
          <div style={{ fontSize: 48 }}>📊</div>
          <p>No hay participantes aún.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sorted.map((mom, i) => {
            const pct = maxVotes > 0 ? (mom.votes / maxVotes) * 100 : 0;
            const isWinner = i === 0 && !votingOpen && mom.votes > 0;

            return (
              <div
                key={mom.id}
                style={{
                  background: isWinner
                    ? "linear-gradient(135deg, #fff8e1, #fef9c3)"
                    : "#fff",
                  borderRadius: 16,
                  padding: "14px 16px",
                  boxShadow: isWinner
                    ? "0 0 0 2px #c9a227, 0 4px 20px rgba(201,162,39,0.25)"
                    : "0 2px 12px rgba(0,0,0,0.07)",
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  animation: `fadeIn 0.4s ease ${i * 0.1}s both`,
                }}
              >
                <div style={{ fontSize: 28, minWidth: 36, textAlign: "center" }}>
                  {medals[i] || `#${i + 1}`}
                </div>

                <img
                  src={mom.photo}
                  alt={mom.name}
                  style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "2px solid #5dade2" }}
                  onError={e => { e.target.src = `https://api.dicebear.com/7.x/personas/svg?seed=${mom.id}`; }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontFamily: "'Georgia',serif", fontWeight: 700, color: "#1a3a5c", fontSize: 14 }}>
                      {mom.name} {isWinner ? "👑" : ""}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#2e86c1" }}>
                      {mom.votes} {mom.votes === 1 ? "voto" : "votos"}
                    </span>
                  </div>
                  <div style={{ background: "#dbeafe", borderRadius: 99, height: 8, overflow: "hidden" }}>
                    <div style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: isWinner
                        ? "linear-gradient(90deg, #c9a227, #f0d060)"
                        : "linear-gradient(90deg, #5dade2, #1e5799)",
                      borderRadius: 99,
                      transition: "width 0.8s ease",
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!votingOpen && sorted[0]?.votes > 0 && (
        <div style={{
          marginTop: 28,
          textAlign: "center",
          padding: "28px 20px",
          background: "linear-gradient(135deg, #1a3a5c, #2e86c1)",
          borderRadius: 20,
          color: "#fff",
          border: "3px solid #c9a227",
        }}>
          <div style={{ fontSize: 48 }}>👑✝️</div>
          <h2 style={{ fontFamily: "'Georgia',serif", margin: "10px 0 4px", fontSize: 22, color: "#f0d060" }}>
            ¡Gloria a Dios!
          </h2>
          <p style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700 }}>{sorted[0].name}</p>
          <p style={{ margin: "4px 0 0", fontSize: 14, opacity: 0.85 }}>
            Ganadora con {sorted[0].votes} votos 🙏
          </p>
          <p style={{ margin: "12px 0 0", fontSize: 12, fontStyle: "italic", opacity: 0.7, color: "#f0d060" }}>
            Comunidad 10 · Camino Neocatecumenal
          </p>
        </div>
      )}
    </div>
  );
}

// ── ADMIN PAGE ─────────────────────────────────────────────────────────────
function AdminPage({ moms, setMoms, votingOpen, setVotingOpen, votingDeadline, setVotingDeadline, saveData }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState("");
  const [deadline, setDeadline] = useState(votingDeadline ? votingDeadline.slice(0, 16) : "");

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(false); }
    else { setPwError(true); }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target.result);
      setPhotoPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (!name.trim()) { setMsg("❌ El nombre es obligatorio."); return; }
    setAdding(true);
    const newMom = {
      id: Date.now().toString(),
      name: name.trim(),
      description: desc.trim(),
      photo: photo || `https://api.dicebear.com/7.x/personas/svg?seed=${Date.now()}`,
      votes: 0,
      voters: [],
    };
    const updated = [...moms, newMom];
    setMoms(updated);
    saveData({ moms: updated, votingOpen, votingDeadline });
    setName(""); setDesc(""); setPhoto(""); setPhotoPreview("");
    setMsg("✅ Participante agregada exitosamente.");
    setAdding(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleRemove = (id) => {
    const updated = moms.filter(m => m.id !== id);
    setMoms(updated);
    saveData({ moms: updated, votingOpen, votingDeadline });
  };

  const handleResetVotes = (id) => {
    const updated = moms.map(m => m.id === id ? { ...m, votes: 0, voters: [] } : m);
    setMoms(updated);
    saveData({ moms: updated, votingOpen, votingDeadline });
  };

  const handleToggleVoting = () => {
    const newOpen = !votingOpen;
    setVotingOpen(newOpen);
    saveData({ moms, votingOpen: newOpen, votingDeadline });
  };

  const handleSetDeadline = () => {
    const dl = deadline ? new Date(deadline).toISOString() : null;
    setVotingDeadline(dl);
    saveData({ moms, votingOpen, votingDeadline: dl });
    setMsg("✅ Fecha límite guardada.");
    setTimeout(() => setMsg(""), 2500);
  };

  if (!authed) {
    return (
      <div style={{ padding: "40px 24px", maxWidth: 380, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✝️</div>
        <h2 style={{ fontFamily: "'Georgia',serif", color: "#1a3a5c", marginBottom: 4 }}>Panel Admin</h2>
        <p style={{ color: "#aaa", fontSize: 14, marginBottom: 24 }}>Ingresa la contraseña para continuar</p>
        <input
          type="password"
          value={pw}
          onChange={e => { setPw(e.target.value); setPwError(false); }}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          placeholder="Contraseña"
          style={{
            width: "100%", padding: "12px 16px", borderRadius: 12,
            border: pwError ? "2px solid #e74c3c" : "2px solid #a8c8f0",
            fontSize: 16, marginBottom: 10, boxSizing: "border-box",
            outline: "none",
          }}
        />
        {pwError && <p style={{ color: "#e74c3c", fontSize: 13, marginBottom: 10 }}>Contraseña incorrecta</p>}
        <button
          onClick={handleLogin}
          style={{
            width: "100%", padding: "12px", background: "linear-gradient(135deg,#1e5799,#2e86c1)",
            color: "#fff", border: "none", borderRadius: 12, fontSize: 16,
            fontWeight: 700, cursor: "pointer",
          }}
        >
          Entrar
        </button>
        <p style={{ fontSize: 12, color: "#bbb", marginTop: 16 }}>Contraseña por defecto: <code>admin2025</code></p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 16px", maxWidth: 680, margin: "0 auto" }}>
      {msg && (
        <div style={{
          background: msg.startsWith("✅") ? "#e8f0fe" : "#fce4ec",
          color: msg.startsWith("✅") ? "#1a3a5c" : "#880e4f",
          padding: "12px 16px", borderRadius: 12, marginBottom: 16,
          fontWeight: 600, fontSize: 14, textAlign: "center",
          border: msg.startsWith("✅") ? "1px solid #a8c8f0" : "1px solid #f48fb1",
        }}>{msg}</div>
      )}

      {/* Voting controls */}
      <div style={{ background: "#fff", borderRadius: 18, padding: 18, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
        <h3 style={{ fontFamily: "'Georgia',serif", color: "#1a3a5c", margin: "0 0 14px", fontSize: 16 }}>
          📸 Control de Votaciones
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, color: "#555" }}>Estado:</span>
          <span style={{
            padding: "4px 14px", borderRadius: 99, fontSize: 13, fontWeight: 700,
            background: votingOpen ? "#e8f0fe" : "#fce4ec",
            color: votingOpen ? "#1a3a5c" : "#880e4f",
          }}>
            {votingOpen ? "✅ Abierta" : "🔒 Cerrada"}
          </span>
          <button
            onClick={handleToggleVoting}
            style={{
              padding: "8px 18px", borderRadius: 99,
              background: votingOpen ? "#fce4ec" : "linear-gradient(135deg,#1e5799,#2e86c1)",
              color: votingOpen ? "#880e4f" : "#fff",
              border: votingOpen ? "1px solid #f48fb1" : "none",
              fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}
          >
            {votingOpen ? "🔒 Cerrar votación" : "✅ Abrir votación"}
          </button>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ fontSize: 13, color: "#555" }}>Fecha límite:</label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            style={{ padding: "7px 10px", borderRadius: 8, border: "1.5px solid #a8c8f0", fontSize: 13 }}
          />
          <button
            onClick={handleSetDeadline}
            style={{
              padding: "7px 16px", borderRadius: 99,
              background: "linear-gradient(135deg,#1e5799,#2e86c1)",
              color: "#fff", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}
          >
            Guardar
          </button>
        </div>
      </div>

      {/* Add mom */}
      <div style={{ background: "#fff", borderRadius: 18, padding: 18, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
        <h3 style={{ fontFamily: "'Georgia',serif", color: "#1a3a5c", margin: "0 0 16px", fontSize: 16 }}>
          ➕ Agregar Participante
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            placeholder="Nombre completo *"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1.5px solid #a8c8f0", fontSize: 14, outline: "none" }}
          />
          <textarea
            placeholder="Descripción de la foto (opcional)"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            rows={2}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1.5px solid #a8c8f0", fontSize: 14, resize: "vertical", outline: "none", fontFamily: "inherit" }}
          />
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <label style={{
              padding: "9px 16px", borderRadius: 10,
              background: "#eaf2fb", border: "1.5px dashed #a8c8f0",
              color: "#1e5799", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
              📷 Subir foto
              <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
            </label>
            {photoPreview && (
              <img src={photoPreview} alt="preview" style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "2px solid #5dade2" }} />
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={adding}
            style={{
              padding: "11px", borderRadius: 12,
              background: "linear-gradient(135deg,#1e5799,#2e86c1)",
              color: "#fff", border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer",
            }}
          >
            ✝️ Agregar Participante
          </button>
        </div>
      </div>

      {/* List */}
      {moms.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 18, padding: 18, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          <h3 style={{ fontFamily: "'Georgia',serif", color: "#1a3a5c", margin: "0 0 16px", fontSize: 16 }}>
            📸 Participantes ({moms.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {moms.map(mom => (
              <div key={mom.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px", borderRadius: 12, background: "#eaf2fb",
              }}>
                <img
                  src={mom.photo}
                  alt={mom.name}
                  style={{ width: 46, height: 46, borderRadius: "50%", objectFit: "cover", border: "2px solid #5dade2", flexShrink: 0 }}
                  onError={e => { e.target.src = `https://api.dicebear.com/7.x/personas/svg?seed=${mom.id}`; }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 700, color: "#1a3a5c", fontSize: 14 }}>{mom.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#2e86c1" }}>{mom.votes} votos</p>
                </div>
                <button
                  onClick={() => handleResetVotes(mom.id)}
                  title="Resetear votos"
                  style={{ background: "#fff", border: "1px solid #a8c8f0", borderRadius: 8, padding: "5px 10px", fontSize: 12, color: "#1e5799", cursor: "pointer" }}
                >
                  🔄
                </button>
                <button
                  onClick={() => handleRemove(mom.id)}
                  title="Eliminar"
                  style={{ background: "#fff", border: "1px solid #a8c8f0", borderRadius: 8, padding: "5px 10px", fontSize: 12, color: "#1e5799", cursor: "pointer" }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("vote");
  const [moms, setMoms] = useState([]);
  const [votingOpen, setVotingOpen] = useState(true);
  const [votingDeadline, setVotingDeadline] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const saveData = useCallback(async ({ moms, votingOpen, votingDeadline }) => {
    try {
      await window.storage.set("contest-data", JSON.stringify({ moms, votingOpen, votingDeadline }), true);
    } catch (e) { console.error("Save error", e); }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get("contest-data", true);
        if (result?.value) {
          const data = JSON.parse(result.value);
          setMoms(data.moms || SAMPLE_MOMS);
          setVotingOpen(data.votingOpen ?? true);
          setVotingDeadline(data.votingDeadline ?? null);
        } else {
          setMoms(SAMPLE_MOMS);
          await window.storage.set("contest-data", JSON.stringify({ moms: SAMPLE_MOMS, votingOpen: true, votingDeadline: null }), true);
        }
      } catch (e) {
        setMoms(SAMPLE_MOMS);
      }
      setLoaded(true);
    })();
  }, []);

  // auto-close voting when deadline passes
  useEffect(() => {
    if (!votingOpen || !votingDeadline) return;
    const check = () => {
      if (new Date() >= new Date(votingDeadline)) {
        setVotingOpen(false);
        saveData({ moms, votingOpen: false, votingDeadline });
      }
    };
    check();
    const t = setInterval(check, 10000);
    return () => clearInterval(t);
  }, [votingOpen, votingDeadline, moms, saveData]);

  const handleVote = useCallback((momId) => {
    const voterId = getVoterId();
    const updated = moms.map(m =>
      m.id === momId
        ? { ...m, votes: m.votes + 1, voters: [...(m.voters || []), voterId] }
        : m
    );
    setMoms(updated);
    saveData({ moms: updated, votingOpen, votingDeadline });
  }, [moms, votingOpen, votingDeadline, saveData]);

  if (!loaded) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 16, background: "#eaf2fb" }}>
        <div style={{ fontSize: 48, animation: "spin 1s linear infinite" }}>✝️</div>
        <p style={{ color: "#1e5799", fontFamily: "'Georgia',serif" }}>Cargando concurso...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#eaf2fb", fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>

      <HeroHeader page={page} setPage={setPage} />

      {page === "vote" && (
        <VotePage
          moms={moms}
          votingOpen={votingOpen}
          votingDeadline={votingDeadline}
          onVote={handleVote}
        />
      )}
      {page === "results" && (
        <ResultsPage moms={moms} votingOpen={votingOpen} votingDeadline={votingDeadline} />
      )}
      {page === "admin" && (
        <AdminPage
          moms={moms}
          setMoms={setMoms}
          votingOpen={votingOpen}
          setVotingOpen={setVotingOpen}
          votingDeadline={votingDeadline}
          setVotingDeadline={setVotingDeadline}
          saveData={saveData}
        />
      )}

      <footer style={{
        textAlign: "center",
        padding: "28px 20px",
        background: "linear-gradient(160deg, #1a3a5c, #1e5799)",
        borderTop: "3px solid #c9a227",
        marginTop: 32,
      }}>
        <div style={{ fontSize: 22, marginBottom: 8, letterSpacing: 6 }}>✝️ 🐟 ✝️</div>
        <p style={{
          fontFamily: "'Georgia', serif",
          fontStyle: "italic",
          color: "#f0d060",
          fontSize: 14,
          margin: "0 0 6px",
          lineHeight: 1.6,
        }}>
          "Sus hijos se levantan y la llaman bienaventurada."
        </p>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, margin: "0 0 10px", letterSpacing: "0.1em" }}>
          Proverbios 31:28
        </p>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: 0, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Comunidad 10 · Camino Neocatecumenal
        </p>
      </footer>
    </div>
  );
}