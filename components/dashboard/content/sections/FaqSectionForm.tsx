import { useState } from "react";
import { useSectionApi } from "@/lib/useSectionApi";
import type { SectionFormProps } from "@/components/dashboard/content/sectionRegistry";
import { Plus, Pencil, Trash, GripVertical } from "lucide-react";

interface FaqItem {
  question?: string;
  answer?: string;
}

export function FaqSectionForm({ section, onChange }: SectionFormProps) {
  useSectionApi(section, onChange);
  const faqs: FaqItem[] = Array.isArray(section.content.faqs) ? section.content.faqs : [];
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const update = (key: string, value: unknown) => {
    onChange({ ...section, content: { ...section.content, [key]: value } });
  };

  const updateFaq = (index: number, field: keyof FaqItem, value: string) => {
    const next = [...faqs];
    next[index] = { ...next[index], [field]: value };
    update("faqs", next);
  };

  const removeFaq = (index: number) => {
    const next = faqs.filter((_, i) => i !== index);
    update("faqs", next);
    if (editingIndex === index) setEditingIndex(null);
  };

  const addFaq = () => {
    const next = [...faqs, { question: "", answer: "" }];
    update("faqs", next);
    setEditingIndex(next.length - 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[12px] font-bold text-[#111827]">Manage FAQ</h2>
          <p className="mt-1 text-[12px] text-slate-500">
            Create, edit, or prioritize frequently asked questions on the FilerNow portal.
          </p>
        </div>

        <button
          type="button"
          onClick={addFaq}
          className="flex shrink-0 items-center gap-1 rounded-lg bg-[#c8102e] px-3 py-2 text-[12px] font-bold text-white transition-all duration-150 hover:bg-[#a80d26] hover:shadow-md active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isEditing = editingIndex === index;
          return (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-shadow duration-200 hover:shadow-md"
            >
              <GripVertical className="mt-1 h-4 w-4 shrink-0 cursor-grab text-slate-300 transition-colors duration-150 hover:text-slate-400" />

              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[12px] font-semibold text-slate-500">
                {index + 1}
              </span>

              <div className="min-w-0 flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      value={faq.question ?? ""}
                      onChange={(e) => updateFaq(index, "question", e.target.value)}
                      placeholder="Question"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] font-semibold transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
                    />
                    <textarea
                      value={faq.answer ?? ""}
                      onChange={(e) => updateFaq(index, "answer", e.target.value)}
                      placeholder="Answer"
                      className="min-h-16 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
                    />
                  </div>
                ) : (
                  <>
                    <p className="text-[12px] font-semibold text-[#111827]">
                      {faq.question || "Untitled question"}
                    </p>
                    <p className="mt-1 text-[12px] leading-relaxed text-slate-500">{faq.answer}</p>
                  </>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingIndex(isEditing ? null : index)}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-semibold text-slate-600 transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 active:scale-95"
                >
                  <Pencil className="h-3 w-3" />
                  {isEditing ? "Done" : "Edit"}
                </button>
                <button
                  type="button"
                  onClick={() => removeFaq(index)}
                  className="flex items-center gap-1 rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-[12px] font-semibold text-red-600 transition-all duration-150 hover:border-red-200 hover:bg-red-100 active:scale-95"
                >
                  <Trash className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}