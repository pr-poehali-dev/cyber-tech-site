import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

export default function ContactPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-black px-4 md:px-8 py-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 mb-8 transition-colors"
      >
        <Icon name="ArrowLeft" size={15} />
        Назад
      </button>

      <div className="mb-10">
        <span className="font-mono text-xs tracking-widest text-white/30 border border-white/15 px-2 py-1 inline-block mb-4">
          CONTACT
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Свяжитесь с нами
        </h1>
        <p className="text-base text-white/50 max-w-lg leading-relaxed">
          Расскажите о задаче — инженер ответит в течение нескольких часов и предложит подходящее решение.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contacts */}
        <div className="border border-white/10 bg-white/[0.02] p-6">
          <div className="font-mono text-xs text-white/30 mb-6 tracking-widest">// КОНТАКТЫ</div>
          <div className="space-y-5">
            {[
              { icon: "Mail", label: "Email", value: "info@инфо-безопасность.рф", href: "mailto:info@инфо-безопасность.рф" },
              { icon: "MessageSquare", label: "Telegram", value: "@infosec_rf", href: "https://t.me/infosec_rf" },
              { icon: "Clock", label: "Часы работы", value: "Пн–Пт 9:00–20:00 МСК", href: null },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <div className="w-10 h-10 border border-white/15 flex items-center justify-center shrink-0">
                  <Icon name={item.icon} size={16} className="text-white/50" />
                </div>
                <div>
                  <div className="text-xs text-white/30 mb-0.5">{item.label}</div>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                      className="text-base text-white/70 hover:text-white transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-base text-white/55">{item.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="font-mono text-xs text-white/30 mb-4 tracking-widest">// КАК НАПИСАТЬ</div>
            {["Опишите задачу в свободной форме", "Укажите примерный масштаб", "Инженер свяжется и уточнит детали"].map((step, i) => (
              <div key={step} className="flex items-start gap-3 mb-3">
                <span className="text-sm text-white/25 mt-0.5 shrink-0 font-mono">{i + 1}.</span>
                <span className="text-sm text-white/50 leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status panel */}
        <div className="border border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/10">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/60" />
            </div>
            <span className="font-mono text-xs text-white/30 ml-2">system.status</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="font-mono text-xs text-white/40">ONLINE</span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {[
              { label: "Приём заявок", value: "Активно" },
              { label: "Инженеры на связи", value: "Доступны" },
              { label: "Время реакции", value: "< 24 ч" },
              { label: "Конфиденциальность", value: "NDA обязательно" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0 last:pb-0">
                <span className="text-sm text-white/40">{row.label}</span>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span className="text-sm font-medium text-white/75">{row.value}</span>
                </div>
              </div>
            ))}

            <div className="pt-2 space-y-3">
              {[
                { icon: "Clock", text: "Ответ инженера в течение 24 часов" },
                { icon: "FileText", text: "Отчёт в PDF с детализацией" },
                { icon: "Lock", text: "NDA до начала работ" },
                { icon: "Users", text: "Персональный менеджер" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="w-7 h-7 border border-white/15 flex items-center justify-center shrink-0">
                    <Icon name={item.icon} size={13} className="text-white/40" />
                  </div>
                  <span className="text-sm text-white/50">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
