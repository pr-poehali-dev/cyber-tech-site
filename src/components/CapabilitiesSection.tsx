import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionLabel from "./SectionLabel";
import Icon from "@/components/ui/icon";
import { CAPABILITIES } from "@/data/capabilities";

const TAG_COLORS: Record<string, string> = {
  CRYPTO: "text-cyber-green border-cyber-green",
  ARCH: "text-sky-400 border-sky-400",
  PRIVACY: "text-violet-400 border-violet-400",
  STEALTH: "text-rose-400 border-rose-400",
  ROUTING: "text-amber-400 border-amber-400",
  RESILIENCE: "text-orange-400 border-orange-400",
  HW: "text-cyan-400 border-cyan-400",
  MGMT: "text-emerald-400 border-emerald-400",
};

export default function CapabilitiesSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const navigate = useNavigate();

  return (
    <section id="Возможности" className="relative bg-cyber-blue py-24 px-6 md:px-12 overflow-hidden">
      <div className="cyber-grid absolute inset-0 opacity-25" />

      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,255,136,0.04) 0%, transparent 70%)",
          opacity: hovered !== null ? 1 : 0,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionLabel index="05" label="Возможности системы" />

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <h2 className="text-3xl md:text-4xl font-sans font-semibold text-white leading-tight max-w-xl">
            Инженерные решения,{" "}
            <span className="text-cyber-green">а не маркетинговые обещания</span>
          </h2>
          <div className="font-mono text-xs text-cyber-green opacity-40 max-w-xs leading-relaxed">
            Каждая возможность реализована на уровне протоколов и железа — не на уровне настроек ПО.
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-cyber-green bg-opacity-[0.07]">
          {CAPABILITIES.map((cap, i) => {
            const isHovered = hovered === i;
            const isExpanded = expanded === i;

            return (
              <div
                key={cap.title}
                className="relative bg-cyber-blue p-0 group cursor-pointer"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setExpanded(isExpanded ? null : i)}
              >
                <div
                  className="absolute inset-0 bg-cyber-green pointer-events-none transition-opacity duration-300"
                  style={{ opacity: isHovered ? 0.025 : 0 }}
                />
                <div
                  className="absolute left-0 top-0 w-0.5 bg-cyber-green transition-all duration-500"
                  style={{ height: isHovered || isExpanded ? "100%" : "0%" }}
                />

                <div className="relative px-6 py-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 border flex items-center justify-center transition-all duration-300 ${
                          isHovered
                            ? "border-cyber-green bg-cyber-green bg-opacity-10"
                            : "border-cyber-green border-opacity-20"
                        }`}
                      >
                        <Icon
                          name={cap.icon}
                          size={18}
                          className={`transition-all duration-300 ${isHovered ? "text-cyber-green" : "text-cyber-green opacity-50"}`}
                        />
                      </div>
                      <div>
                        <h3 className={`font-sans text-sm font-semibold leading-snug transition-colors duration-200 ${isHovered ? "text-white" : "text-white opacity-80"}`}>
                          {cap.title}
                        </h3>
                        <div className="font-mono text-[10px] text-cyber-green opacity-30 mt-0.5">{cap.short}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className={`font-mono text-[9px] border px-1.5 py-0.5 opacity-60 ${TAG_COLORS[cap.tag]}`}>
                        {cap.tag}
                      </span>
                      <Icon
                        name="ChevronDown"
                        size={13}
                        className={`text-cyber-green opacity-30 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>

                  <p className={`font-mono text-xs leading-relaxed transition-colors duration-200 ${isHovered ? "text-cyber-green opacity-65" : "text-cyber-green opacity-40"}`}>
                    {cap.summary}
                  </p>

                  <div
                    className="overflow-hidden transition-all duration-500"
                    style={{ maxHeight: isHovered || isExpanded ? "80px" : "0px", opacity: isHovered || isExpanded ? 1 : 0 }}
                  >
                    <div className="mt-4 pt-4 border-t border-cyber-green border-opacity-10 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon name="Terminal" size={11} className="text-cyber-green opacity-30 shrink-0" />
                        <span className="font-mono text-[10px] text-cyber-green opacity-40 leading-snug truncate">
                          {cap.specs[0]?.value}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sessionStorage.setItem("capabilities_scroll_y", String(window.scrollY));
                          navigate(`/capabilities/${cap.slug}`);
                        }}
                        className="font-mono text-[10px] border border-cyber-green border-opacity-30 text-cyber-green opacity-70 hover:opacity-100 hover:border-opacity-60 px-3 py-1 shrink-0 transition-all"
                      >
                        Подробнее →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 border border-cyber-green border-opacity-10 bg-black bg-opacity-20 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-green status-active" />
            <span className="font-mono text-xs text-cyber-green opacity-50">
              Все возможности доступны в рамках аудита инфраструктуры
            </span>
          </div>
          <button
            className="font-mono text-xs border border-cyber-green border-opacity-30 text-cyber-green px-5 py-2.5 hover:bg-cyber-green hover:text-cyber-blue transition-all duration-200 tracking-wider shrink-0"
            onClick={() => {
              document.getElementById("Контакт")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Запросить демо →
          </button>
        </div>
      </div>
    </section>
  );
}