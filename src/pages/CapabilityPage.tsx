import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { CAPABILITIES, CapabilityDiagramNode, CapabilityDiagramEdge } from "@/data/capabilities";
import Icon from "@/components/ui/icon";

function ArchDiagram({ nodes, edges }: { nodes: CapabilityDiagramNode[]; edges: CapabilityDiagramEdge[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const TYPE_COLORS: Record<string, string> = {
      source: "rgba(0,255,136,0.7)",
      process: "rgba(0,200,255,0.7)",
      target: "rgba(0,255,136,0.7)",
      shield: "rgba(255,180,0,0.7)",
    };

    const getXY = (n: CapabilityDiagramNode) => ({
      x: (n.x / 100) * W,
      y: (n.y / 100) * H,
    });

    ctx.clearRect(0, 0, W, H);

    // Draw grid
    ctx.strokeStyle = "rgba(0,255,136,0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Draw edges
    for (const edge of edges) {
      const from = nodes.find((n) => n.id === edge.from);
      const to = nodes.find((n) => n.id === edge.to);
      if (!from || !to) continue;
      const p1 = getXY(from);
      const p2 = getXY(to);

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = edge.encrypted ? "rgba(0,255,136,0.5)" : "rgba(0,255,136,0.2)";
      ctx.lineWidth = edge.encrypted ? 1.5 : 1;
      if (!edge.encrypted) ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrow
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const mx = (p1.x + p2.x) / 2;
      const my = (p1.y + p2.y) / 2;
      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-8, -4);
      ctx.lineTo(-8, 4);
      ctx.closePath();
      ctx.fillStyle = edge.encrypted ? "rgba(0,255,136,0.6)" : "rgba(0,255,136,0.25)";
      ctx.fill();
      ctx.restore();

      if (edge.label) {
        ctx.fillStyle = "rgba(0,255,136,0.35)";
        ctx.font = `9px IBM Plex Mono, monospace`;
        ctx.fillText(edge.label, mx + 4, my - 5);
      }
    }

    // Draw nodes
    for (const node of nodes) {
      const { x, y } = getXY(node);
      const color = TYPE_COLORS[node.type] || "rgba(0,255,136,0.5)";

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      const bw = 80, bh = 36;
      ctx.strokeRect(x - bw / 2, y - bh / 2, bw, bh);
      ctx.fillStyle = "rgba(6,10,18,0.85)";
      ctx.fillRect(x - bw / 2 + 1, y - bh / 2 + 1, bw - 2, bh - 2);

      const lines = node.label.split("\n");
      ctx.fillStyle = color;
      ctx.font = `bold 9px IBM Plex Mono, monospace`;
      ctx.textAlign = "center";
      if (lines.length === 1) {
        ctx.fillText(lines[0], x, y + 3);
      } else {
        ctx.fillText(lines[0], x, y - 3);
        ctx.font = `8px IBM Plex Mono, monospace`;
        ctx.fillStyle = color.replace("0.7", "0.45");
        ctx.fillText(lines[1], x, y + 9);
      }
    }
  }, [nodes, edges]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: 180 }}
    />
  );
}

