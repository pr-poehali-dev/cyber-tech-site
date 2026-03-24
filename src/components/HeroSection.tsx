import { useEffect, useRef, useState } from "react";
import NetworkCanvas from "./NetworkCanvas";
import TerminalText from "./TerminalText";
import Icon from "@/components/ui/icon";

const TERMINAL_LINES = [
  "sys.init network_monitor v4.2.1",
  "connecting to secure infrastructure...",
  "tunnel established [AES-256-GCM]",
  "threat detection: ACTIVE",
  "traffic segmentation: ENABLED",
  "status: ALL SYSTEMS OPERATIONAL",
];

const STATS = [
  { value: "99.97%", label: "Uptime SLA" },
  { value: "<2ms", label: "Задержка" },
  { value: "256-bit", label: "Шифрование" },
  { value: "24/7", label: "Мониторинг" },
];

const NAV_ITEMS = [
  { label: "О нас",        id: "О нас" },
  { label: "Услуги",       id: "Услуги" },
  { label: "Продукты",     id: "Продукты" },
  { label: "Возможности",  id: "Возможности" },
  { label: "Анализ",       id: "Анализ" },
  { label: "Схема",        id: "Схема" },
  { label: "Как работает", id: "Как работает" },
  { label: "Контакт",      id: "Контакт" },
];

export default function HeroSection() {
  const [scanPos, setScanPos] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanPos((p) => (p + 0.5) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-cyber-blue">
      <div className="cyber-grid absolute inset-0" />
      <NetworkCanvas />

      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `linear-gradient(to bottom, transparent ${scanPos - 2}%, rgba(0,255,136,0.03) ${scanPos}%, transparent ${scanPos + 2}%)`,
          transition: "none",
        }}
      />

      <div className="absolute inset-0 pointer-events-none z-10"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,255,136,0.04) 0%, transparent 70%)" }} />

      <nav
        className={`relative z-20 flex items-center justify-between px-6 md:px-12 py-4 border-b border-cyber-green border-opacity-10 transition-all duration-300 ${
          scrolled ? "bg-cyber-blue bg-opacity-95 backdrop-blur-sm" : ""
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-7 h-7 border border-cyber-green flex items-center justify-center">
            <div className="w-3 h-3 bg-cyber-green" />
          </div>
          <span className="font-mono text-sm text-cyber-green tracking-widest uppercase">инфо-безопасность.рф</span>
          <div className="flex items-center gap-1 ml-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-green status-active" />
            <span className="font-mono text-xs text-cyber-green opacity-40 hidden sm:block">SECURE</span>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-5 overflow-x-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="font-mono text-xs text-cyber-green opacity-45 hover:opacity-100 transition-opacity tracking-wider whitespace-nowrap"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button className="font-mono text-xs border border-cyber-green text-cyber-green px-4 py-2 hover:bg-cyber-green hover:text-cyber-blue transition-all duration-200 tracking-wider hidden sm:block">
            ВОЙТИ
          </button>

          {/* Mobile burger */}
          <div className="relative lg:hidden" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center justify-center w-9 h-9 border border-cyber-green border-opacity-30 text-cyber-green hover:border-opacity-60 transition-all"
            >
              <Icon name={menuOpen ? "X" : "Menu"} size={16} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 border border-cyber-green border-opacity-20 bg-[#060a12] bg-opacity-98 z-50">
                {NAV_ITEMS.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 font-mono text-xs text-cyber-green opacity-55 hover:opacity-100 hover:bg-cyber-green hover:bg-opacity-5 transition-all border-b border-cyber-green border-opacity-5 last:border-b-0"
                  >
                    <span className="text-cyber-green opacity-25">{String(i + 1).padStart(2, "0")}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 md:px-12 py-20 text-center">
        <div className="inline-flex items-center gap-2 border border-cyber-green border-opacity-30 px-3 py-1.5 mb-10 animate-fade-in-up">
          <Icon name="Shield" size={12} className="text-cyber-green" />
          <span className="font-mono text-xs text-cyber-green opacity-70 tracking-widest">
            NETWORK SECURITY PLATFORM v4.2
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-sans font-semibold text-white leading-tight max-w-4xl mb-6 animate-fade-in-up delay-200">
          Контроль и защита{" "}
          <span className="relative">
            <span className="text-cyber-green">сетевой инфраструктуры</span>
          </span>
        </h1>

        <p className="font-mono text-sm md:text-base text-cyber-green opacity-60 max-w-2xl mb-12 leading-relaxed animate-fade-in-up delay-400">
          Частные защищённые каналы, сегментация трафика и цифровая приватность
        </p>

        <div className="mb-20" />

        <div className="w-full max-w-3xl border border-cyber-green border-opacity-15 bg-black bg-opacity-40 p-5 animate-fade-in-up delay-600">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cyber-green border-opacity-10">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-70" />
              <div className="w-2.5 h-2.5 rounded-full bg-cyber-green opacity-70" />
            </div>
            <span className="font-mono text-xs text-cyber-green opacity-30 ml-2">
              admin@инфо-безопасность.рф:~$
            </span>
          </div>
          <TerminalText lines={TERMINAL_LINES} speed={40} />
        </div>
      </div>

      <div className="relative z-20 border-t border-cyber-green border-opacity-10 grid grid-cols-2 md:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={i}
            className="flex flex-col items-center py-6 border-r border-cyber-green border-opacity-10 last:border-r-0"
          >
            <span className="font-mono text-xl md:text-2xl text-cyber-green font-bold">{s.value}</span>
            <span className="font-mono text-xs text-cyber-green opacity-40 mt-1 tracking-wider">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}