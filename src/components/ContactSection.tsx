import { useState } from "react";
import SectionLabel from "./SectionLabel";
import Icon from "@/components/ui/icon";

const INFRA_TYPES = [
  "Корпоративная сеть",
  "ЦОД / Co-location",
  "Гибридная облачная",
  "Промышленная сеть (OT/ICS)",
  "Другое",
];

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    contact: "",
    infraType: "",
    nodes: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);

  const addLine = (line: string) =>
    setTerminalLines((prev) => [...prev, line]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTerminalLines([]);

    await new Promise((r) => setTimeout(r, 300));
    addLine("init.request_handler v2.1");
    await new Promise((r) => setTimeout(r, 400));
    addLine(`validating fields... OK`);
    await new Promise((r) => setTimeout(r, 400));
    addLine(`encrypting payload [AES-256]...`);
    await new Promise((r) => setTimeout(r, 500));
    addLine(`transmitting to secure endpoint...`);
    await new Promise((r) => setTimeout(r, 600));
    addLine(`[200 OK] request queued`);
    await new Promise((r) => setTimeout(r, 300));
    addLine(`engineer assignment: pending`);
    await new Promise((r) => setTimeout(r, 300));
    addLine(`expected response: < 24h`);

    setLoading(false);
    setSubmitted(true);
  };

  const field =
    "w-full bg-transparent border border-cyber-green border-opacity-20 text-cyber-green font-mono text-sm px-4 py-3 focus:outline-none focus:border-opacity-60 placeholder-cyber-green placeholder-opacity-20 transition-all";

  return (
    <section id="Контакт" className="relative bg-cyber-blue py-24 px-6 md:px-12 overflow-hidden">
      <div className="cyber-grid absolute inset-0 opacity-20" />
      <div className="max-w-6xl mx-auto relative z-10">
        <SectionLabel index="05" label="Заявка на проверку" />

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-sans font-semibold text-white leading-tight mb-6">
              Проверим инфраструктуру{" "}
              <span className="text-cyber-green"></span>
            </h2>
            <p className="font-mono text-sm text-cyber-green opacity-55 leading-relaxed mb-10">
              Первичный анализ занимает 24–48 часов. Вы получите отчёт с картой уязвимых точек и рекомендациями — без обязательств.
            </p>

            <div className="space-y-6">
              {[
                { icon: "Clock", text: "Ответ инженера в течение 24 часов" },
                { icon: "FileText", text: "Отчёт в PDF с детализацией по каждому узлу" },
                { icon: "Lock", text: "NDA подписывается до начала работ" },
                { icon: "Users", text: "Персональный технический менеджер" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-4">
                  <div className="w-8 h-8 border border-cyber-green border-opacity-25 flex items-center justify-center shrink-0">
                    <Icon name={item.icon} size={14} className="text-cyber-green opacity-60" />
                  </div>
                  <span className="font-mono text-sm text-cyber-green opacity-60">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 p-4 border border-cyber-green border-opacity-15 bg-black bg-opacity-30">
              <div className="font-mono text-xs text-cyber-green opacity-30 mb-3">// КОНТАКТЫ</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon name="Mail" size={12} className="text-cyber-green opacity-40" />
                  <span className="font-mono text-xs text-cyber-green opacity-60">info@инфо-безопасность.рф</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="MessageSquare" size={12} className="text-cyber-green opacity-40" />
                  <span className="font-mono text-xs text-cyber-green opacity-60">Telegram: @infosec_rf</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-cyber-green border-opacity-15 bg-black bg-opacity-20">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-cyber-green border-opacity-10">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500 opacity-70" />
                <div className="w-2 h-2 rounded-full bg-yellow-500 opacity-70" />
                <div className="w-2 h-2 rounded-full bg-cyber-green opacity-70" />
              </div>
              <span className="font-mono text-xs text-cyber-green opacity-30 ml-2">request.form</span>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-xs text-cyber-green opacity-40 block mb-1">ИМЯ *</label>
                    <input
                      className={field}
                      placeholder="Алексей"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="font-mono text-xs text-cyber-green opacity-40 block mb-1">КОМПАНИЯ *</label>
                    <input
                      className={field}
                      placeholder="ООО Пример"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-xs text-cyber-green opacity-40 block mb-1">EMAIL / TELEGRAM *</label>
                  <input
                    className={field}
                    placeholder="a@company.ru или @username"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-cyber-green opacity-40 block mb-1">ТИП ИНФРАСТРУКТУРЫ</label>
                  <select
                    className={`${field} appearance-none cursor-pointer`}
                    value={form.infraType}
                    onChange={(e) => setForm({ ...form, infraType: e.target.value })}
                  >
                    <option value="" className="bg-[#060a12]">Выбрать...</option>
                    {INFRA_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-[#060a12]">{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-mono text-xs text-cyber-green opacity-40 block mb-1">КОЛИЧЕСТВО УЗЛОВ</label>
                  <input
                    className={field}
                    placeholder="например: 50–200"
                    value={form.nodes}
                    onChange={(e) => setForm({ ...form, nodes: e.target.value })}
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-cyber-green opacity-40 block mb-1">ОПИСАНИЕ ЗАДАЧИ</label>
                  <textarea
                    className={`${field} resize-none h-24`}
                    placeholder="Опишите задачу или проблему..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                {terminalLines.length > 0 && (
                  <div className="bg-black bg-opacity-50 border border-cyber-green border-opacity-10 p-3">
                    {terminalLines.map((line, i) => (
                      <div key={i} className="font-mono text-xs text-cyber-green opacity-60 flex gap-2">
                        <span className="opacity-40">$</span>
                        <span>{line}</span>
                      </div>
                    ))}
                    {loading && (
                      <span className="cursor-blink inline-block w-2 h-3 bg-cyber-green ml-5 opacity-80" />
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-cyber-green text-cyber-blue font-mono text-sm font-bold py-4 hover:bg-cyber-green-dim transition-all duration-200 disabled:opacity-50 tracking-wider"
                >
                  {loading ? (
                    <>
                      <Icon name="Loader" size={16} className="animate-spin" />
                      ОТПРАВКА...
                    </>
                  ) : (
                    <>
                      <Icon name="Send" size={16} />
                      ОТПРАВИТЬ ЗАЯВКУ
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 border-2 border-cyber-green flex items-center justify-center mx-auto mb-6">
                  <Icon name="CheckCheck" size={28} className="text-cyber-green" />
                </div>
                <h3 className="font-sans text-xl font-semibold text-white mb-3">Заявка принята</h3>
                <p className="font-mono text-sm text-cyber-green opacity-55 leading-relaxed mb-6">
                  Инженер свяжется в течение 24 часов. Проверьте почту или Telegram.
                </p>
                <div className="bg-black bg-opacity-40 p-4 text-left">
                  {terminalLines.map((line, i) => (
                    <div key={i} className="font-mono text-xs text-cyber-green opacity-50 flex gap-2">
                      <span className="opacity-40">$</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}