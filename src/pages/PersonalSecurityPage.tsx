import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const FEATURES = [
  {
    icon: "EyeOff",
    title: "Отсутствие цифрового следа",
    desc: "Ваши действия в сети не оставляют следов: ни у провайдера, ни у рекламных сетей, ни у государственных систем слежения. История посещений и поведенческие паттерны не фиксируются.",
  },
  {
    icon: "Lock",
    title: "Шифрование трафика",
    desc: "Весь входящий и исходящий трафик шифруется на вашем устройстве до выхода в сеть. Провайдер видит только зашифрованный поток — содержимое и адреса назначения скрыты.",
  },
  {
    icon: "Globe",
    title: "Полная анонимность",
    desc: "Ваш реальный IP-адрес никогда не виден ресурсам, которые вы посещаете. Трафик проходит через изолированные узлы с ротацией адресов — корреляция сессий исключена.",
  },
  {
    icon: "Unlock",
    title: "Доступ к любым ресурсам",
    desc: "Никаких географических блокировок. Любые сайты, сервисы и мессенджеры — Telegram, Signal, WhatsApp — работают без ограничений.",
  },
];

const PLANS = [
  {
    id: "solo",
    icon: "User",
    badge: "SOLO",
    title: "Личный",
    subtitle: "1 устройство",
    price: "990 ₽",
    period: "/ месяц",
    features: [
      "1 устройство (любая ОС)",
      "Шифрование всего трафика",
      "Смена IP по запросу",
      "Анонимный DNS",
      "Блокировка трекеров",
      "Приложение для всех платформ",
    ],
  },
  {
    id: "privacy",
    icon: "ShieldCheck",
    badge: "PRIVACY",
    title: "Приватность",
    subtitle: "3 устройства",
    price: "1 990 ₽",
    period: "/ месяц",
    highlight: true,
    features: [
      "3 устройства одновременно",
      "Шифрование E2E",
      "Автоматическая ротация IP",
      "Анонимный DNS + DoH/DoT",
      "Обфускация трафика (обход DPI)",
      "Доступ к заблокированным ресурсам",
      "Приоритетная поддержка",
    ],
  },
  {
    id: "ghost",
    icon: "Ghost",
    badge: "GHOST",
    title: "Невидимка",
    subtitle: "5 устройств + роутер",
    price: "3 490 ₽",
    period: "/ месяц",
    features: [
      "5 устройств + установка на роутер",
      "Максимальное шифрование AES-256",
      "Уникальный IP на каждое устройство",
      "Маскировка трафика под HTTPS",
      "Защита от анализа трафика",
      "Работа через Tor по запросу",
      "Защита DNS от утечек",
      "Личный менеджер",
    ],
  },
];

export default function PersonalSecurityPage() {
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-black px-4 md:px-8 py-8 max-w-5xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 mb-8 transition-colors"
      >
        <Icon name="ArrowLeft" size={15} />
        Назад
      </button>

      {/* Header */}
      <div className="mb-10">
        <span className="font-mono text-xs tracking-widest text-white/30 border border-white/15 px-2 py-1 inline-block mb-4">
          PERSONAL SECURITY
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
          Личная цифровая безопасность
        </h1>
        <p className="text-base text-white/50 max-w-xl leading-relaxed">
          Полный контроль над вашим цифровым присутствием. Ни один внешний наблюдатель не получит информацию о вашей активности в сети.
        </p>
      </div>

      {/* Features grid */}
      <div className="grid sm:grid-cols-2 gap-3 mb-12">
        {FEATURES.map((f) => (
          <div key={f.title} className="border border-white/10 bg-white/[0.02] p-6">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 text-white/60 shrink-0">
                <Icon name={f.icon} size={20} />
              </div>
              <div>
                <div className="text-base font-semibold text-white mb-2">{f.title}</div>
                <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plans */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-white">Выберите тариф</h2>
        <span className="text-sm text-white/30">Подключение за 24 часа</span>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setActivePlan(activePlan === plan.id ? null : plan.id)}
            className={`relative flex flex-col border cursor-pointer transition-all duration-200 bg-white/[0.02] ${
              plan.highlight ? "ring-1 ring-white/20" : ""
            } ${activePlan === plan.id ? "border-white/50" : "border-white/10 hover:border-white/30"}`}
          >
            {plan.highlight && <div className="absolute -top-px left-0 right-0 h-0.5 bg-white/50" />}
            {plan.highlight && (
              <div className="absolute top-3 right-3">
                <span className="font-mono text-[10px] bg-white/10 text-white/60 border border-white/20 px-1.5 py-0.5">POPULAR</span>
              </div>
            )}

            <div className="p-5 border-b border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Icon name={plan.icon} size={15} className="text-white/50" />
                <span className="font-mono text-[10px] tracking-widest text-white/30">{plan.badge}</span>
              </div>
              <div className="text-lg font-bold text-white mb-0.5">{plan.title}</div>
              <div className="text-sm text-white/35 mb-4">{plan.subtitle}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">{plan.price}</span>
                <span className="text-sm text-white/30">{plan.period}</span>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-2.5 flex-1">
              {plan.features.map((feat) => (
                <div key={feat} className="flex items-start gap-2.5">
                  <Icon name="Check" size={13} className="mt-0.5 shrink-0 text-white/50" />
                  <span className="text-sm text-white/55 leading-snug">{feat}</span>
                </div>
              ))}
            </div>

            <div className="p-5 pt-0">
              <button className={`w-full py-2.5 text-sm font-medium border transition-all ${
                activePlan === plan.id
                  ? "text-white border-white/50 bg-white/10"
                  : "text-white/40 border-white/15 hover:border-white/40 hover:text-white/70"
              }`}>
                {activePlan === plan.id ? "Выбрано — связаться" : "Выбрать"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="border border-white/10 bg-white/[0.02] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-base font-semibold text-white mb-1">Не знаете, какой тариф выбрать?</div>
          <div className="text-sm text-white/45">Расскажите о своей ситуации — подберём оптимальное решение</div>
        </div>
        <button
          onClick={() => navigate("/contact")}
          className="shrink-0 flex items-center gap-2 border border-white/30 text-white text-sm font-medium px-5 py-2.5 hover:bg-white/10 transition-all"
        >
          <Icon name="MessageSquare" size={14} />
          Написать нам
        </button>
      </div>
    </div>
  );
}
