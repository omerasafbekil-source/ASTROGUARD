
import Biomedical from "./Biomedical.jsx";
import AstronautHealth from "./AstronautHealth.jsx";
import AstroAI from "./AstroAI";
import { useEffect, useState } from "react";
import {
  Activity, HeartPulse, Wind, Thermometer, Droplets,
  ShieldCheck, AlertTriangle, Bell, Satellite, Users,
  LayoutDashboard, FileText, RefreshCw, Download,
  BrainCircuit, Moon, CircleCheck, Menu, X, Globe,
  Radio, Orbit, Eye
} from "lucide-react";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

const astronauts = [
  { id: 1, name: "Christina Koch", mission: "Artemis II", query: "Christina Koch NASA astronaut portrait" },
  { id: 2, name: "Victor Glover", mission: "Artemis II", query: "Victor Glover NASA astronaut portrait" },
  { id: 3, name: "Reid Wiseman", mission: "Artemis II", query: "Reid Wiseman NASA astronaut portrait" },
  { id: 4, name: "Jeremy Hansen", mission: "Artemis II", query: "Jeremy Hansen astronaut portrait" }
];

const initialMetrics = {
  heart: 74,
  oxygen: 98,
  temperature: 36.7,
  breath: 16,
  stress: 32,
  sleep: 7.4
};

