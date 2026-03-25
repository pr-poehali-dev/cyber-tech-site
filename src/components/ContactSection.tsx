import SectionLabel from "./SectionLabel";
import Icon from "@/components/ui/icon";

export default function ContactSection() {
  return (
    <section id="Контакт" className="relative bg-cyber-blue py-24 px-6 md:px-12 overflow-hidden">
      <div className="cyber-grid absolute inset-0 opacity-20" />
      <div className="max-w-6xl mx-auto relative z-10">
        <SectionLabel index="05" label="Связаться с нами" />

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-sans font-semibold text-white leading-tight mb-6">
              Свяжитесь{" "}
              <span className="text-cyber-green">с нами</span>
            </h2>
            <p className="font-mono text-sm text-cyber-green opacity-55 leading-relaxed mb-10">
              Первичный анализ занимает 24–48 часов. Вы получите отчёт с картой уязвимых точек и рекомендациями — без обязательств.
            </p>

            <div className="space-y-6 mb-10">
              {[
                { icon: "Clock",    text: "Ответ инженера в течение 24 часов" },
                { icon: "FileText", text: "Отчёт в PDF с детализацией по каждому узлу" },
                { icon: "Lock",     text: "NDA подписывается до начала работ" },
                { icon: "Users",    text: "Персональный технический менеджер" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-4">
                  <div className="w-8 h-8 border border-cyber-green border-opacity-25 flex items-center justify-center shrink-0">
                    <Icon name={item.icon} size={14} className="text-cyber-green opacity-60" />
                  </div>
                  <span className="font-mono text-sm text-cyber-green opacity-60">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="p-5 border border-cyber-green border-opacity-15 bg-black bg-opacity-30">
              <div className="font-mono text-xs text-cyber-green opacity-30 mb-4 tracking-widest">// КОНТАКТЫ</div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border border-cyber-green border-opacity-20 flex items-center justify-center shrink-0">
                    <Icon name="Mail" size={13} className="text-cyber-green opacity-50" />
                  </div>
                  <a
                    href="mailto:info@инфо-безопасность.рф"
                    className="font-mono text-sm text-cyber-green opacity-65 hover:opacity-100 transition-opacity"
                  >
                    info@инфо-безопасность.рф
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border border-cyber-green border-opacity-20 flex items-center justify-center shrink-0">
                    <Icon name="MessageSquare" size={13} className="text-cyber-green opacity-50" />
                  </div>
                  <a
                    href="https://t.me/infosec_rf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-cyber-green opacity-65 hover:opacity-100 transition-opacity"
                  >
                    Telegram: @infosec_rf
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border border-cyber-green border-opacity-20 flex items-center justify-center shrink-0">
                    <Icon name="Clock" size={13} className="text-cyber-green opacity-50" />
                  </div>
                  <span className="font-mono text-sm text-cyber-green opacity-50">Пн–Пт 9:00–20:00 МСК</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — status panel */}
          <div className="border border-cyber-green border-opacity-15 bg-black bg-opacity-20">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-cyber-green border-opacity-10">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500 opacity-60" />
                <div className="w-2 h-2 rounded-full bg-yellow-500 opacity-60" />
                <div className="w-2 h-2 rounded-full bg-cyber-green opacity-60" />
              </div>
              <span className="font-mono text-xs text-cyber-green opacity-30 ml-2">system.status</span>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-green status-active" />
                <span className="font-mono text-[10px] text-cyber-green opacity-40">ONLINE</span>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {[
                { label: "Приём заявок",        value: "Активно",      ok: true  },
                { label: "Инженеры на связи",   value: "Доступны",     ok: true  },
                { label: "Время реакции",        value: "< 24 ч",       ok: true  },
                { label: "NDA / конфиденциальность", value: "Обязательно", ok: true },

              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between border-b border-cyber-green border-opacity-5 pb-4 last:border-b-0 last:pb-0">
                  <span className="font-mono text-xs text-cyber-green opacity-40">{row.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${row.ok ? "bg-cyber-green status-active" : "bg-rose-500"}`} />
                    <span className={`font-mono text-xs ${row.ok ? "text-cyber-green opacity-75" : "text-rose-400"}`}>{row.value}</span>
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t border-cyber-green border-opacity-10">
                <div className="font-mono text-[10px] text-cyber-green opacity-25 mb-3 tracking-widest">// КАК НАПИСАТЬ</div>
                <div className="space-y-2">
                  <div className="font-mono text-xs text-cyber-green opacity-45 leading-relaxed">
                    1. Опишите задачу в свободной форме
                  </div>
                  <div className="font-mono text-xs text-cyber-green opacity-45 leading-relaxed">
                    2. Укажите примерный масштаб инфраструктуры
                  </div>
                  <div className="font-mono text-xs text-cyber-green opacity-45 leading-relaxed">
                    3. Инженер свяжется и уточнит детали
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}