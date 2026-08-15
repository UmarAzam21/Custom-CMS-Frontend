import { useRef } from "react";
import { useSectionApi } from "@/lib/useSectionApi";
import type { SectionFormProps } from "@/components/dashboard/content/sectionRegistry";
import { Play, Image as ImageIcon } from "lucide-react";

export function HowItWorksSectionForm({ section, onChange }: SectionFormProps) {
  useSectionApi(section, onChange);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const update = (key: string, value: unknown) => {
    onChange({ ...section, content: { ...section.content, [key]: value } });
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      update("videoThumbnail", URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header Editor */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow duration-200 hover:shadow-md">
        <h3 className="text-[12px] font-bold text-[#111827]">Section Header Editor</h3>
        <p className="mt-1 text-[11px] text-slate-500">Configure the primary title and context description.</p>

        <div className="my-4 border-t border-slate-200" />

        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-semibold text-[#111111]">Section Subtitle</label>
            <input
              value={section.content.subtitle ?? ""}
              onChange={(e) => update("subtitle", e.target.value)}
              placeholder="See How It Works"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-[#111111]">Section Title</label>
            <input
              value={section.content.title ?? ""}
              onChange={(e) => update("title", e.target.value)}
              placeholder="File taxes & register your business the smart way"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-[#111111]">Section Description</label>
            <textarea
              value={section.content.description ?? ""}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Watch how FileNow makes tax filing and business compliance fast, easy and reliable."
              className="mt-1 min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
            />
          </div>
        </div>
      </div>

      {/* CTA Button Editor */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow duration-200 hover:shadow-md">
        <h3 className="text-[12px] font-bold text-[#111827]">CTA Button Editor</h3>
        <p className="mt-1 text-[11px] text-slate-500">Customize the action button properties.</p>

        <div className="my-4 border-t border-slate-200" />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-[12px] font-semibold text-[#111111]">Button Text</label>
            <input
              value={section.content.ctaText ?? ""}
              onChange={(e) => update("ctaText", e.target.value)}
              placeholder="Start Your Filing"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-[#111111]">Button URL</label>
            <input
              value={section.content.ctaUrl ?? ""}
              onChange={(e) => update("ctaUrl", e.target.value)}
              placeholder="/become-a-filer"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
            />
          </div>
        </div>
      </div>

      {/* Video Section Editor */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow duration-200 hover:shadow-md">
        <h3 className="text-[12px] font-bold text-[#111827]">Video Section Editor</h3>
        <p className="mt-1 text-[11px] text-slate-500">Manage the explainer video thumbnail and streaming source link.</p>

        <div className="my-4 border-t border-slate-200" />

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="group relative h-24 w-40 shrink-0 overflow-hidden rounded-xl bg-slate-100 transition-all duration-200">
            {section.content.videoThumbnail ? (
              <img
                src={section.content.videoThumbnail}
                alt="Video thumbnail"
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-200 text-[10px] text-slate-400">
                No thumbnail
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors duration-200 group-hover:bg-black/20">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c8102e] shadow-md transition-transform duration-200 group-hover:scale-110">
                <Play className="h-4 w-4 fill-white text-white" />
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <label className="text-[12px] font-semibold text-[#111111]">Video URL</label>
              <input
                value={section.content.videoUrl ?? ""}
                onChange={(e) => update("videoUrl", e.target.value)}
                placeholder="https://www.youtube.com/watch?v=example-filenow"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleThumbnailSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => thumbnailInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition-all duration-150 hover:border-[#c8102e] hover:text-[#c8102e] hover:shadow-sm active:scale-95"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Upload Video Thumbnail
              </button>
              <span className="text-[11px] text-slate-400">Aspect ratio 16:9 recommended. Max 2MB.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}