import { useSectionApi } from "@/lib/useSectionApi";
import type { SectionFormProps } from "@/components/dashboard/content/sectionRegistry";

export function HeroSectionForm({ section, onChange }: SectionFormProps) {
  useSectionApi(section, onChange);

  const update = (key: string, value: unknown) => {
    onChange({ ...section, content: { ...section.content, [key]: value } });
  };

  const stats = Array.isArray(section.content.stats) ? section.content.stats : [];

  const updateStat = (index: number, field: string, value: string) => {
    const next = [...stats];
    next[index] = { ...next[index], [field]: value };
    update("stats", next);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow duration-200 hover:shadow-md">
        <h3 className="text-[12px] font-bold text-[#111827]">Section Content</h3>

        <div className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-[12px] font-semibold text-[#111111]">Main Headline</label>
              <input
                value={section.content.headline ?? ""}
                onChange={(e) => update("headline", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
              />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#111111]">Section Subtitle</label>
              <input
                value={section.content.subtitle ?? ""}
                onChange={(e) => update("subtitle", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold text-[#111111]">Description</label>
            <textarea
              value={section.content.description ?? ""}
              onChange={(e) => update("description", e.target.value)}
              className="mt-1 min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-[12px] font-semibold text-[#111111]">Primary CTA Text</label>
              <input
                value={section.content.primaryCtaText ?? ""}
                onChange={(e) => update("primaryCtaText", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
              />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#111111]">Secondary CTA Text</label>
              <input
                value={section.content.secondaryCtaText ?? ""}
                onChange={(e) => update("secondaryCtaText", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
              />
            </div>
          </div>

          {/* <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[11px] font-semibold text-[#111111]">Stats Bar</h3>
              <button type="button" onClick={() => update("stats", [...stats, { label: "", value: "" }])} className="text-[11px] font-semibold text-[#E0475C]">+ Add</button>
            </div>
            <div className="space-y-2">
              {stats.map((stat: { label?: string; value?: string }, index: number) => (
                <div key={`${stat.label ?? "stat"}-${index}`} className="grid gap-2 md:grid-cols-2">
                  <input value={stat.label ?? ""} onChange={(e) => updateStat(index, "label", e.target.value)} placeholder="Label" className="rounded-lg border border-slate-200 px-3 py-2 text-[11px]" />
                  <input value={stat.value ?? ""} onChange={(e) => updateStat(index, "value", e.target.value)} placeholder="Value" className="rounded-lg border border-slate-200 px-3 py-2 text-[11px]" />
                </div>
              ))}
            </div>
          </div> */}

          <div>
            <div className="text-[12px] font-semibold tracking-wide text-[#111111]">
              Background image
            </div>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />

            <div
              className="group mt-2 flex cursor-pointer flex-col text-[11px] items-center gap-2 rounded-xl border bg-[#F9FAFB] border-dashed border-slate-300 px-4 py-6 text-center transition-all duration-200 hover:border-[#c8102e] hover:bg-[#FEF2F2]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-5 w-5 text-slate-400 transition-all duration-200 group-hover:scale-110 group-hover:text-[#c8102e]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v1.5A2.25 2.25 0 0 0 5.25 20h13.5A2.25 2.25 0 0 0 21 18v-1.5M7.5 9 12 4.5m0 0L16.5 9M12 4.5V15"
                />
              </svg>

              <div className="text-[12px] text-[#1111111] font-bold">
                Drop or{" "}
                <span
                  className="font-bold text-[#E0475C] transition-colors duration-150 hover:underline hover:text-[#c8102e]"
                >
                  browse
                </span>
              </div>

              <div className="text-[12px] text-[#4B5563]">
                Recommended: 1920x1080px, JPEG/WebP
              </div>
              <div className="mt-2 text-[12px] text-xs font-medium text-emerald-600">
                Current: {section.content.backgroundImage ?? "hero-banner.jpg"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}