export default function CapabilityPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const idx = CAPABILITIES.findIndex((c) => c.slug === slug);
  const cap = CAPABILITIES[idx];
  const prev = idx > 0 ? CAPABILITIES[idx - 1] : null;
  const next = idx < CAPABILITIES.length - 1 ? CAPABILITIES[idx + 1] : null;

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 50);
    window.scrollTo(0, 0);
    return () => clearTimeout(t);
  }, [slug]);

  const goBack = () => {
    const savedY = sessionStorage.getItem("capabilities_scroll_y");
    navigate("/");
    if (savedY) {
      const y = parseInt(savedY, 10);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: y, behavior: "instant" });
        });
      });
    }
  };

  if (!cap) {
    return (
      <div className="min-h-screen bg-cyber-blue flex items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-cyber-green opacity-40 mb-4">404 · NOT FOUND</div>
          <Link to="/" className="font-mono text-sm text-cyber-green border border-cyber-green border-opacity-30 px-4 py-2">← На главную</Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cyber-blue"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}
    >
      {/* Nav */}
      <nav className="border-b border-cyber-green border-opacity-10 px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 bg-cyber-blue z-50">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 border border-cyber-green flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-cyber-green" />
          </div>
          <span className="font-mono text-xs text-cyber-green opacity-60 group-hover:opacity-100 transition-opacity tracking-widest">NetGuard</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-cyber-green opacity-30 hidden sm:block">Возможности</span>
          <span className="font-mono text-xs text-cyber-green opacity-15 hidden sm:block">/</span>
          <span className={`font-mono text-[10px] border px-2 py-0.5 ${cap.tagColor}`}>{cap.tag}</span>
        </div>

        <button onClick={goBack} className="flex items-center gap-1.5 font-mono text-xs text-cyber-green opacity-50 hover:opacity-100 transition-opacity">
          <Icon name="ArrowLeft" size={12} />
          Назад
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-14">

        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 border border-cyber-green border-opacity-40 flex items-center justify-center bg-cyber-green bg-opacity-5">
              <Icon name={cap.icon} size={22} className="text-cyber-green" />
            </div>
            <div>
              <div className="font-mono text-xs text-cyber-green opacity-35 mb-0.5">{cap.short}</div>
              <div className="font-mono text-xs text-cyber-green opacity-20">{String(idx + 1).padStart(2, "0")} / {String(CAPABILITIES.length).padStart(2, "0")}</div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-sans font-semibold text-white leading-tight mb-5">
            {cap.title}
          </h1>
          <p className="font-mono text-sm text-cyber-green opacity-60 max-w-2xl leading-relaxed">
            {cap.summary}
          </p>
        </div>

        {/* Main grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">

          {/* Problem */}
          <div className="border border-cyber-green border-opacity-10 bg-black bg-opacity-20 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="AlertTriangle" size={13} className="text-rose-400 opacity-70" />
              <span className="font-mono text-xs text-rose-400 opacity-60 tracking-widest">// ПРОБЛЕМА</span>
            </div>
            <p className="font-mono text-xs text-cyber-green opacity-55 leading-relaxed">{cap.problem}</p>
          </div>

          {/* Solution */}
          <div className="border border-cyber-green border-opacity-20 bg-cyber-green bg-opacity-[0.03] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="CheckCircle" size={13} className="text-cyber-green opacity-70" />
              <span className="font-mono text-xs text-cyber-green opacity-60 tracking-widest">// РЕШЕНИЕ</span>
            </div>
            <p className="font-mono text-xs text-cyber-green opacity-65 leading-relaxed">{cap.solution}</p>
          </div>
        </div>

        {/* Diagram */}
        <div className="border border-cyber-green border-opacity-15 bg-black bg-opacity-30 mb-10">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-cyber-green border-opacity-10">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500 opacity-60" />
              <div className="w-2 h-2 rounded-full bg-yellow-500 opacity-60" />
              <div className="w-2 h-2 rounded-full bg-cyber-green opacity-60" />
            </div>
            <span className="font-mono text-[10px] text-cyber-green opacity-30 ml-1">architecture.diagram</span>
            <div className="ml-auto flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-px bg-cyber-green opacity-50" />
                <span className="font-mono text-[9px] text-cyber-green opacity-30">зашифрованный</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-px bg-cyber-green opacity-20" style={{ borderTop: "1px dashed" }} />
                <span className="font-mono text-[9px] text-cyber-green opacity-30">открытый</span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <ArchDiagram nodes={cap.diagram.nodes} edges={cap.diagram.edges} />
          </div>
        </div>

        {/* Specs */}
        <div className="mb-10">
          <div className="font-mono text-xs text-cyber-green opacity-30 tracking-widest mb-4">// ТЕХНИЧЕСКИЕ ХАРАКТЕРИСТИКИ</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-cyber-green bg-opacity-[0.07]">
            {cap.specs.map((s) => (
              <div key={s.label} className="bg-cyber-blue p-4 hover:bg-black hover:bg-opacity-30 transition-colors">
                <div className="font-mono text-[10px] text-cyber-green opacity-35 mb-1.5">{s.label}</div>
                <div className="font-mono text-sm text-cyber-green font-semibold">{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Use cases + tech stack */}
        <div className="grid md:grid-cols-2 gap-8 mb-14">
          <div className="border border-cyber-green border-opacity-10 p-6">
            <div className="font-mono text-xs text-cyber-green opacity-30 tracking-widest mb-4">// СЦЕНАРИИ ПРИМЕНЕНИЯ</div>
            <div className="space-y-3">
              {cap.useCases.map((u, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="font-mono text-[10px] text-cyber-green opacity-25 mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-mono text-xs text-cyber-green opacity-60 leading-snug">{u}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-cyber-green border-opacity-10 p-6">
            <div className="font-mono text-xs text-cyber-green opacity-30 tracking-widest mb-4">// ТЕХНОЛОГИЧЕСКИЙ СТЕК</div>
            <div className="flex flex-wrap gap-2">
              {cap.techStack.map((t) => (
                <span key={t} className="font-mono text-xs border border-cyber-green border-opacity-20 text-cyber-green opacity-65 px-2.5 py-1">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="border border-cyber-green border-opacity-20 bg-cyber-green bg-opacity-[0.03] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-14">
          <div>
            <div className="font-sans text-base font-semibold text-white mb-1">Нужна консультация по этой возможности?</div>
            <div className="font-mono text-xs text-cyber-green opacity-45">Инженер разберёт применимость к вашей инфраструктуре</div>
          </div>
          <Link
            to="/#Контакт"
            onClick={() => { setTimeout(() => document.getElementById("Контакт")?.scrollIntoView({ behavior: "smooth" }), 100); }}
            className="font-mono text-xs bg-cyber-green text-cyber-blue font-bold px-6 py-3 hover:bg-cyber-green-dim transition-colors shrink-0 tracking-wider"
          >
            Запросить консультацию →
          </Link>
        </div>

        {/* Prev / Next navigation */}
        <div className="grid grid-cols-2 gap-4">
          {prev ? (
            <button
              onClick={() => navigate(`/capabilities/${prev.slug}`)}
              className="group flex items-center gap-3 border border-cyber-green border-opacity-10 hover:border-opacity-30 p-4 text-left transition-all duration-200"
            >
              <Icon name="ArrowLeft" size={14} className="text-cyber-green opacity-40 group-hover:opacity-80 shrink-0 transition-opacity" />
              <div className="min-w-0">
                <div className="font-mono text-[10px] text-cyber-green opacity-30 mb-0.5">Предыдущая</div>
                <div className="font-sans text-xs text-white opacity-70 group-hover:opacity-100 transition-opacity leading-snug truncate">{prev.title}</div>
              </div>
            </button>
          ) : <div />}

          {next ? (
            <button
              onClick={() => navigate(`/capabilities/${next.slug}`)}
              className="group flex items-center gap-3 border border-cyber-green border-opacity-10 hover:border-opacity-30 p-4 text-right ml-auto w-full justify-end transition-all duration-200"
            >
              <div className="min-w-0">
                <div className="font-mono text-[10px] text-cyber-green opacity-30 mb-0.5">Следующая</div>
                <div className="font-sans text-xs text-white opacity-70 group-hover:opacity-100 transition-opacity leading-snug truncate">{next.title}</div>
              </div>
              <Icon name="ArrowRight" size={14} className="text-cyber-green opacity-40 group-hover:opacity-80 shrink-0 transition-opacity" />
            </button>
          ) : <div />}
        </div>

        {/* All capabilities */}
        <div className="mt-10 border-t border-cyber-green border-opacity-10 pt-8">
          <div className="font-mono text-xs text-cyber-green opacity-25 mb-4 tracking-widest">// ВСЕ ВОЗМОЖНОСТИ</div>
          <div className="flex flex-wrap gap-2">
            {CAPABILITIES.map((c) => (
              <Link
                key={c.slug}
                to={`/capabilities/${c.slug}`}
                className={`font-mono text-xs px-3 py-1.5 border transition-all duration-150 ${
                  c.slug === slug
                    ? "border-cyber-green text-cyber-green"
                    : "border-cyber-green border-opacity-15 text-cyber-green opacity-40 hover:opacity-70 hover:border-opacity-30"
                }`}
              >
                {c.short}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}