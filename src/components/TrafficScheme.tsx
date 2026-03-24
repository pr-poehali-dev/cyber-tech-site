import { useEffect, useRef, useState } from "react";
import SectionLabel from "./SectionLabel";
import Icon from "@/components/ui/icon";

interface Packet {
  id: number;
  pathIdx: number;
  t: number;
  speed: number;
  color: string;
  size: number;
}

interface NodeDef {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  x: number;
  y: number;
  type: "device" | "channel" | "ip" | "internet";
  color: string;
}

interface PathDef {
  id: string;
  nodes: string[];
  color: string;
  label: string;
  ipLabel: string;
}

const NODES: NodeDef[] = [
  { id: "pc1",     label: "ПК 1",      sublabel: "Офис / отдел A",    icon: "Monitor",    x: 4,  y: 18, type: "device",   color: "#00ff88" },
  { id: "pc2",     label: "ПК 2",      sublabel: "Офис / отдел B",    icon: "Monitor",    x: 4,  y: 42, type: "device",   color: "#38bdf8" },
  { id: "phone",   label: "Смартфон",  sublabel: "Мобильный клиент",  icon: "Smartphone", x: 4,  y: 66, type: "device",   color: "#a78bfa" },
  { id: "server",  label: "Сервер",    sublabel: "Внутренний ресурс", icon: "Server",     x: 4,  y: 88, type: "device",   color: "#fb923c" },

  { id: "chA",    label: "Канал A",   sublabel: "Оптоволокно",       icon: "Cable",      x: 32, y: 18, type: "channel",  color: "#00ff88" },
  { id: "chB",    label: "Канал B",   sublabel: "LTE / 5G",          icon: "Radio",      x: 32, y: 42, type: "channel",  color: "#38bdf8" },
  { id: "chC",    label: "Канал C",   sublabel: "Спутник",           icon: "Wifi",       x: 32, y: 66, type: "channel",  color: "#a78bfa" },
  { id: "chD",    label: "Канал D",   sublabel: "Резервный",         icon: "Layers",     x: 32, y: 88, type: "channel",  color: "#fb923c" },

  { id: "enc",    label: "Шифрование", sublabel: "AES-256 / E2E",    icon: "Lock",       x: 56, y: 53, type: "channel",  color: "#00ff88" },

  { id: "ip1",    label: "IP 1",      sublabel: "91.108.4.x",        icon: "Globe",      x: 78, y: 18, type: "ip",       color: "#00ff88" },
  { id: "ip2",    label: "IP 2",      sublabel: "172.64.32.x",       icon: "Globe",      x: 78, y: 42, type: "ip",       color: "#38bdf8" },
  { id: "ip3",    label: "IP 3",      sublabel: "104.21.8.x",        icon: "Globe",      x: 78, y: 66, type: "ip",       color: "#a78bfa" },
  { id: "ip4",    label: "IP 4",      sublabel: "185.199.x.x",       icon: "Globe",      x: 78, y: 88, type: "ip",       color: "#fb923c" },

  { id: "inet",   label: "Интернет",  sublabel: "Изолированный выход", icon: "Globe2",   x: 96, y: 53, type: "internet", color: "#4ade80" },
];

const PATHS: PathDef[] = [
  { id: "p1", nodes: ["pc1",   "chA", "enc", "ip1",  "inet"], color: "#00ff88", label: "ПК 1 → Канал A → IP 1",    ipLabel: "91.108.4.x"   },
  { id: "p2", nodes: ["pc2",   "chB", "enc", "ip2",  "inet"], color: "#38bdf8", label: "ПК 2 → Канал B → IP 2",    ipLabel: "172.64.32.x"  },
  { id: "p3", nodes: ["phone", "chC", "enc", "ip3",  "inet"], color: "#a78bfa", label: "Смартфон → Канал C → IP 3", ipLabel: "104.21.8.x"  },
  { id: "p4", nodes: ["server","chD", "enc", "ip4",  "inet"], color: "#fb923c", label: "Сервер → Канал D → IP 4",   ipLabel: "185.199.x.x" },
];

