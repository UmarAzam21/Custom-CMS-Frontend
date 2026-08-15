import { useRef, useState } from "react";
import { useSectionApi } from "@/lib/useSectionApi";
import type { SectionFormProps } from "@/components/dashboard/content/sectionRegistry";
import { Plus, Pencil, Trash, Star, X, Camera, ChevronLeft, ChevronRight } from "lucide-react";

interface TestimonialItem {
  name?: string;
  designation?: string;
  verified?: boolean;
  date?: string;
  reviewText?: string;
  rating?: number;
  showOnHomepage?: boolean;
  avatar?: string;
}

const PAGE_SIZE = 4;

export function TestimonialsSectionForm({ section, onChange, onSave }: SectionFormProps) {
  useSectionApi(section, onChange);

  const testimonials: TestimonialItem[] = Array.isArray(section.content.testimonials)
    ? section.content.testimonials
    : [];

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<TestimonialItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const update = (key: string, value: unknown) => {
    onChange({ ...section, content: { ...section.content, [key]: value } });
  };

  const totalPages = Math.max(1, Math.ceil(testimonials.length / PAGE_SIZE));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageItems = testimonials.slice(pageStart, pageStart + PAGE_SIZE);

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setDraft({ ...testimonials[index] });
  };

  const closeEditor = () => {
    setEditingIndex(null);
    setDraft(null);
  };

  const saveDraft = () => {
    if (editingIndex === null || !draft) return;
    const next = [...testimonials];
    next[editingIndex] = draft;
    const updatedSection = { ...section, content: { ...section.content, testimonials: next } };
    onChange(updatedSection);
    onSave?.(updatedSection);
    closeEditor();
  };

  const addTestimonial = () => {
    const item: TestimonialItem = {
      name: "",
      designation: "Verified Client",
      verified: true,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      reviewText: "",
      rating: 5,
      showOnHomepage: true,
      avatar: "",
    };
    const next = [...testimonials, item];
    update("testimonials", next);
    setCurrentPage(Math.ceil(next.length / PAGE_SIZE));
    setEditingIndex(next.length - 1);
    setDraft(item);
  };

  const removeTestimonial = (index: number) => {
    const next = testimonials.filter((_, i) => i !== index);
    update("testimonials", next);
    if (editingIndex === index) closeEditor();
  };

  const updateDraft = (field: keyof TestimonialItem, value: unknown) => {
    setDraft((d) => (d ? { ...d, [field]: value } : d));
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) updateDraft("avatar", URL.createObjectURL(file));
  };

  return (
    <div className="space-y-6">
      {/* Section Header Editor */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow duration-200 hover:shadow-md">
        <h3 className="text-[12px] font-bold text-[#111827]">Section Header Editor</h3>
        <p className="mt-1 text-[12px] text-slate-500">Configure the primary title and context description.</p>

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

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6 min-w-0">
          {/* Manage Testimonials */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow duration-200 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[12px] font-bold text-[#111827]">Manage Testimonials</h3>
                <p className="mt-1 text-[12px] text-slate-500">Add, edit or remove client reviews</p>
              </div>
              <button
                type="button"
                onClick={addTestimonial}
                className="flex shrink-0 items-center gap-1 rounded-lg bg-[#c8102e] px-3 py-2 text-[12px] font-bold text-white transition-all duration-150 hover:bg-[#a80d26] hover:shadow-md active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {pageItems.map((t, i) => {
                const index = pageStart + i;
                const isSelected = editingIndex === index;
                return (
                  <div
                    key={index}
                    onClick={() => startEditing(index)}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all duration-150 ${
                      isSelected
                        ? "border-[#c8102e] ring-1 ring-[#c8102e]/20"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    {t.avatar ? (
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[12px] font-semibold text-slate-500">
                        {(t.name || "?").charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[12px] font-semibold text-[#111827]">
                          {t.name || "Unnamed reviewer"}
                        </span>
                        {t.verified && (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                            Verified Client
                          </span>
                        )}
                        {t.date && <span className="text-[10px] text-slate-400">• {t.date}</span>}
                      </div>
                      <p className="mt-0.5 truncate text-[12px] text-slate-500">{t.reviewText}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`h-3.5 w-3.5 ${
                            n <= (t.rating ?? 0) ? "fill-[#c8102e] text-[#c8102e]" : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>

                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex shrink-0 items-center gap-2"
                    >
                      <button
                        type="button"
                        onClick={() => startEditing(index)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 active:scale-95"
                        aria-label="Edit review"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeTestimonial(index)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 transition-all duration-150 hover:border-red-200 hover:bg-red-100 active:scale-95"
                        aria-label="Delete review"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {pageItems.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-[12px] text-slate-400">
                  No reviews yet — click Add to create one.
                </div>
              )}
            </div>

            {testimonials.length > 0 && (
              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                <span className="text-[12px] text-slate-500">
                  Showing {pageStart + 1}-{Math.min(pageStart + PAGE_SIZE, testimonials.length)} of{" "}
                  {testimonials.length} reviews
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-[12px] font-semibold transition-all duration-150 ${
                        page === currentPage
                          ? "bg-[#c8102e] text-white"
                          : "border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column — Edit Review panel */}
        <div className="min-w-0">
          {draft ? (
            <div className="sticky top-4 rounded-xl border border-slate-200 bg-white p-5 transition-shadow duration-200 hover:shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-[12px] font-bold text-[#111827]">Edit Review</h3>
                <button
                  type="button"
                  onClick={closeEditor}
                  className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 transition-all duration-150 hover:bg-slate-100 hover:text-slate-600 active:scale-95"
                  aria-label="Close editor"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="my-4 border-t border-slate-200" />

              <div className="flex flex-col items-center gap-2">
                <div className="group relative h-16 w-16">
                  {draft.avatar ? (
                    <img
                      src={draft.avatar}
                      alt={draft.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-[16px] font-semibold text-slate-500">
                      {(draft.name || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#c8102e] text-white shadow-sm transition-transform duration-150 hover:scale-110 active:scale-95"
                    aria-label="Change photo"
                  >
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="text-[12px] font-semibold text-[#c8102e] transition-colors duration-150 hover:underline"
                >
                  Change Photo
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-[12px] font-semibold text-[#111111]">Client Name</label>
                  <input
                    value={draft.name ?? ""}
                    onChange={(e) => updateDraft("name", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
                  />
                </div>

                <div>
                  <label className="text-[12px] font-semibold text-[#111111]">Designation / Title</label>
                  <input
                    value={draft.designation ?? ""}
                    onChange={(e) => updateDraft("designation", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
                  />
                </div>

                <div>
                  <label className="text-[12px] font-semibold text-[#111111]">Review Text</label>
                  <textarea
                    value={draft.reviewText ?? ""}
                    onChange={(e) => updateDraft("reviewText", e.target.value)}
                    className="mt-1 min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
                  />
                </div>

                <div>
                  <label className="text-[12px] font-semibold text-[#111111]">Rating (Click to select)</label>
                  <div className="mt-1 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => updateDraft("rating", n)}
                        className="transition-transform duration-150 hover:scale-125 active:scale-95"
                        aria-label={`Set rating to ${n}`}
                      >
                        <Star
                          className={`h-5 w-5 ${
                            n <= (draft.rating ?? 0) ? "fill-[#c8102e] text-[#c8102e]" : "text-slate-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-semibold text-[#111111]">Show on Homepage</label>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={draft.showOnHomepage ?? true}
                      onChange={(e) => updateDraft("showOnHomepage", e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="h-5 w-9 rounded-full bg-slate-200 transition-colors duration-200 peer-checked:bg-emerald-500" />
                    <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-4" />
                  </label>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeEditor}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-[12px] font-semibold text-slate-600 transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveDraft}
                  className="flex-1 rounded-lg bg-[#c8102e] px-3 py-2 text-[12px] font-bold text-white transition-all duration-150 hover:bg-[#a80d26] hover:shadow-md active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="sticky top-4 rounded-xl border border-dashed border-slate-200 bg-white p-5 text-center text-[12px] text-slate-400">
              Select a review to edit, or click Add to create a new one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}