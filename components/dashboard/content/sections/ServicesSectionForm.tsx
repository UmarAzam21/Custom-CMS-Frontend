// components/dashboard/content/sections/ServicesSectionForm.tsx
import { useEffect, useRef, useState } from "react";
import { useSectionApi } from "@/lib/useSectionApi";
import type { SectionFormProps } from "@/components/dashboard/content/sectionRegistry";
import {Plus, Trash, ChevronDown} from "lucide-react"

interface ServiceItem {
  icon?: string;
  title?: string;
  description?: string;
  visible?: boolean;
}

interface DropdownOption {
  value: string;
  label: string;
}

function Dropdown({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

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
    <div ref={rootRef} className="relative mt-1 w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none hover:border-slate-300 ${
          open ? "border-[#c8102e] ring-2 ring-[#c8102e]/20" : ""
        }`}
      >
        <span>{selected?.label}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180 text-[#c8102e]" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-[12px] shadow-lg animate-in fade-in zoom-in-95 duration-150">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left transition-colors duration-150 ${
                  isSelected
                    ? "bg-[#c8102e] text-white"
                    : "text-[#111827] hover:bg-slate-50"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ServicesSectionForm({ section, onChange }: SectionFormProps) {
  useSectionApi(section, onChange);

  const services: ServiceItem[] = Array.isArray(section.content.services)
    ? section.content.services
    : [];

  const updateContent = (field: string, value: string) => {
    onChange({ ...section, content: { ...section.content, [field]: value } });
  };

  const updateService = (index: number, field: keyof ServiceItem, value: string | boolean) => {
    const next = [...services];
    next[index] = { ...next[index], [field]: value };
    onChange({ ...section, content: { ...section.content, services: next } });
  };

  const removeService = (index: number) => {
    const next = services.filter((_, i) => i !== index);
    onChange({ ...section, content: { ...section.content, services: next } });
  };

  const addService = () => {
    onChange({
      ...section,
      content: {
        ...section.content,
        services: [...services, { icon: "✨", title: "", description: "", visible: true }],
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Content */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow duration-200 hover:shadow-md">
        <h3 className="text-[12px] font-bold text-[#111827]">Section Content</h3>

        <div className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-[12px] font-semibold ">Subtitle</label>
            <input
              value={section.content.subtitle ?? ""}
              onChange={(e) => updateContent("subtitle", e.target.value)}
              placeholder="Our Services"
              className="mt-1 h-[36px]  w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold">Heading</label>
            <input
              value={section.content.heading ?? ""}
              onChange={(e) => updateContent("heading", e.target.value)}
              placeholder="Everything you need, in one place"
              className="mt-1 h-[36px] w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
            />
          </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold">Description</label>
            <textarea
              value={section.content.description ?? ""}
              onChange={(e) => updateContent("description", e.target.value)}
              placeholder="From tax filing to company setup and brand protection..."
              className="mt-1 min-h-20 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
            />
          </div>
        </div>
      </div>

      {/* Service Items */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow duration-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-[12px] font-semibold">Service Items</h3>
          <button
            type="button"
            onClick={addService}
            className="group text-[12px] font-semibold border border-primary py-1 px-3 flex flex-row items-center gap-1 rounded-md font-bold text-primary transition-all duration-150 "
          >
            <Plus className="h-4 w-4 text-primary transition-colors duration-150 " />
            Add Service
          </button>
        </div>

        <div className="mt-4 border rounded-xl border-slate-200 ">
          {services.map((service, index) => (
            <div
              key={`${service.title ?? "service"}-${index}`}
              className="flex items-center gap-3  p-2 border-b border-slate-200 last:border-b-0 transition-colors duration-150 hover:bg-slate-50"
            >
              <span className="text-[12px] bg-[#FEF2F2] p-2 rounded-lg transition-transform duration-150 hover:scale-110">{service.icon || "✨"}</span>

              <input
                value={service.title ?? ""}
                onChange={(e) => updateService(index, "title", e.target.value)}
                placeholder="Service title"
                className="flex-1 text-[12px] focus:outline-none transition-colors duration-150 rounded px-1 -mx-1"
              />

              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={service.visible ?? true}
                  onChange={(e) => updateService(index, "visible", e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-5 w-9 rounded-full bg-slate-200 peer-checked:bg-[#c8102e] transition-colors duration-200" />
                <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-200 peer-checked:translate-x-4 shadow-sm" />
              </label>

              <button
                type="button"
                onClick={() => removeService(index)}
                className="text-slate-400 transition-all duration-150 "
                aria-label="Remove service"
              >
                <Trash className="h-4 w-4 font-bold" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow duration-200 hover:shadow-md">
        <h3 className="text-[12px] font-semibold">Settings</h3>

        <div className="mt-4 space-y-4">
          <div>
            <label className="text-[12px] font-semibold">Grid Columns</label>
            <Dropdown
              value={section.content.gridColumns ?? "4"}
              onChange={(value) => updateContent("gridColumns", value)}
              options={[
                { value: "2", label: "2 columns" },
                { value: "3", label: "3 columns" },
                { value: "4", label: "4 columns" },
              ]}
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold">Background Color</label>
            <div className="mt-1 flex items-center gap-2 mt-1 w-full rounded-lg border border-slate-200 px-3 py-1 text-[12px] transition-all duration-150 focus-within:border-[#c8102e] focus-within:ring-2 focus-within:ring-[#c8102e]/20 hover:border-slate-300">
              <input
                type="color"
                value={section.content.backgroundColor ?? "#FFFFFF"}
                onChange={(e) => updateContent("backgroundColor", e.target.value)}
                className="h-6 w-5 rounded-full text-[12px] focus:outline-none transition-transform duration-150 hover:scale-110"
              />
              <input
                value={section.content.backgroundColor ?? "#FFFFFF"}
                onChange={(e) => updateContent("backgroundColor", e.target.value)}
                className="flex-1 rounded-lg  text-[12px] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold">Card Style</label>
            <Dropdown
              value={section.content.cardStyle ?? "icon-label-outlined"}
              onChange={(value) => updateContent("cardStyle", value)}
              options={[
                { value: "icon-label-outlined", label: "Icon + Label (Outlined)" },
                { value: "icon-label-filled", label: "Icon + Label (Filled)" },
                { value: "minimal", label: "Minimal (Label only)" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}