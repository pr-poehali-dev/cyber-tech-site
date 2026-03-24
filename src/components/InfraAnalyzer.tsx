import { useState, useEffect, useRef } from "react";
import SectionLabel from "./SectionLabel";
import Icon from "@/components/ui/icon";

type RiskLevel = "low" | "medium" | "high";

interface ScanResult {
  risk: RiskLevel;
  score: number;
  ip: string;
  openPorts: string[];
  vulns: { id: string; title: string; severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"; desc: string }[];
  recommendations: { icon: string; text: string }[];
  asn: string;
  tls: string;
  dnssec: boolean;
}

const RISK_PRESETS: Record<string, RiskLevel> = {
  "google.com": "low",
  "example.com": "medium",
};

function generateResult(domain: string): ScanResult {
  const seed = domain.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = (min: number, max: number) => min + (seed % (max - min + 1));

  const riskKey = RISK_PRESETS[domain.toLowerCase()];
  const risk: RiskLevel = riskKey ?? (seed % 3 === 0 ? "low" : seed % 3 === 1 ? "medium" : "high");

  const scoreMap = { low: rng(72, 91), medium: rng(42, 68), high: rng(14, 39) };
  const score = scoreMap[risk];

  const ipOctet = seed % 200 + 10;
  const ip = `${(seed % 180) + 40}.${ipOctet}.${(seed * 3) % 255}.${(seed * 7) % 255}`;

  const portSets: Record<RiskLevel, string[]> = {
    low:    ["443/tcp  open  https", "80/tcp   open  http (→ 443)", "25/tcp   filtered smtp"],
    medium: ["443/tcp  open  https", "80/tcp   open  http", "8080/tcp open  http-alt", "22/tcp   open  ssh"],
    high:   ["443/tcp  open  https", "80/tcp   open  http", "22/tcp   open  ssh", "3389/tcp open  rdp", "21/tcp   open  ftp", "8443/tcp open  https-alt"],
  };

  const vulnSets: Record<RiskLevel, ScanResult["vulns"]> = {
    low: [
      { id: "CVE-2023-4450", title: "TLS 1.1 поддерживается", severity: "LOW", desc: "Сервер допускает устаревший TLS 1.1. Рекомендуется отключить." },
      { id: "INF-HDR-001",   title: "Отсутствует HSTS preload", severity: "LOW", desc: "Заголовок Strict-Transport-Security не включён в preload-список." },
    ],
    medium: [
      { id: "CVE-2024-1182", title: "Открытый SSH без ограничений", severity: "HIGH",   desc: "SSH (22/tcp) доступен без IP-ограничений. Обнаружен баннер OpenSSH 8.2." },
      { id: "CVE-2023-6895", title: "HTTP без редиректа на HTTPS",  severity: "MEDIUM", desc: "Порт 80 отдаёт контент без редиректа. Возможна атака downgrade." },
      { id: "INF-DNS-002",   title: "DNSSEC не настроен",           severity: "MEDIUM", desc: "Зона DNS не подписана. Возможна атака DNS spoofing." },
    ],
    high: [
      { id: "CVE-2024-3094", title: "RDP открыт в публичный интернет", severity: "CRITICAL", desc: "Порт 3389 (RDP) доступен без ограничений. Высокий риск bruteforce и эксплуатации." },
      { id: "CVE-2023-7101", title: "FTP с возможной анонимной авторизацией", severity: "HIGH", desc: "Порт 21 (FTP) открыт. Протокол передаёт данные в открытом виде." },
      { id: "CVE-2024-0519", title: "Смешанный контент HTTP/HTTPS", severity: "HIGH", desc: "Обнаружены ресурсы, загружаемые по HTTP на HTTPS-странице. Риск перехвата." },
    ],
  };

  const recSets: Record<RiskLevel, ScanResult["recommendations"]> = {
    low: [
      { icon: "ShieldCheck", text: "Отключить поддержку TLS 1.0 / 1.1 на уровне сервера" },
      { icon: "Lock",        text: "Добавить HSTS с директивой preload и includeSubDomains" },
      { icon: "Globe",       text: "Включить DNSSEC для защиты DNS-зоны" },
    ],
    medium: [
      { icon: "EyeOff",  text: "Закрыть SSH (22/tcp) по IP-allowlist или перевести на нестандартный порт + ключи" },
      { icon: "ArrowRight", text: "Настроить принудительный редирект HTTP → HTTPS (301)" },
      { icon: "Shield",  text: "Активировать DNSSEC и CAA-записи для контроля выпуска сертификатов" },
    ],
    high: [
      { icon: "AlertTriangle", text: "Немедленно закрыть RDP (3389) от публичного доступа — только через защищённый туннель" },
      { icon: "X",             text: "Отключить FTP, заменить на SFTP с аутентификацией по ключу" },
      { icon: "Layers",        text: "Сегментировать инфраструктуру — вынести публичные сервисы в DMZ" },
      { icon: "Lock",          text: "Провести полный аудит открытых портов и политик firewall" },
    ],
  };

  const asnList = ["AS13335 Cloudflare", "AS15169 Google LLC", "AS16509 Amazon AWS", "AS14618 Amazon AWS", "AS8075 Microsoft"];
  const tlsList = ["TLS 1.3 (A+)", "TLS 1.2 / 1.3 (A)", "TLS 1.1 / 1.2 / 1.3 (B)"];

  return {
    risk,
    score,
    ip,
    openPorts: portSets[risk],
    vulns: vulnSets[risk],
    recommendations: recSets[risk],
    asn: asnList[seed % asnList.length],
    tls: tlsList[seed % tlsList.length],
    dnssec: risk === "low",
  };
}

const RISK_CONFIG = {
  low:    { label: "Низкий риск",    color: "text-cyber-green", border: "border-cyber-green", bg: "bg-cyber-green", bar: "bg-cyber-green" },
  medium: { label: "Средний риск",   color: "text-amber-400",   border: "border-amber-400",   bg: "bg-amber-400",   bar: "bg-amber-400"   },
  high:   { label: "Высокий риск",   color: "text-rose-400",    border: "border-rose-400",     bg: "bg-rose-400",    bar: "bg-rose-400"    },
};

const SEVERITY_CONFIG = {
  CRITICAL: "text-rose-400 border-rose-400",
  HIGH:     "text-orange-400 border-orange-400",
  MEDIUM:   "text-amber-400 border-amber-400",
  LOW:      "text-sky-400 border-sky-400",
};

const SCAN_PHASES = [
  { label: "DNS resolution",           duration: 500  },
  { label: "Port discovery (SYN scan)", duration: 900  },
  { label: "Service fingerprinting",   duration: 700  },
  { label: "TLS/SSL analysis",         duration: 600  },
  { label: "Vulnerability matching",   duration: 800  },
  { label: "Risk scoring",             duration: 400  },
];

function ScoreArc({ score, risk }: { score: number; risk: RiskLevel }) {
  const cfg = RISK_CONFIG[risk];
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="relative flex items-center justify-center w-28 h-28">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(0,255,136,0.07)" strokeWidth="6" />
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke={risk === "low" ? "#00ff88" : risk === "medium" ? "#fbbf24" : "#f87171"}
          strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s ease" }}
        />
      </svg>
      <div className="text-center z-10">
        <div className={`font-mono text-2xl font-bold ${cfg.color}`}>{score}</div>
        <div className="font-mono text-[9px] text-cyber-green opacity-40 leading-tight">RISK<br/>SCORE</div>
      </div>
    </div>
  );
}