export default function TrafficScheme() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const packetsRef = useRef<Packet[]>([]);
  const animRef = useRef<number>(0);
  const counterRef = useRef(0);
  const [activePathIdx, setActivePathIdx] = useState<number | null>(null);
  const activeRef = useRef<number | null>(null);

  useEffect(() => { activeRef.current = activePathIdx; }, [activePathIdx]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

    const getXY = (nodeId: string, W: number, H: number) => {
      const n = nodeMap[nodeId];
      return { x: (n.x / 100) * W, y: (n.y / 100) * H };
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const getPacketPos = (packet: Packet, W: number, H: number) => {
      const path = PATHS[packet.pathIdx];
      const segs = path.nodes.length - 1;
      const totalT = packet.t;
      const segIdx = Math.min(Math.floor(totalT * segs), segs - 1);
      const segT = (totalT * segs) - segIdx;
      const a = getXY(path.nodes[segIdx], W, H);
      const b = getXY(path.nodes[segIdx + 1], W, H);
      return { x: lerp(a.x, b.x, segT), y: lerp(a.y, b.y, segT) };
    };

    // Spawn packets
    const spawnInterval = setInterval(() => {
      const active = activeRef.current;
      const pathsToUse = active !== null ? [active] : PATHS.map((_, i) => i);
      for (const pi of pathsToUse) {
        if (Math.random() < 0.7) {
          packetsRef.current.push({
            id: counterRef.current++,
            pathIdx: pi,
            t: 0,
            speed: 0.003 + Math.random() * 0.002,
            color: PATHS[pi].color,
            size: 3 + Math.random() * 2,
          });
        }
      }
      // Cap packets
      if (packetsRef.current.length > 80) {
        packetsRef.current = packetsRef.current.slice(-60);
      }
    }, 300);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const active = activeRef.current;

      // Draw path lines
      for (let pi = 0; pi < PATHS.length; pi++) {
        const path = PATHS[pi];
        const isActive = active === null || active === pi;
        const alpha = isActive ? 0.25 : 0.06;

        for (let i = 0; i < path.nodes.length - 1; i++) {
          const a = getXY(path.nodes[i], W, H);
          const b = getXY(path.nodes[i + 1], W, H);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);

          // Curved lines through enc node (middle)
          if (path.nodes[i + 1] === "enc" || path.nodes[i] === "enc") {
            ctx.lineTo(b.x, b.y);
          } else {
            const mx = (a.x + b.x) / 2;
            ctx.bezierCurveTo(mx, a.y, mx, b.y, b.x, b.y);
          }

          ctx.strokeStyle = path.color + Math.round(alpha * 255).toString(16).padStart(2, "0");
          ctx.lineWidth = isActive ? 1.5 : 0.8;
          ctx.setLineDash([4, 6]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Draw nodes
      for (const node of NODES) {
        const { x, y } = getXY(node.id, W, H);
        const isOnActivePath = active === null || PATHS[active].nodes.includes(node.id);
        const alpha = isOnActivePath ? 1 : 0.25;

        // Box
        const bw = node.type === "internet" ? 52 : 48;
        const bh = 24;
        ctx.strokeStyle = node.color + Math.round(alpha * 0.5 * 255).toString(16).padStart(2, "0");
        ctx.lineWidth = 1;
        ctx.strokeRect(x - bw / 2, y - bh / 2, bw, bh);
        ctx.fillStyle = `rgba(6,10,18,${isOnActivePath ? 0.9 : 0.5})`;
        ctx.fillRect(x - bw / 2 + 1, y - bh / 2 + 1, bw - 2, bh - 2);

        // Label
        ctx.font = `bold 8px IBM Plex Mono, monospace`;
        ctx.textAlign = "center";
        ctx.fillStyle = node.color + Math.round(alpha * 0.9 * 255).toString(16).padStart(2, "0");
        ctx.fillText(node.label, x, y - 1);
        ctx.font = `7px IBM Plex Mono, monospace`;
        ctx.fillStyle = node.color + Math.round(alpha * 0.35 * 255).toString(16).padStart(2, "0");
        ctx.fillText(node.sublabel, x, y + 8);
      }

      // Draw packets
      packetsRef.current = packetsRef.current.filter((p) => p.t < 1);
      for (const packet of packetsRef.current) {
        packet.t += packet.speed;
        const { x, y } = getPacketPos(packet, W, H);
        const isActive = active === null || active === packet.pathIdx;
        if (!isActive) continue;

        ctx.beginPath();
        ctx.arc(x, y, packet.size, 0, Math.PI * 2);
        ctx.fillStyle = packet.color + "cc";
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(x, y, packet.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = packet.color + "22";
        ctx.fill();

        // Trail
        const trailLen = 0.04;
        const tBack = Math.max(0, packet.t - trailLen);
        const { x: tx, y: ty } = getPacketPos({ ...packet, t: tBack }, W, H);
        const grad = ctx.createLinearGradient(tx, ty, x, y);
        grad.addColorStop(0, packet.color + "00");
        grad.addColorStop(1, packet.color + "66");
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = packet.size * 0.8;
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      clearInterval(spawnInterval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section id="Схема" className="relative bg-cyber-blue py-24 px-6 md:px-12 overflow-hidden">
      <div className="cyber-grid absolute inset-0 opacity-20" />
      <div className="max-w-6xl mx-auto relative z-10">
        <SectionLabel index="07" label="Как работает система" />

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <h2 className="text-3xl md:text-4xl font-sans font-semibold text-white leading-tight max-w-xl">
            Разделение и{" "}
            <span className="text-cyber-green">контроль трафика</span>
          </h2>
          <p className="font-mono text-xs text-cyber-green opacity-40 max-w-xs leading-relaxed">
            Каждое устройство использует независимый канал и внешний IP. Трафик изолирован и зашифрован до точки выхода.
          </p>
        </div>

        {/* Path legend / filter */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setActivePathIdx(null)}
            className={`font-mono text-[10px] px-3 py-1.5 border transition-all duration-200 ${
              activePathIdx === null
                ? "border-cyber-green text-cyber-green bg-cyber-green bg-opacity-10"
                : "border-cyber-green border-opacity-20 text-cyber-green opacity-40 hover:opacity-70"
            }`}
          >
            Все каналы
          </button>
          {PATHS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActivePathIdx(activePathIdx === i ? null : i)}
              className={`font-mono text-[10px] px-3 py-1.5 border transition-all duration-200 flex items-center gap-1.5`}
              style={{
                borderColor: activePathIdx === i ? p.color : p.color + "33",
                color: p.color,
                opacity: activePathIdx === null || activePathIdx === i ? 1 : 0.35,
                backgroundColor: activePathIdx === i ? p.color + "18" : "transparent",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: p.color }} />
              {p.label}
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div className="border border-cyber-green border-opacity-15 bg-black bg-opacity-30 p-2 mb-6">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-cyber-green border-opacity-10 mb-2">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500 opacity-60" />
              <div className="w-2 h-2 rounded-full bg-yellow-400 opacity-60" />
              <div className="w-2 h-2 rounded-full bg-cyber-green opacity-60" />
            </div>
            <span className="font-mono text-[10px] text-cyber-green opacity-30 ml-1">traffic.topology — live</span>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-cyber-green status-active" />
              <span className="font-mono text-[10px] text-cyber-green opacity-40">LIVE</span>
            </div>
          </div>
          <canvas
            ref={canvasRef}
            className="w-full"
            style={{ height: 280 }}
          />
        </div>

        {/* Path details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {PATHS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActivePathIdx(activePathIdx === i ? null : i)}
              className="text-left border p-4 transition-all duration-200 hover:bg-black hover:bg-opacity-20 group"
              style={{
                borderColor: activePathIdx === i ? p.color : p.color + "25",
                backgroundColor: activePathIdx === i ? p.color + "0a" : "transparent",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: p.color, boxShadow: `0 0 6px ${p.color}` }}
                />
                <span className="font-mono text-[9px] opacity-50" style={{ color: p.color }}>
                  КАНАЛ {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="font-mono text-xs mb-1" style={{ color: p.color, opacity: 0.9 }}>
                {p.ipLabel}
              </div>
              <div className="font-mono text-[10px] text-cyber-green opacity-35 leading-relaxed">
                {p.label}
              </div>
            </button>
          ))}
        </div>

        {/* Key points */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: "GitBranch",
              title: "Изоляция по каналам",
              desc: "Каждое устройство или группа работает через физически независимый канал. Компрометация одного не влияет на остальные.",
            },
            {
              icon: "Globe",
              title: "Уникальный внешний IP",
              desc: "Наблюдатель видит 4 разных источника трафика. Корреляция между устройствами невозможна на уровне IP.",
            },
            {
              icon: "Lock",
              title: "Шифрование до точки выхода",
              desc: "Данные расшифровываются только на конечном узле. Каналы связи, операторы и провайдеры видят только зашифрованный поток.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 p-5 border border-cyber-green border-opacity-10 hover:border-opacity-25 transition-all bg-black bg-opacity-10">
              <div className="w-9 h-9 border border-cyber-green border-opacity-25 flex items-center justify-center shrink-0">
                <Icon name={item.icon} size={16} className="text-cyber-green opacity-60" />
              </div>
              <div>
                <div className="font-sans text-sm font-semibold text-white mb-1">{item.title}</div>
                <div className="font-mono text-xs text-cyber-green opacity-45 leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
