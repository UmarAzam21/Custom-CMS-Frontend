import type { SectionFormProps } from "@/components/dashboard/content/sectionRegistry";

export function FooterSectionForm({ section, onChange }: SectionFormProps) {
  const columns = Array.isArray(section.content.columns) ? section.content.columns : [];
  const socialLinks = Array.isArray(section.content.socialLinks) ? section.content.socialLinks : [];

  const updateColumn = (index: number, field: string, value: string) => {
    const next = [...columns];
    next[index] = { ...next[index], [field]: value };
    onChange({ ...section, content: { ...section.content, columns: next } });
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">Columns of links</h3>
          <button type="button" onClick={() => onChange({ ...section, content: { ...section.content, columns: [...columns, { heading: "", links: [] }] } })} className="text-sm font-semibold text-[#E0475C]">+ Add</button>
        </div>
        <div className="space-y-2">
          {columns.map((column: { heading?: string }, index: number) => (
            <input key={`${column.heading ?? "column"}-${index}`} value={column.heading ?? ""} onChange={(e) => updateColumn(index, "heading", e.target.value)} placeholder="Column heading" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">Social links</label>
        <textarea value={socialLinks.map((link: { label?: string; href?: string }) => `${link.label ?? ""} | ${link.href ?? ""}`).join("\n") ?? ""} onChange={(e) => {
          const lines = e.target.value.split("\n").filter(Boolean);
          const next = lines.map((line) => {
            const [label, href] = line.split("|");
            return { label: label?.trim() ?? "", href: href?.trim() ?? "" };
          });
          onChange({ ...section, content: { ...section.content, socialLinks: next } });
        }} className="min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">Copyright text</label>
        <input value={section.content.copyrightText ?? ""} onChange={(e) => onChange({ ...section, content: { ...section.content, copyrightText: e.target.value } })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
    </div>
  );
}
