import { useRef } from "react";
import { useSectionApi } from "@/lib/useSectionApi";
import type { SectionFormProps } from "@/components/dashboard/content/sectionRegistry";
import { Upload } from "lucide-react";

export function CtaSectionForm({ section, onChange, onSave, saving }: SectionFormProps) {
  useSectionApi(section, onChange);
  const iconInputRef = useRef<HTMLInputElement>(null);

  const update = (key: string, value: unknown) => {
    onChange({ ...section, content: { ...section.content, [key]: value } });
  };

  const handleIconSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      update("iconUrl", URL.createObjectURL(file));
      update("iconFileName", file.name);
    }
  };

  const handleColorSwatchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    update("backgroundColor", `${e.target.value.toUpperCase()} (Opacity 10%)`);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 transition-shadow duration-200 hover:shadow-md">
      <h3 className="text-[13px] font-bold text-[#111827]">CTA Section</h3>
      <p className="mt-1 text-[12px] text-slate-500">
        Update the content and branding settings for the primary home conversion banner.
      </p>

      <div className="my-4 border-t border-slate-200" />

      <div className="space-y-4">
        {/* Icon upload */}
        <input
          ref={iconInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml"
          onChange={handleIconSelect}
          className="hidden"
        />
        <div
          onClick={() => iconInputRef.current?.click()}
          className="group flex cursor-pointer flex-col items-center gap-1 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition-all duration-200 hover:border-[#c8102e] hover:bg-[#FEF2F2]"
        >
          <Upload className="h-5 w-5 text-[#c8102e] transition-transform duration-200 group-hover:-translate-y-0.5" />
          <span className="text-[12px] font-bold text-[#111827]">
            {section.content.iconFileName ?? "filer-now-icon-red.png"}
          </span>
          <span className="text-[11px] text-slate-500">
            PNG, JPG or SVG up to 2MB (Recommended square aspect ratio)
          </span>
        </div>

        <div>
          <label className="text-[12px] font-semibold text-[#111111]">Heading</label>
          <input
            value={section.content.heading ?? ""}
            onChange={(e) => update("heading", e.target.value)}
            placeholder="Ready to file your taxes the smart way?"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
          />
        </div>

        <div>
          <label className="text-[12px] font-semibold text-[#111111]">Description</label>
          <textarea
            value={section.content.description ?? ""}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Get expert help with tax filing, registration and compliance. Fast, secure and reliable become a filer today."
            className="mt-1 min-h-20 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-[12px] font-semibold text-[#111111]">Button Text</label>
            <input
              value={section.content.buttonText ?? ""}
              onChange={(e) => update("buttonText", e.target.value)}
              placeholder="Become A Filer"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
            />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#111111]">Button Link</label>
            <input
              value={section.content.buttonLink ?? ""}
              onChange={(e) => update("buttonLink", e.target.value)}
              placeholder="/register"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
            />
          </div>
        </div>

        <div>
          <label className="text-[12px] font-semibold text-[#111111]">Section Icon</label>
        </div>

        <div>
          <label className="text-[12px] font-semibold text-[#111111]">Background Color</label>
          <div className="mt-1 flex items-center gap-3">
            <label className="relative h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-full border-2 border-[#c8102e] bg-[#FEF2F2] transition-transform duration-150 hover:scale-105">
              <input
                type="color"
                value="#C8102E"
                onChange={handleColorSwatchChange}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </label>
            <input
              value={section.content.backgroundColor ?? "#C8102E (Opacity 10%)"}
              onChange={(e) => update("backgroundColor", e.target.value)}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
            />
          </div>
        </div>
      </div>

      <div className="my-5 border-t border-slate-200" />

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          className="rounded-lg border border-slate-200 px-4 py-2 text-[12px] font-semibold text-slate-600 transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 active:scale-95"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSave?.(section)}
          disabled={saving}
          className={`rounded-lg px-4 py-2 text-[12px] font-bold text-white transition-all duration-150 ${
            saving ? "bg-slate-400 cursor-not-allowed" : "bg-[#c8102e] hover:bg-[#a80d26] hover:shadow-md"
          }`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}