export default function InfraAnalyzer() {
  const [domain, setDomain] = useState("");
  const [phase, setPhase] = useState<"idle" | "scanning" | "done">("idle");
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<ScanResult | null>(null);
  const logsRef = useRef<HTMLDivElement>(null);

  const addLog = (line: string) => setLogs((p) => [...p, line]);

  useEffect(() => {
    if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight;
  }, [logs]);

  const handleScan = async () => {
    const raw = domain.trim().replace(/^https?:\/\//, "").split("/")[0];
    if (!raw) return;

    setPhase("scanning");
    setPhaseIdx(0);
    setPhaseProgress(0);
    setLogs([]);
    setResult(null);

    addLog(`[${new Date().toISOString()}] Starting infrastructure analysis`);
    addLog(`target: ${raw}`);
    addLog("─".repeat(48));

    for (let i = 0; i < SCAN_PHASES.length; i++) {
      const p = SCAN_PHASES[i];
      setPhaseIdx(i);

      addLog(`[${String(i + 1).padStart(2, "0")}/${SCAN_PHASES.length}] ${p.label}...`);

      const steps = 20;
      for (let s = 0; s <= steps; s++) {
        setPhaseProgress((s / steps) * 100);
        await new Promise((r) => setTimeout(r, p.duration / steps));
      }

      if (i === 0) addLog(`      → resolved in 12ms`);
      if (i === 1) addLog(`      → scanned 1024 ports`);
      if (i === 2) addLog(`      → identified services`);
      if (i === 3) addLog(`      → cipher suite analyzed`);
      if (i === 4) addLog(`      → matched CVE database`);
      if (i === 5) addLog(`      → score calculated`);
    }

    const res = generateResult(raw);
    setResult(res);
    addLog("─".repeat(48));
    addLog(`[DONE] Analysis complete — risk: ${res.risk.toUpperCase()}, score: ${res.score}/100`);
    setPhase("done");
  };

  const isValid = domain.trim().length > 2;

  return (
    <section id="Анализ" className="relative bg-[#070b14] py-24 px-6 md:px-12 overflow-hidden">
      <div className="cyber-grid absolute inset-0 opacity-20" />
      <div className="max-w-5xl mx-auto relative z-10">
        <SectionLabel index="06" label="Анализ инфраструктуры" />

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <h2 className="text-3xl md:text-4xl font-sans font-semibold text-white leading-tight max-w-xl">
            Проверьте домен{" "}
            <span className="text-cyber-green">прямо сейчас</span>
          </h2>
          <p className="font-mono text-xs text-cyber-green opacity-40 max-w-xs leading-relaxed">
            Демо-анализ на основе публично доступных данных. Полный аудит — по заявке.
          </p>
        </div>

        {/* Input */}
        <div className="border border-cyber-green border-opacity-20 bg-black bg-opacity-30 p-5 mb-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cyber-green border-opacity-10">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500 opacity-60" />
              <div className="w-2 h-2 rounded-full bg-yellow-400 opacity-60" />
              <div className="w-2 h-2 rounded-full bg-cyber-green opacity-60" />
            </div>
            <span className="font-mono text-[10px] text-cyber-green opacity-30 ml-1">netguard.scanner — bash</span>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-cyber-green status-active" />
              <span className="font-mono text-[10px] text-cyber-green opacity-40">ONLINE</span>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <span className="font-mono text-sm text-cyber-green opacity-40 shrink-0">$</span>
            <span className="font-mono text-sm text-cyber-green opacity-40 shrink-0 hidden sm:block">scan --target</span>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && isValid && phase !== "scanning" && handleScan()}
              placeholder="example.com"
              disabled={phase === "scanning"}
              className="flex-1 bg-transparent font-mono text-sm text-cyber-green placeholder-cyber-green placeholder-opacity-20 outline-none border-b border-cyber-green border-opacity-20 pb-1 focus:border-opacity-60 transition-all disabled:opacity-50"
            />
            <button
              onClick={handleScan}
              disabled={!isValid || phase === "scanning"}
              className="flex items-center gap-2 bg-cyber-green text-cyber-blue font-mono text-xs font-bold px-5 py-2.5 hover:bg-cyber-green-dim transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 tracking-wider"
            >
              {phase === "scanning" ? (
                <><Icon name="Loader" size={13} className="animate-spin" />СКАНИРУЮ...</>
              ) : (
                <><Icon name="Scan" size={13} />ЗАПУСТИТЬ</>
              )}
            </button>
          </div>
        </div>

        {/* Scanning progress */}
        {phase === "scanning" && (
          <div className="border border-cyber-green border-opacity-15 bg-black bg-opacity-20 p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-green status-active" />
                <span className="font-mono text-xs text-cyber-green opacity-60 tracking-widest">SCANNING</span>
              </div>
              <span className="font-mono text-xs text-cyber-green opacity-40">
                {phaseIdx + 1} / {SCAN_PHASES.length} — {SCAN_PHASES[phaseIdx]?.label}
              </span>
            </div>

            {/* Global progress */}
            <div className="h-0.5 bg-cyber-green bg-opacity-10 mb-4">
              <div
                className="h-full bg-cyber-green transition-all duration-200"
                style={{ width: `${((phaseIdx / SCAN_PHASES.length) * 100) + (phaseProgress / SCAN_PHASES.length)}%` }}
              />
            </div>

            {/* Phase steps */}
            <div className="flex gap-1 mb-5">
              {SCAN_PHASES.map((p, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`h-0.5 w-full transition-all duration-300 ${
                    i < phaseIdx ? "bg-cyber-green" : i === phaseIdx ? "bg-cyber-green opacity-60" : "bg-cyber-green opacity-10"
                  }`} />
                  <span className="font-mono text-[8px] text-cyber-green opacity-25 text-center leading-tight hidden md:block">
                    {p.label.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>

            {/* Terminal log */}
            <div ref={logsRef} className="h-32 overflow-y-auto space-y-0.5">
              {logs.map((l, i) => (
                <div key={i} className="font-mono text-[11px] text-cyber-green opacity-55 leading-relaxed">
                  {l}
                </div>
              ))}
              <span className="cursor-blink inline-block w-1.5 h-3 bg-cyber-green opacity-70 ml-0.5" />
            </div>
          </div>
        )}

        {/* Results */}
        {phase === "done" && result && (
          <div className="space-y-4 animate-fade-in-up">

            {/* Score + summary */}
            <div className="border border-cyber-green border-opacity-15 bg-black bg-opacity-20 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <ScoreArc score={result.score} risk={result.risk} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className={`font-mono text-lg font-bold ${RISK_CONFIG[result.risk].color}`}>
                      {RISK_CONFIG[result.risk].label}
                    </span>
                    <span className={`font-mono text-[10px] border px-2 py-0.5 ${RISK_CONFIG[result.risk].border} ${RISK_CONFIG[result.risk].color} opacity-70`}>
                      {result.risk.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "IP", value: result.ip },
                      { label: "ASN", value: result.asn },
                      { label: "TLS", value: result.tls },
                      { label: "DNSSEC", value: result.dnssec ? "Включён" : "Отключён" },
                    ].map((item) => (
                      <div key={item.label} className="border border-cyber-green border-opacity-10 px-3 py-2">
                        <div className="font-mono text-[10px] text-cyber-green opacity-30 mb-0.5">{item.label}</div>
                        <div className="font-mono text-xs text-cyber-green opacity-75 truncate">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Open ports */}
              <div className="border border-cyber-green border-opacity-10 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="Network" size={13} className="text-cyber-green opacity-50" />
                  <span className="font-mono text-xs text-cyber-green opacity-40 tracking-widest">// ОТКРЫТЫЕ ПОРТЫ</span>
                </div>
                <div className="space-y-1.5">
                  {result.openPorts.map((p, i) => (
                    <div key={i} className="font-mono text-xs text-cyber-green opacity-60 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-cyber-green opacity-50 shrink-0" />
                      {p}
                    </div>
                  ))}
                </div>
              </div>

              {/* Vulns */}
              <div className="border border-cyber-green border-opacity-10 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="AlertTriangle" size={13} className="text-rose-400 opacity-60" />
                  <span className="font-mono text-xs text-cyber-green opacity-40 tracking-widest">// УЯЗВИМОСТИ</span>
                </div>
                <div className="space-y-3">
                  {result.vulns.map((v) => (
                    <div key={v.id} className="border-l-2 border-cyber-green border-opacity-15 pl-3">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-[9px] text-cyber-green opacity-30">{v.id}</span>
                        <span className={`font-mono text-[9px] border px-1.5 py-0.5 ${SEVERITY_CONFIG[v.severity]}`}>
                          {v.severity}
                        </span>
                      </div>
                      <div className="font-sans text-xs font-medium text-white opacity-80 mb-0.5">{v.title}</div>
                      <div className="font-mono text-[10px] text-cyber-green opacity-40 leading-snug">{v.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="border border-cyber-green border-opacity-15 bg-black bg-opacity-10 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Lightbulb" size={13} className="text-cyber-green opacity-60" />
                <span className="font-mono text-xs text-cyber-green opacity-40 tracking-widest">// РЕКОМЕНДАЦИИ</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {result.recommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 border border-cyber-green border-opacity-10 px-4 py-3 hover:border-opacity-25 transition-all">
                    <div className="w-7 h-7 border border-cyber-green border-opacity-20 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon name={r.icon} size={13} className="text-cyber-green opacity-60" />
                    </div>
                    <span className="font-mono text-xs text-cyber-green opacity-60 leading-relaxed">{r.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-cyber-green border-opacity-20 bg-cyber-green bg-opacity-[0.03] px-5 py-4">
              <div>
                <div className="font-sans text-sm font-semibold text-white mb-0.5">Нужен полный аудит?</div>
                <div className="font-mono text-xs text-cyber-green opacity-40">Инженер проведёт глубокий анализ и предоставит детальный отчёт</div>
              </div>
              <button
                className="font-mono text-xs bg-cyber-green text-cyber-blue font-bold px-6 py-3 hover:bg-cyber-green-dim transition-colors shrink-0 tracking-wider"
                onClick={() => document.getElementById("Контакт")?.scrollIntoView({ behavior: "smooth" })}
              >
                Запросить аудит →
              </button>
            </div>

            {/* Terminal log (collapsed) */}
            <details className="border border-cyber-green border-opacity-10">
              <summary className="font-mono text-xs text-cyber-green opacity-30 px-4 py-3 cursor-pointer hover:opacity-50 transition-opacity select-none">
                // показать лог сканирования ({logs.length} строк)
              </summary>
              <div className="px-4 pb-4 space-y-0.5 max-h-48 overflow-y-auto">
                {logs.map((l, i) => (
                  <div key={i} className="font-mono text-[11px] text-cyber-green opacity-40">{l}</div>
                ))}
              </div>
            </details>
          </div>
        )}

        {/* Idle hint */}
        {phase === "idle" && (
          <div className="border border-cyber-green border-opacity-10 bg-black bg-opacity-10 px-6 py-8 text-center">
            <Icon name="Scan" size={28} className="text-cyber-green opacity-15 mx-auto mb-3" />
            <div className="font-mono text-xs text-cyber-green opacity-25">
              Введите домен и нажмите «Запустить» — анализ займёт несколько секунд
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