const makeHistory = () =>
  Array.from({ length: 12 }, (_, i) => ({
    time: `${String(i * 2).padStart(2, "0")}:00`,
    heart: 68 + Math.round(Math.random() * 15),
    oxygen: 96 + Math.round(Math.random() * 3)
  }));

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selectedId, setSelectedId] = useState(1);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [history, setHistory] = useState(makeHistory);
  const [photos, setPhotos] = useState({});
  const [background, setBackground] = useState("");
  const [apodTitle, setApodTitle] = useState("NASA ASTRONOMY");
  const [apodDate, setApodDate] = useState("");
  const [running, setRunning] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = astronauts.find(a => a.id === selectedId);

  // NASA Astronomi Günün Fotoğrafı
  useEffect(() => {
    let active = true;

    async function loadNASAImage() {
      try {
        const response = await fetch(
          "https://science.nasa.gov/wp-json/wp/v2/apod-basic"
        );
        const data = await response.json();

        if (active && data.media_type === "image" && data.hdurl) {
          setBackground(data.hdurl);
          setApodTitle(data.title || "NASA ASTRONOMY");
          setApodDate(data.date || "");
        }
      } catch (error) {
        console.log("NASA APOD yüklenemedi:", error);
      }
    }

    loadNASAImage();
    return () => { active = false; };
  }, []);

  // NASA Image and Video Library astronot fotoğrafları
  useEffect(() => {
    let active = true;

    async function loadAstronautPhotos() {
      const result = {};

      await Promise.all(
        astronauts.map(async astronaut => {
          try {
            const url =
              "https://images-api.nasa.gov/search?q=" +
              encodeURIComponent(astronaut.query) +
              "&media_type=image&page_size=20";

            const response = await fetch(url);
            const data = await response.json();
            const items = data.collection?.items || [];

            const match = items.find(item => {
              const title = (item.data?.[0]?.title || "").toLowerCase();
              const surname = astronaut.name.split(" ").pop().toLowerCase();

              return title.includes(surname) &&
                item.links?.some(link => link.rel === "preview");
            }) || items.find(item =>
              item.links?.some(link => link.rel === "preview")
            );

            const image = match?.links?.find(
              link => link.rel === "preview"
            )?.href;

            if (image) result[astronaut.id] = image;
          } catch (error) {
            console.log("Astronot fotoğrafı yüklenemedi:", astronaut.name);
          }
        })
      );

      if (active) setPhotos(result);
    }

    loadAstronautPhotos();
    return () => { active = false; };
  }, []);

  // Hareketli sağlık verileri
  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setMetrics(prev => ({
        heart: Math.max(60, Math.min(110, prev.heart + Math.round(Math.random() * 6 - 3))),
        oxygen: Math.max(94, Math.min(100, prev.oxygen + Math.round(Math.random() * 2 - 1))),
        temperature: Number((prev.temperature + Math.random() * 0.2 - 0.1).toFixed(1)),
        breath: Math.max(12, Math.min(24, prev.breath + Math.round(Math.random() * 2 - 1))),
        stress: Math.max(15, Math.min(85, prev.stress + Math.round(Math.random() * 8 - 4))),
        sleep: prev.sleep
      }));

      setHistory(prev => [
        ...prev.slice(1),
        {
          time: new Date().toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit"
          }),
          heart: 68 + Math.round(Math.random() * 20),
          oxygen: 96 + Math.round(Math.random() * 3)
        }
      ]);
    }, 3000);

    return () => clearInterval(timer);
  }, [running]);

  const status =
    metrics.heart > 115 || metrics.heart < 45 ||
    metrics.oxygen < 90 || metrics.temperature > 38.2 ||
    metrics.breath > 28
      ? "KRİTİK"
      : metrics.heart > 100 || metrics.heart < 55 ||
        metrics.oxygen < 95 || metrics.temperature > 37.7 ||
        metrics.breath > 22 || metrics.stress > 70
        ? "DİKKAT"
        : "NORMAL";

   const menu = [
    { id: "dashboard", label: "Genel Bakış", icon: LayoutDashboard },
    { id: "astronauts", label: "Astronotlar", icon: Users },
    { id: "astronaut-health", label: "Astronot Sağlık Profilleri", icon: Users },
    { id: "analysis", label: "Sağlık Analizi", icon: BrainCircuit },
    { id: "biomedical", label: "Biyomedikal İzleme", icon: Activity },
    { id: "astro-ai", label: "ASTRO AI Danışman", icon: BrainCircuit },
    { id: "alerts", label: "Sistem Uyarıları", icon: Bell },
    { id: "reports", label: "Raporlar", icon: FileText }
];

  function exportCSV() {
    const rows = [
      ["ASTROGUARD SAĞLIK RAPORU"],
      ["Astronot profili", selected.name],
      ["Veri türü", "Simüle edilmiş örnek değerler"],
      ["Nabız", metrics.heart],
      ["Oksijen", metrics.oxygen],
      ["Sıcaklık", metrics.temperature],
      ["Solunum", metrics.breath],
      ["Stres", metrics.stress]
    ];

    const csv = rows.map(row => row.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;"
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "astroguard-raporu.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function Photo({ astronaut, large = false }) {
    const src = photos[astronaut.id];

    return (
      <div className={`photo ${large ? "photo-large" : ""}`}>
        {src ? (
          <img src={src} alt={astronaut.name} />
        ) : (
          <div className="photo-empty">
            <Satellite size={35} />
            <span>ASTRONAUT PROFILE</span>
          </div>
        )}
        <span className="photo-credit">NASA</span>
      </div>
    );
  }

  function MetricCard({ title, value, unit, icon: Icon, color, note }) {
    return (
      <div className="metric-card">
        <div className="metric-top">
          <span>{title}</span>
          <div className="metric-icon" style={{ color }}>
            <Icon size={21} />
          </div>
        </div>
        <div className="metric-value">
          {value}<small>{unit}</small>
        </div>
        <div className="metric-note">{note}</div>
        <div className="metric-track">
          <span style={{ background: color, width: "70%" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="app space-background">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Orbitron:wght@500;600;700;800&display=swap');

        * { box-sizing:border-box; }
        body { margin:0; background:#050a14; color:#eef6ff; font-family:Inter,sans-serif; }
        button { font:inherit; cursor:pointer; }
        .app { min-height:100vh; background:
          radial-gradient(ellipse at 75% 0%,#12345a66,transparent 45%),
          #050a14; }

        .wallpaper {
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background-size:cover; background-position:center;
          opacity:.17; transition:background-image .5s;
        }
        .wallpaper:after {
          content:""; position:absolute; inset:0;
          background:linear-gradient(90deg,#050a14 0%,#07101de8 55%,#07101d99 100%);
        }

        .sidebar {
          width:245px; height:100vh; position:fixed; z-index:5;
          top:0; left:0; padding:24px 16px;
          background:#07111ff2; border-right:1px solid #23415c;
          backdrop-filter:blur(18px);
        }
        .brand { display:flex; align-items:center; gap:12px; padding:5px 8px 32px; }
        .brand-icon {
          width:43px;height:43px;border-radius:13px;display:grid;place-items:center;
          background:linear-gradient(135deg,#06b6d4,#2563eb);
          box-shadow:0 0 25px #06b6d455;
        }
        .brand-name { font:800 18px Orbitron; letter-spacing:1px; }
        .brand-sub { color:#6e9bb9; font-size:9px; letter-spacing:2px; margin-top:5px; }
        .menu-label { color:#55738f; font-size:10px; letter-spacing:2px; padding:12px; }
        .nav-item {
          width:100%; border:0; color:#9ab1c9; background:transparent;
          display:flex;align-items:center;gap:13px;text-align:left;
          padding:14px;border-radius:10px;margin:4px 0;font-size:12px;
        }
        .nav-item:hover,.nav-item.active {
          background:linear-gradient(90deg,#0e749088,#1d4ed844);
          color:white;box-shadow:inset 2px 0 #22d3ee;
        }
        .side-bottom {
          position:absolute;bottom:22px;left:16px;right:16px;
          padding:14px;border:1px solid #1e3a56;border-radius:12px;background:#0b1a2b;
        }
        .dot { display:inline-block;width:7px;height:7px;border-radius:50%;background:#34d399;margin-right:7px;box-shadow:0 0 10px #34d399; }

        .main { position:relative;z-index:1;margin-left:245px;padding:28px 35px 45px;max-width:1700px; }
        .topbar { display:flex;justify-content:space-between;align-items:center;gap:15px;margin-bottom:25px; }
        .eyebrow { color:#22d3ee;font-size:10px;letter-spacing:2px;font-weight:700;margin-bottom:8px; }
        h1 { font:700 24px Orbitron;margin:0; }
        .subtitle { color:#8ca8c3;font-size:11px;margin-top:8px; }
        .top-actions { display:flex;align-items:center;gap:9px; }
        .live {
          border:1px solid #12627a;background:#083344aa;color:#67e8f9;
          padding:10px 12px;border-radius:8px;font-size:10px;
        }
        .action {
          border:1px solid #25445f;background:#0c1b2c;color:#c8d9e9;
          padding:10px 12px;border-radius:8px;font-size:10px;
        }
        .action:hover { border-color:#22d3ee; }
        .mobile-toggle { display:none; }

        .hero {
          min-height:285px;border:1px solid #28516d;border-radius:18px;overflow:hidden;
          position:relative;background:#0b2036;
          background-size:cover;background-position:center;
          box-shadow:0 15px 55px #0005;
        }
        .hero:before {
          content:"";position:absolute;inset:0;
          background:linear-gradient(90deg,#06101df5 0%,#07182bd9 48%,#07182b44 100%);
        }
        .hero:after {
          content:"";position:absolute;right:8%;top:-80px;width:350px;height:350px;
          border:1px solid #5bdcf566;border-radius:50%;
          box-shadow:0 0 0 35px #38bdf811,0 0 0 75px #38bdf808;
        }
        .hero-content { position:relative;z-index:1;padding:34px;max-width:700px; }
        .hero-label { color:#67e8f9;font-size:10px;letter-spacing:3px; }
        .hero-title { font:800 29px Orbitron;line-height:1.35;margin:17px 0 10px; }
        .hero-desc { color:#a4bdd4;font-size:12px;line-height:1.8;max-width:470px; }
        .hero-bottom { display:flex;gap:30px;margin-top:24px;align-items:center; }
        .hero-number { font:700 23px Orbitron;color:#67e8f9; }
        .hero-caption { color:#91a9c1;font-size:9px;letter-spacing:1px;margin-top:4px; }
        .apod-credit { position:absolute;z-index:2;bottom:13px;right:15px;color:#b9d5e8;font-size:9px;background:#06101dbb;padding:7px 10px;border-radius:6px; }

        .section-head { display:flex;justify-content:space-between;align-items:center;margin:25px 0 14px; }
        .section-head h2 { font:600 13px Orbitron;margin:0;letter-spacing:1px; }
        .section-head span { color:#7694b1;font-size:9px;letter-spacing:1px; }

        .status-banner {
          display:flex;align-items:center;gap:13px;padding:15px 18px;margin-top:17px;
          border:1px solid #24516c;border-radius:12px;background:#0c2033dd;
        }
        .status-light { width:12px;height:12px;border-radius:50%;background:#34d399;box-shadow:0 0 18px #34d399; }
        .status-text { flex:1; }
        .status-text strong { display:block;font-size:12px; }
        .status-text span { display:block;color:#89a5bf;font-size:10px;margin-top:5px; }

        .metrics { display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px; }
        .metric-card {
          border:1px solid #1d3e5b;border-radius:14px;padding:17px;
          background:linear-gradient(145deg,#10243add,#091625ed);
          box-shadow:0 8px 25px #0003;
        }
        .metric-top { display:flex;justify-content:space-between;align-items:center;color:#a4bdd2;font-size:10px; }
        .metric-icon { width:37px;height:37px;display:grid;place-items:center;border-radius:11px;background:#1b3853; }
        .metric-value { font:700 25px Orbitron;margin:17px 0 7px; }
        .metric-value small { font:500 10px Inter;color:#86a1ba;margin-left:5px; }
        .metric-note { color:#718da8;font-size:9px; }
        .metric-track { height:3px;background:#21374b;margin-top:14px;border-radius:5px;overflow:hidden; }
        .metric-track span { display:block;height:100%;border-radius:5px; }

        .columns { display:grid;grid-template-columns:1.45fr .85fr;gap:15px;margin-top:17px; }
        .panel { border:1px solid #1d3d59;border-radius:15px;background:#0b1b2deF;padding:19px;min-width:0; }
        .panel-title { font:600 12px Orbitron; }
        .panel-sub { color:#7793ad;font-size:10px;margin-top:6px;margin-bottom:16px; }
        .chart { height:235px;width:100%; }
        .photo { width:100%;height:140px;position:relative;overflow:hidden;border-radius:12px;background:linear-gradient(135deg,#16436a,#0b1728);border:1px solid #365878; }
        .photo img { width:100%;height:100%;object-fit:cover;object-position:center 25%; }
        .photo-large { height:250px; }
        .photo-empty { height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px;color:#73a5c8;font-size:9px;letter-spacing:1px; }
        .photo-credit { position:absolute;right:8px;bottom:8px;background:#07111ddd;color:#c5e1f4;font-size:8px;padding:5px 7px;border-radius:4px; }
        .profile-row { display:grid;grid-template-columns:120px 1fr;gap:14px;align-items:center; }
        .profile-info strong { font-size:13px; }
        .profile-info span { display:block;color:#85a2bd;font-size:10px;margin-top:7px; }
        .select { width:100%;margin-top:13px;padding:11px;border:1px solid #254661;background:#0a1a2b;color:white;border-radius:8px; }
        .notice { border:1px solid #755a27;background:#352b15aa;color:#e9cf8c;padding:12px;border-radius:9px;font-size:10px;line-height:1.7;margin-top:14px; }
        .astronaut-grid { display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px; }
        .astronaut-card { padding:11px;border:1px solid #20415d;background:#0b1b2c;border-radius:14px;cursor:pointer;transition:.2s; }
        .astronaut-card:hover,.astronaut-card.chosen { transform:translateY(-3px);border-color:#22d3ee;box-shadow:0 10px 25px #0891b222; }
        .astronaut-card h3 { font-size:12px;margin:12px 0 5px; }
        .astronaut-card p { font-size:9px;color:#829db7;margin:0; }
        .tag { display:inline-block;margin-top:10px;padding:5px 8px;border-radius:5px;background:#12374f;color:#67e8f9;font-size:9px; }
        .analysis-list { display:grid;gap:10px; }
        .analysis-item { display:flex;align-items:center;gap:12px;padding:13px;background:#10243a;border:1px solid #1d3d59;border-radius:10px;font-size:11px; }
        .analysis-item svg { flex-shrink:0; }
        .report-btn { display:flex;align-items:center;gap:9px;background:linear-gradient(90deg,#0891b2,#2563eb);border:0;color:white;padding:13px 17px;border-radius:9px;font-size:11px;font-weight:700; }
        .footer { border-top:1px solid #1b344b;margin-top:35px;padding-top:17px;display:flex;justify-content:space-between;gap:10px;color:#68829c;font-size:9px; }

        @media(max-width:1100px) {
          .metrics { grid-template-columns:repeat(2,minmax(0,1fr)); }
          .astronaut-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
          .hero-title { font-size:23px; }
        }
        @media(max-width:760px) {
          .sidebar { transform:translateX(-100%);transition:.25s; }
          .sidebar.open { transform:translateX(0); }
          .main { margin-left:0;padding:19px 14px 35px; }
          .mobile-toggle { display:inline-block; }
          .topbar { align-items:flex-start; }
          .top-actions { flex-wrap:wrap;justify-content:flex-end; }
          h1 { font-size:17px; }
          .hero { min-height:270px; }
          .hero-content { padding:23px; }
          .hero-title { font-size:21px; }
          .columns { grid-template-columns:1fr; }
          .metrics { gap:9px; }
          .metric-card { padding:12px; }
          .metric-value { font-size:19px; }
          .astronaut-grid { gap:9px; }
          .footer { flex-direction:column; }
        }
      `}</style>

      <div
        className="wallpaper"
        style={background ? { backgroundImage: `url("${background}")` } : {}}
      />

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><Satellite color="white" size={24} /></div>
          <div>
            <div className="brand-name">ASTROGUARD</div>
            <div className="brand-sub">SPACE HEALTH SYSTEM</div>
          </div>
        </div>

        <div className="menu-label">MISSION CONTROL</div>

       {menu.map(item => (
  <button
    key={item.id}
    className={`nav-item ${page === item.id ? "active" : ""}`}
    onClick={() => {
      setPage(item.id);
      setMobileOpen(false);
    }}
  >
    <item.icon size={17} /> {item.label}
  </button>
))}

        <div className="side-bottom">
          <div style={{ fontSize: 10, color: "#b6d1e7" }}>
            <span className="dot" /> SİSTEM BAĞLANTISI AKTİF
          </div>
          <div style={{ fontSize: 9, color: "#6c8ba7", marginTop: 9 }}>
            NASA OPEN IMAGE SOURCES
          </div>
        </div>
      </aside>

      <main className="main">
  <header className="topbar">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button className="action mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
            <div>
              <div className="eyebrow">NASA SPACE DATA INTEGRATION</div>
              <h1>{menu.find(m => m.id === page)?.label}</h1>
              <div className="subtitle">Astronot sağlık takip ve analiz platformu</div>
            </div>
          </div>

          <div className="top-actions">
            <div className="live"><span className="dot" /> SİSTEM AKTİF</div>
            <button className="action" onClick={() => setRunning(!running)}>
              {running ? "DURAKLAT" : "BAŞLAT"}
            </button>
            <button className="action" onClick={() => setHistory(makeHistory())}>
              <RefreshCw size={14} />
            </button>
          </div>
        </header>
      {/* ASTRO AI SAYFASI */}
{page === "astro-ai" && (
  <AstroAI />
)}

{/* BİYOMEDİKAL İZLEME SAYFASI */}
{page === "biomedical" && (
  <Biomedical />
)}

{/* ASTRONOT SAĞLIK PROFİLLERİ */}
{page === "astronaut-health" && (
  <AstronautHealth />
)}
        {page === "dashboard" && (
          <>
            <section
              className="hero"
              style={background ? { backgroundImage: `url("${background}")` } : {}}
            >
              <div className="hero-content">
                <div className="hero-label">BEYOND EARTH · HUMAN HEALTH</div>
                <div className="hero-title">
                  Uzayda yaşamı<br />akıllı sistemlerle izle.
                </div>
                <div className="hero-desc">
                  ASTROGUARD, uzay görevlerinde astronot sağlık göstergelerini
                  takip etmek ve olası değişimleri analiz etmek için tasarlanmış
                  bir sağlık izleme platformudur.
                </div>
                <div className="hero-bottom">
                  <div>
                    <div className="hero-number">04</div>
                    <div className="hero-caption">ASTRONOT PROFİLİ</div>
                  </div>
                  <div>
                    <div className="hero-number">06</div>
                    <div className="hero-caption">SAĞLIK GÖSTERGESİ</div>
                  </div>
                  <div>
                    <div className="hero-number">NASA</div>
                    <div className="hero-caption">GÖRSEL VERİ KAYNAĞI</div>
                  </div>
                </div>
              </div>
              <div className="apod-credit">
                NASA APOD · {apodDate} · {apodTitle}
              </div>
            </section>

            <div className="status-banner">
              <div className="status-light" style={{
                background: status === "NORMAL" ? "#34d399" : status === "DİKKAT" ? "#fbbf24" : "#fb7185"
              }} />
              <div className="status-text">
                <strong>GENEL SAĞLIK DURUMU: {status}</strong>
                <span>Seçili profilin sağlık göstergeleri eşik değerlerine göre değerlendiriliyor.</span>
              </div>
              <ShieldCheck color="#67e8f9" size={24} />
            </div>

            <div className="section-head">
              <h2>SAĞLIK GÖSTERGELERİ</h2>
              <span>{selected.name.toUpperCase()}</span>
            </div>

            <div className="metrics">
              <MetricCard title="Kalp Atış Hızı" value={metrics.heart} unit="BPM" icon={HeartPulse} color="#fb7185" note="Dakikadaki kalp atışı" />
              <MetricCard title="Oksijen Seviyesi" value={metrics.oxygen} unit="%" icon={Droplets} color="#38bdf8" note="Oksijen doygunluğu" />
              <MetricCard title="Vücut Sıcaklığı" value={metrics.temperature} unit="°C" icon={Thermometer} color="#fbbf24" note="Vücut sıcaklığı" />
              <MetricCard title="Solunum" value={metrics.breath} unit="/dk" icon={Wind} color="#a78bfa" note="Dakikadaki solunum" />
            </div>

            <div className="columns">
              <div className="panel">
                <div className="panel-title">KALP ATIŞI GRAFİĞİ</div>
                <div className="panel-sub">Zaman içindeki ölçüm değişimi</div>
                <div className="chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history}>
                      <defs>
                        <linearGradient id="heartFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#1c354c" strokeDasharray="3 3" />
                      <XAxis dataKey="time" stroke="#7692ac" tick={{ fontSize: 9 }} />
                      <YAxis stroke="#7692ac" tick={{ fontSize: 9 }} />
                      <Tooltip contentStyle={{ background: "#0b1b2d", border: "1px solid #28516d", borderRadius: 8 }} />
                      <Area type="monotone" dataKey="heart" stroke="#22d3ee" fill="url(#heartFill)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="panel">
                <div className="panel-title">ASTRONOT PROFİLİ</div>
                <div className="panel-sub">NASA astronot referans profili</div>
                <div className="profile-row">
                  <Photo astronaut={selected} />
                  <div className="profile-info">
                    <strong>{selected.name}</strong>
                    <span>{selected.mission}</span>
                    <span>NASA / Uzay görevleri</span>
                  </div>
                </div>
                <select
                  className="select"
                  value={selectedId}
                  onChange={e => setSelectedId(Number(e.target.value))}
                >
                  {astronauts.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        {page === "astronauts" && (
          <>
            <div className="section-head">
              <h2>ASTRONOT GALERİSİ</h2>
              <span>NASA IMAGE LIBRARY</span>
            </div>
            <input
              className="select"
              placeholder="Astronot ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="astronaut-grid" style={{ marginTop: 15 }}>
              {astronauts.filter(a =>
                a.name.toLowerCase().includes(search.toLowerCase())
              ).map(a => (
                <div
                  key={a.id}
                  className={`astronaut-card ${selectedId === a.id ? "chosen" : ""}`}
                  onClick={() => setSelectedId(a.id)}
                >
                  <Photo astronaut={a} />
                  <h3>{a.name}</h3>
                  <p>NASA / Uzay astronotu</p>
                  <span className="tag">{a.mission}</span>
                </div>
              ))}
            </div>

            <div className="panel" style={{ marginTop: 18 }}>
              <div className="panel-title">SEÇİLİ ASTRONOT</div>
              <div className="columns">
                <Photo astronaut={selected} large />
                <div>
                  <h2 style={{ fontFamily: "Orbitron", fontSize: 18 }}>{selected.name}</h2>
                  <p className="panel-sub">{selected.mission} görev profili</p>
                  <a
                    href="https://www.nasa.gov/astronauts/"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#67e8f9", fontSize: 11 }}
                  >
                    NASA Astronotları ↗
                  </a>
                </div>
              </div>
            </div>
          </>
        )}

        {page === "analysis" && (
          <>
            <div className="section-head">
              <h2>SAĞLIK ANALİZİ</h2>
              <span>HEALTH INTELLIGENCE</span>
            </div>
            <div className="metrics">
              <MetricCard title="Stres Seviyesi" value={metrics.stress} unit="%" icon={BrainCircuit} color="#a78bfa" note="Stres göstergesi" />
              <MetricCard title="Uyku Süresi" value={metrics.sleep} unit="saat" icon={Moon} color="#38bdf8" note="Uyku süresi göstergesi" />
              <MetricCard title="Kalp Atışı" value={metrics.heart} unit="BPM" icon={HeartPulse} color="#fb7185" note="Kalp ritmi göstergesi" />
              <MetricCard title="Oksijen" value={metrics.oxygen} unit="%" icon={Droplets} color="#38bdf8" note="Oksijen göstergesi" />
            </div>
            <div className="panel" style={{ marginTop: 18 }}>
              <div className="panel-title">SİSTEM DEĞERLENDİRMESİ</div>
              <div className="panel-sub">Sağlık göstergelerinin otomatik kontrolü</div>
              <div className="analysis-list">
                <div className="analysis-item"><CircleCheck color="#34d399" /> Nabız değerleri izleniyor.</div>
                <div className="analysis-item"><CircleCheck color="#34d399" /> Oksijen göstergesi kontrol ediliyor.</div>
                <div className="analysis-item"><CircleCheck color="#34d399" /> Sıcaklık ve solunum değişimleri izleniyor.</div>
                <div className="analysis-item"><Activity color="#67e8f9" /> Sağlık göstergeleri grafiklere aktarılıyor.</div>
              </div>
            </div>
          </>
        )}

        {page === "alerts" && (
          <>
            <div className="section-head">
              <h2>SİSTEM UYARILARI</h2>
              <span>HEALTH ALERT CENTER</span>
            </div>
            <div className="metrics">
              <MetricCard title="Nabız" value={metrics.heart} unit="BPM" icon={HeartPulse} color="#fb7185" note="Kalp atış hızı" />
              <MetricCard title="Oksijen" value={metrics.oxygen} unit="%" icon={Droplets} color="#38bdf8" note="Oksijen seviyesi" />
              <MetricCard title="Sıcaklık" value={metrics.temperature} unit="°C" icon={Thermometer} color="#fbbf24" note="Vücut sıcaklığı" />
              <MetricCard title="Solunum" value={metrics.breath} unit="/dk" icon={Wind} color="#a78bfa" note="Solunum hızı" />
            </div>

            <div className="panel" style={{ marginTop: 18 }}>
              <div className="panel-title">OTOMATİK UYARI KONTROLÜ</div>
              <div className="panel-sub">Güncel sağlık göstergeleri</div>
              <div className="analysis-list">
                {[
                  { name: "Kalp atış hızı", value: metrics.heart, unit: "BPM", bad: metrics.heart > 115 || metrics.heart < 45, warn: metrics.heart > 100 || metrics.heart < 55 },
                  { name: "Oksijen seviyesi", value: metrics.oxygen, unit: "%", bad: metrics.oxygen < 90, warn: metrics.oxygen < 95 },
                  { name: "Vücut sıcaklığı", value: metrics.temperature, unit: "°C", bad: metrics.temperature > 38.2, warn: metrics.temperature > 37.7 },
                  { name: "Solunum", value: metrics.breath, unit: "/dk", bad: metrics.breath > 28, warn: metrics.breath > 22 },
                  { name: "Stres", value: metrics.stress, unit: "%", bad: false, warn: metrics.stress > 70 }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="analysis-item"
                    style={{
                      borderColor: item.bad ? "#ef4444" : item.warn ? "#d6a329" : "#1d4b42",
                      background: item.bad ? "#451a1a" : item.warn ? "#352b13" : "#10243a"
                    }}
                  >
                    {item.bad || item.warn
                      ? <AlertTriangle color={item.bad ? "#fb7185" : "#fbbf24"} />
                      : <CircleCheck color="#34d399" />
                    }
                    <div style={{ flex: 1 }}>
                      <strong>{item.name}</strong>
                      <div style={{ color: "#91a9c2", fontSize: 10, marginTop: 5 }}>
                        Güncel değer: {item.value} {item.unit}
                      </div>
                    </div>
                    <strong style={{
                      fontSize: 10,
                      color: item.bad ? "#fb7185" : item.warn ? "#fbbf24" : "#34d399"
                    }}>
                      {item.bad ? "KRİTİK" : item.warn ? "DİKKAT" : "NORMAL"}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {page === "reports" && (
          <>
            <div className="section-head">
              <h2>RAPOR MERKEZİ</h2>
              <span>HEALTH REPORTS</span>
            </div>
            <div className="panel">
              <div className="panel-title">SAĞLIK RAPORU</div>
              <div className="panel-sub">Seçili profil: {selected.name}</div>
              <div className="metrics">
                <MetricCard title="Nabız" value={metrics.heart} unit="BPM" icon={HeartPulse} color="#fb7185" note="Güncel değer" />
                <MetricCard title="Oksijen" value={metrics.oxygen} unit="%" icon={Droplets} color="#38bdf8" note="Güncel değer" />
                <MetricCard title="Sıcaklık" value={metrics.temperature} unit="°C" icon={Thermometer} color="#fbbf24" note="Güncel değer" />
                <MetricCard title="Solunum" value={metrics.breath} unit="/dk" icon={Wind} color="#a78bfa" note="Güncel değer" />
              </div>
              <button className="report-btn" style={{ marginTop: 20 }} onClick={exportCSV}>
                <Download size={16} /> RAPORU İNDİR
              </button>
            </div>
          </>
        )}

        <div className="notice">
          Sağlık göstergeleri yazılım tarafından oluşturulan örnek değerlerdir;
          gerçek astronot ölçümü veya NASA sağlık telemetrisi değildir.
          Fotoğraf ve astronomi görselleri NASA'nın açık görsel kaynaklarından alınır.
          NASA, ASTROGUARD projesini onaylamış veya desteklemiş değildir.
        </div>

        <footer className="footer">
          <span>ASTROGUARD · SPACE HEALTH MONITORING</span>
          <span>IMAGE SOURCE: NASA APOD & NASA IMAGE LIBRARY</span>
        </footer>
      </main>
    </div>
  );
}
