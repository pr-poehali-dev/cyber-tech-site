import { useState } from "react";
import SectionLabel from "./SectionLabel";
import Icon from "@/components/ui/icon";

const TIERS = [
  {
    id: "01",
    icon: "User",
    scale: "Личное",
    title: "Личная информационная безопасность",
    subtitle: "Для одного пользователя",
    color: "from-cyber-green/5 to-transparent",
    accent: "border-cyber-green/40",
    badge: "PERSONAL",
    desc: "Шифрование всего исходящего и входящего трафика с устройства. Защита от перехвата данных в публичных и домашних сетях. Контроль DNS-запросов с блокировкой трекеров и вредоносных доменов.",
    features: [
      "Шифрование трафика на уровне устройства",
      "Защищённый DNS с фильтрацией",
      "Блокировка трекеров и рекламных сетей",
      "Уведомления о подозрительной активности",
      "Работает на macOS, Windows, iOS, Android",
    ],
    nodes: "1 устройство",
  },
  {
    id: "02",
    icon: "Users",
    scale: "Семья",
    title: "Безопасность для семьи",
    subtitle: "До 5 устройств",
    color: "from-sky-500/5 to-transparent",
    accent: "border-sky-500/30",
    badge: "FAMILY",
    desc: "Единый защищённый контур для всех устройств семьи. Родительский контроль на уровне сети, изоляция детских устройств, защита от фишинга и вредоносных сайтов без установки агентов на каждое устройство.",
    features: [
      "Единый защищённый контур для 5 устройств",
      "Родительский контроль на уровне DNS",
      "Изоляция устройств друг от друга",
      "Фильтрация вредоносных и нежелательных ресурсов",
      "Единая консоль управления",
      "Оповещения при нарушении политик",
    ],
    nodes: "до 5 устройств",
  },
  {
    id: "03",
    icon: "Home",
    scale: "Дом",
    title: "Защищённая домашняя сеть",
    subtitle: "Защита на уровне роутера",
    color: "from-violet-500/5 to-transparent",
    accent: "border-violet-500/30",
    badge: "HOME",
    desc: "Защита на уровне домашнего роутера: весь трафик сегментируется ещё до выхода в интернет. Отдельные зоны для рабочих устройств, смартфонов и IoT. Шифрование трафика от роутера до точки выхода.",
    features: [
      "Установка на уровне роутера (без агентов)",
      "Сегментация на рабочую, личную и IoT-зону",
      "Шифрование трафика от роутера до точки выхода",
      "Мониторинг всех подключённых устройств",
      "Автоблокировка неизвестных устройств",
      "Поддержка Raspberry Pi, OpenWRT, MikroTik",
    ],
    nodes: "неограниченно устройств",
  },
  {
    id: "04",
    icon: "Building",
    scale: "Малый офис",
    title: "Малый офис",
    subtitle: "До 10 сотрудников",
    color: "from-amber-500/5 to-transparent",
    accent: "border-amber-500/30",
    badge: "SMB",
    desc: "Защищённая рабочая сеть без выделенного IT-отдела. Изоляция рабочего трафика от личного, контроль доступа к корпоративным ресурсам, шифрование данных в транзите. Настройка — удалённо, за 1 день.",
    features: [
      "Изолированная рабочая сеть для сотрудников",
      "Контроль доступа к корпоративным ресурсам",
      "Шифрование всего трафика в офисе",
      "Гостевая Wi-Fi зона с изоляцией",
      "Защита от утечки данных",
      "Удалённая настройка и поддержка",
      "Отчёт о сетевой активности",
    ],
    nodes: "до 10 рабочих мест",
  },
  {
    id: "05",
    icon: "Briefcase",
    scale: "Офис",
    title: "Офис",
    subtitle: "10–100 сотрудников",
    color: "from-orange-500/5 to-transparent",
    accent: "border-orange-500/30",
    badge: "BUSINESS",
    desc: "Корпоративная сетевая безопасность с полным контролем трафика. Микросегментация по отделам, политики доступа на уровне пользователя, мониторинг в реальном времени. Интеграция с Active Directory / LDAP.",
    features: [
      "Микросегментация по отделам и ролям",
      "Интеграция с Active Directory / LDAP",
      "Мониторинг трафика в реальном времени",
      "DLP: контроль передачи данных наружу",
      "Журнал всех сетевых событий",
      "Система обнаружения вторжений (IDS)",
      "Выделенный технический менеджер",
      "SLA 99.9%, время реакции < 1 ч",
    ],
    nodes: "10–100 рабочих мест",
  },
  {
    id: "06",
    icon: "Globe",
    scale: "Корпорация",
    title: "Распределённая корпоративная сеть",
    subtitle: "Несколько офисов / ЦОД",
    color: "from-rose-500/5 to-transparent",
    accent: "border-rose-500/30",
    badge: "ENTERPRISE",
    desc: "Единая защищённая сеть между офисами, ЦОД и облачными средами. Шифрованные каналы связи между узлами, централизованное управление политиками, Zero Trust-архитектура. Масштабируется без изменения структуры.",
    features: [
      "Шифрованные каналы между офисами и ЦОД",
      "Zero Trust Network Access (ZTNA)",
      "Централизованное управление политиками",
      "SD-WAN с контролем качества канала",
      "Мультиоблачная сегментация трафика",
      "Автоматическое восстановление каналов",
      "SIEM-интеграция и форензика",
      "Индивидуальный SLA, 24/7 NOC",
      "Аудит и сертификация по запросу",
    ],
    nodes: "неограниченно",
  },
];

