import { useEffect, useRef, useState } from "react";
import { useSectionApi } from "@/lib/useSectionApi";
import type { SectionFormProps } from "@/components/dashboard/content/sectionRegistry";
import {
  Plus,
  Pencil,
  Trash,
  ChevronDown,
  Lock,
  ShieldCheck,
  Users,
  Zap,
  FileCheck,
  Star,
  Award,
  Clock,
  Heart,
  ThumbsUp,
} from "lucide-react";

interface StepItem {
  icon?: string;
  title?: string;
  description?: string;
}

const ICONS: Record<string, typeof Lock> = {
  lock: Lock,
  shield: ShieldCheck,
  users: Users,
  zap: Zap,
  fileCheck: FileCheck,
  star: Star,
  award: Award,
  clock: Clock,
  heart: Heart,
  thumbsUp: ThumbsUp,
};

function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const CurrentIcon = ICONS[value] ?? Lock;

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={rootRef} className="relative mt-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex flex-row gap-2 items-start rounded-lg border bg-[#f9fafb] border-slate-200  px-8 py-3 transition-all duration-150 hover:border-[#c8102e]/40 hover:shadow-sm"
      >
        <CurrentIcon className="h-4 w-4 text-[#c8102e] transition-transform duration-150" />
        <span className="text-[11px] font-semibold transition-colors duration-150 ">
          Change
        </span>
      </button>

      {open && (
        <div className="absolute z-10 mt-1 grid w-48 grid-cols-4 gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
          {Object.entries(ICONS).map(([key, Icon]) => {
            const isSelected = key === value;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onChange(key);
                  setOpen(false);
                }}
                className={`flex items-center justify-center rounded-lg p-2 transition-colors duration-150 ${
                  isSelected
                    ? "bg-[#c8102e] text-white"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AboutSectionForm({ section, onChange }: SectionFormProps) {
  useSectionApi(section, onChange);

  const steps: StepItem[] = Array.isArray(section.content.steps) ? section.content.steps : [];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const update = (key: string, value: unknown) => {
    onChange({ ...section, content: { ...section.content, [key]: value } });
  };

  const updateStep = (index: number, field: keyof StepItem, value: string) => {
    const next = [...steps];
    next[index] = { ...next[index], [field]: value };
    update("steps", next);
  };

  const removeStep = (index: number) => {
    const next = steps.filter((_, i) => i !== index);
    update("steps", next);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const addStep = () => {
    const next = [...steps, { icon: "lock", title: "", description: "" }];
    update("steps", next);
    setExpandedIndex(next.length - 1);
  };

  return (
    <div className="space-y-6">
      {/* Section Header Copy */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow duration-200 hover:shadow-md">
        <h3 className="text-[12px] font-bold text-[#111827]">Section Header Copy</h3>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-[12px] font-semibold text-[#111111]">Subtitle / Tagline</label>
            <input
              value={section.content.subtitle ?? ""}
              onChange={(e) => update("subtitle", e.target.value)}
              placeholder="Why FilerNow"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-[#111111]">Section Title</label>
            <input
              value={section.content.title ?? ""}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Built on trust and results"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-[#111111]">Section Description</label>
            <textarea
              value={section.content.description ?? ""}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Everything we do is designed to make compliance effortless while keeping your business protected."
              className="mt-1 min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
            />
          </div>
        </div>
      </div>

      {/* Process Steps */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow duration-200 hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[12px] font-bold text-[#111827]">Process Steps</h3>
            <p className="mt-1 text-[11px] text-slate-500">
              Configure the trust benefits displayed in the grid. Maximum 6 steps recommended.
            </p>
          </div>

          <button
            type="button"
            onClick={addStep}
            className="flex shrink-0 items-center gap-1 rounded-lg border border-[#c8102e] px-3 py-1.5 text-[12px] font-bold text-[#c8102e] transition-all duration-150 hover:bg-[#c8102e] hover:text-white hover:shadow-sm active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            Add New Step
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {steps.map((step, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-slate-200 transition-all duration-200 hover:border-slate-300"
              >
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="flex cursor-pointer items-center gap-3 px-4 py-3"
                >
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isExpanded ? "rotate-180 text-[#c8102e]" : ""
                    }`}
                  />
                  <span className="shrink-0 rounded-md bg-[#FEF2F2] px-2 py-1 text-[11px] font-bold tracking-wide text-[#c8102e]">
                    STEP {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 truncate text-[12px] font-medium text-[#111827]">
                    {step.title || "Untitled step"}
                  </span>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex shrink-0 items-center gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-all duration-150 hover:border-slate-300 hover:bg-slate-50"
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-[11px] font-semibold text-[#c8102e] transition-all duration-150 hover:border-red-300 hover:bg-red-50 active:scale-95"
                    >
                      <Trash className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-200 px-4 py-4">
                    <div className="grid gap-4 md:grid-cols-[auto_1fr]">
                      <div>
                        <label className="text-[12px] font-semibold text-[#111111]">Icon Glyph</label>
                        <IconPicker
                          value={step.icon ?? "lock"}
                          onChange={(value) => updateStep(index, "icon", value)}
                        />
                      </div>
                      <div>
                        <label className="text-[12px] font-semibold text-[#111111]">Step Title</label>
                        <input
                          value={step.title ?? ""}
                          onChange={(e) => updateStep(index, "title", e.target.value)}
                          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
                        />
                        <div className="mt-4">
                          <label className="text-[12px] font-semibold text-[#111111]">Description</label>
                          <textarea
                            value={step.description ?? ""}
                            onChange={(e) => updateStep(index, "description", e.target.value)}
                            className="mt-1 min-h-20 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}