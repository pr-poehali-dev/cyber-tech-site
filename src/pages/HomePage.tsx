import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const SECTIONS = [
  {
    path: "/personal-security",
    icon: "ShieldCheck",
    badge: "PERSONAL",
    title: "Личная цифровая безопасность",
    desc: "Анонимность, шифрование трафика, отсутствие цифрового следа и доступ к любым ресурсам",
    color: "text-white",
    border: "border-white/15",
    bg: "from-white/[0.03]",
    hover: "hover:border-white/40",
    tags: ["Без цифрового следа", "Шифрование E2E", "Анонимность", "Свободный доступ"],
  },
  {
    path: "/business",
    icon: "Building2",
    badge: "BUSINESS",
    title: "Безопасность для бизнеса",
    desc: "Защита корпоративной инфраструктуры, сегментация сети, мониторинг и управление доступом",
    color: "text-white",
    border: "border-white/15",
    bg: "from-white/[0.03]",
    hover: "hover:border-white/40",
    tags: ["Малый офис", "Корпорация", "Zero Trust", "SIEM"],
  },
  {
    path: "/capabilities",
    icon: "Cpu",
    badge: "TECH",
    title: "Технологии и возможности",
    desc: "Технические детали: протоколы, архитектура, алгоритмы шифрования и схемы работы",
    color: "text-white",
    border: "border-white/15",
    bg: "from-white/[0.03]",
    hover: "hover:border-white/40",
    tags: ["WireGuard", "AES-256", "eBPF", "Noise Protocol"],
  },
  {
    path: "/contact",
    icon: "MessageSquare",
    badge: "CONTACT",
    title: "Связаться с нами",
    desc: "Консультация, подбор решения, подключение. Отвечаем в течение нескольких часов",
    color: "text-white",
    border: "border-white/15",
    bg: "from-white/[0.03]",
    hover: "hover:border-white/40",
    tags: ["Консультация", "Быстрый ответ", "Без обязательств"],
  },
];

const STATS = [
  { value: "99.97%", label: "Uptime" },
  { value: "<2ms", label: "Задержка" },
  { value: "AES-256", label: "Шифрование" },
  { value: "24/7", label: "Поддержка" },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-black px-4 md:px-8 py-8 max-w-5xl mx-auto">
      {/* Hero block */}
      <div className="mb-8 border border-white/10 bg-white/[0.02] p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="font-mono text-xs text-white/40 tracking-widest">СИСТЕМА АКТИВНА</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-sans font-bold text-white leading-tight mb-3">
          Защита цифрового<br />
          <span className="text-white/60">пространства</span>
        </h1>
        <p className="text-base text-white/50 max-w-lg leading-relaxed mb-6">
          Комплексные решения для личной и корпоративной кибербезопасности — от шифрования трафика до защиты корпоративной инфраструктуры
        </p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-0 border border-white/10">
          {STATS.map((s, i) => (
            <div key={s.label} className={`flex flex-col items-center py-3 px-2 ${i < 3 ? "border-r border-white/10" : ""}`}>
              <span className="font-mono text-sm md:text-base font-bold text-white">{s.value}</span>
              <span className="text-xs text-white/30 mt-0.5 text-center">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation cards */}
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {SECTIONS.map((section) => (
          <button
            key={section.path}
            onClick={() => navigate(section.path)}
            className={`text-left border ${section.border} ${section.hover} bg-gradient-to-br ${section.bg} to-transparent p-6 transition-all duration-200 group`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 border border-white/20 flex items-center justify-center">
                <Icon name={section.icon} size={17} className="text-white/70" />
              </div>
              <Icon name="ArrowRight" size={15} className="text-white/0 group-hover:text-white/40 transition-all mt-1" />
            </div>

            <div className="text-base font-semibold text-white mb-2">
              {section.title}
            </div>
            <p className="text-sm text-white/45 leading-relaxed mb-4">
              {section.desc}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {section.tags.map((tag) => (
                <span key={tag} className="font-mono text-[10px] border border-white/15 text-white/35 px-2 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Bottom status */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-white rounded-full" />
          <span className="text-sm text-white/30">Все системы работают</span>
        </div>
        <span className="font-mono text-xs text-white/20">v2.4.1</span>
      </div>
    </div>
  );
}