const SCALE_ICONS = ["User", "Users", "Home", "Building", "Briefcase", "Globe"];

export default function ProductTiersSection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="Продукты" className="relative bg-[#070b14] py-24 px-6 md:px-12 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <SectionLabel index="03" label="Продуктовая линейка" />

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-6">
          <h2 className="text-3xl md:text-4xl font-sans font-semibold text-white leading-tight max-w-xl">
            Защита под{" "}
            <span className="text-cyber-green">любой масштаб</span>
          </h2>
          <p className="font-mono text-xs text-cyber-green opacity-40 max-w-xs leading-relaxed">
            От защиты одного устройства до корпоративной сети с несколькими ЦОД. Каждый уровень — отдельный продукт.
          </p>
        </div>

        {/* Scale selector bar */}
        <div className="flex items-center gap-0 mb-10 border border-cyber-green border-opacity-15 overflow-x-auto">
          {TIERS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActive(active === i ? null : i)}
              className={`flex-1 min-w-[80px] flex flex-col items-center gap-1.5 py-3 px-2 border-r border-cyber-green border-opacity-10 last:border-r-0 transition-all duration-200 ${
                active === i
                  ? "bg-cyber-green bg-opacity-10"
                  : "hover:bg-white hover:bg-opacity-[0.02]"
              }`}
            >
              <Icon
                name={SCALE_ICONS[i]}
                size={16}
                className={`transition-all ${active === i ? "text-cyber-green" : "text-cyber-green opacity-30"}`}
              />
              <span
                className={`font-mono text-[10px] tracking-wider text-center leading-tight transition-all ${
                  active === i ? "text-cyber-green" : "text-cyber-green opacity-30"
                }`}
              >
                {t.scale}
              </span>
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TIERS.map((tier, i) => (
            <div
              key={tier.id}
              className={`relative flex flex-col border transition-all duration-300 cursor-pointer bg-gradient-to-b ${tier.color} ${
                active === i
                  ? `${tier.accent} shadow-[0_0_24px_rgba(0,255,136,0.06)]`
                  : "border-cyber-green border-opacity-10 hover:border-opacity-25"
              }`}
              onClick={() => setActive(active === i ? null : i)}
            >
              {/* Header */}
              <div className="p-5 border-b border-cyber-green border-opacity-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 border flex items-center justify-center transition-all ${
                        active === i ? "border-cyber-green border-opacity-60 bg-cyber-green bg-opacity-10" : "border-cyber-green border-opacity-20"
                      }`}
                    >
                      <Icon name={tier.icon} size={15} className="text-cyber-green opacity-70" />
                    </div>
                    <span className="font-mono text-[10px] text-cyber-green opacity-30">{tier.id}</span>
                  </div>
                  <span
                    className={`font-mono text-[10px] border px-2 py-0.5 transition-all ${
                      active === i
                        ? "border-cyber-green text-cyber-green opacity-80"
                        : "border-cyber-green border-opacity-20 text-cyber-green opacity-35"
                    }`}
                  >
                    {tier.badge}
                  </span>
                </div>

                <h3 className="font-sans text-sm font-semibold text-white leading-snug mb-1">{tier.title}</h3>
                <div className="font-mono text-xs text-cyber-green opacity-40">{tier.subtitle}</div>
              </div>

              {/* Description */}
              <div className="px-5 py-4 flex-1">
                <p className="font-mono text-xs text-cyber-green opacity-50 leading-relaxed mb-5">
                  {tier.desc}
                </p>

                {/* Features list */}
                <div className="space-y-2">
                  {tier.features.map((f, fi) => (
                    <div key={fi} className="flex items-start gap-2.5">
                      <span className="shrink-0 mt-0.5 w-3.5 h-3.5 border border-cyber-green border-opacity-30 flex items-center justify-center">
                        <Icon name="Check" size={8} className="text-cyber-green opacity-60" />
                      </span>
                      <span className="font-mono text-xs text-cyber-green opacity-55 leading-snug">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-cyber-green border-opacity-10 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <Icon name="Monitor" size={11} className="text-cyber-green opacity-30" />
                    <span className="font-mono text-[10px] text-cyber-green opacity-35">{tier.nodes}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icon name="Tag" size={11} className="text-cyber-green opacity-30" />
                    <span className="font-mono text-[10px] text-cyber-green opacity-50">По запросу</span>
                  </div>
                </div>
                <button
                  className={`font-mono text-xs px-4 py-2 border transition-all duration-200 ${
                    active === i
                      ? "bg-cyber-green text-cyber-blue border-cyber-green font-bold"
                      : "border-cyber-green border-opacity-25 text-cyber-green opacity-60 hover:opacity-100 hover:border-opacity-50"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const el = document.getElementById("Контакт");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Подробнее →
                </button>
              </div>

              {/* Active indicator line */}
              <div
                className={`absolute bottom-0 left-0 h-0.5 bg-cyber-green transition-all duration-500 ${
                  active === i ? "w-full" : "w-0"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Comparison hint */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="flex-1 h-px bg-cyber-green opacity-5" />
          <span className="font-mono text-xs text-cyber-green opacity-25 whitespace-nowrap">
            Нажмите на карточку, чтобы выделить уровень · Кнопка «Подробнее» отправит вас к форме
          </span>
          <div className="flex-1 h-px bg-cyber-green opacity-5" />
        </div>
      </div>
    </section>
  );
}