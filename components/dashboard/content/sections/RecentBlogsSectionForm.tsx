import { useMemo, useRef, useState, useEffect } from "react";
import { Search, ChevronDown, Pencil, Trash, FileText, X, ImageIcon, Plus } from "lucide-react";
import { useSectionApi } from "@/lib/useSectionApi";
import { updateContentBlock } from "@/lib/sectionsApi";
import type { Section } from "@/types/content";

interface BlogItem {
  id: string;
  title: string;
  category: string;
  status: "published" | "draft";
  datePublished: string;
  description?: string;
  content?: string;
  image?: string;
}

const MOCK_BLOGS: BlogItem[] = [
  {
    id: "1",
    title: "Getting Started with Design Systems",
    category: "Tax Tips",
    status: "published",
    datePublished: "2 hours ago",
    description: "A practical introduction to building and maintaining a design system.",
    content: "Design systems bring consistency to product teams by unifying components, tokens, and patterns...",
    image: "",
  },
  {
    id: "2",
    title: "Top 10 UX Trends for 2026",
    category: "Guides",
    status: "published",
    datePublished: "Yesterday",
    description: "The interface patterns and interaction trends shaping products this year.",
    content: "From AI-assisted flows to bolder typography, here are the trends worth watching...",
    image: "",
  },
  {
    id: "3",
    title: "How to Build a Component Library",
    category: "Freelancing",
    status: "published",
    datePublished: "3 days ago",
    description: "Step-by-step notes on structuring a reusable component library.",
    content: "Start with tokens, then primitives, then composed components...",
    image: "",
  },
  {
    id: "4",
    title: "Accessibility Best Practices",
    category: "Tax Tips",
    status: "draft",
    datePublished: "1 week ago",
    description: "Foundational accessibility guidelines every team should follow.",
    content: "Color contrast, keyboard navigation, and semantic markup form the baseline...",
    image: "",
  },
  {
    id: "5",
    title: "Color Theory in Modern Web Design",
    category: "Tax Tips",
    status: "published",
    datePublished: "2 weeks ago",
    description: "How color choices influence usability and brand perception.",
    content: "Contrast and hierarchy guide the eye before a single word is read...",
    image: "",
  },
  {
    id: "6",
    title: "Responsive Typography Guide",
    category: "Guides",
    status: "draft",
    datePublished: "1 month ago",
    description: "Scaling type gracefully across breakpoints.",
    content: "Fluid type scales reduce the need for manual breakpoint overrides...",
    image: "",
  },
];

interface DropdownOption {
  value: string;
  label: string;
}

function normalizePostsToBlogs(posts: unknown): BlogItem[] {
  if (!Array.isArray(posts)) {
    return MOCK_BLOGS;
  }

  return posts.map((post: any, index: number) => ({
    id: post?.id ?? `${index + 1}`,
    title: post?.title ?? post?.heading ?? "Untitled blog",
    category: post?.category ?? post?.tag ?? "General",
    status: post?.status === "draft" ? "draft" : "published",
    datePublished: post?.datePublished ?? post?.published_at ?? post?.date ?? "Recently added",
    description: post?.description ?? post?.excerpt ?? "",
    content: post?.content ?? post?.body ?? "",
    image: post?.image ?? post?.thumbnail ?? "",
  }));
}

function serializeBlogsToPosts(blogs: BlogItem[]) {
  return blogs.map((blog) => ({
    id: blog.id,
    title: blog.title,
    category: blog.category,
    status: blog.status,
    datePublished: blog.datePublished,
    description: blog.description,
    content: blog.content,
    image: blog.image,
  }));
}

function FilterDropdown({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
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
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[12px] font-medium transition-all duration-150 outline-none ${
          open
            ? "border-[#c8102e] ring-2 ring-[#c8102e]/20"
            : "border-slate-200 text-slate-600 hover:border-slate-300"
        }`}
      >
        {selected?.value ? selected.label : label}
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180 text-[#c8102e]" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white text-[12px] shadow-lg">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value || "all"}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left transition-colors duration-150 ${
                  isSelected ? "bg-[#c8102e] text-white" : "text-[#111827] hover:bg-slate-50"
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

function StatusBadge({ status }: { status: "published" | "draft" }) {
  if (status === "published") {
    return (
      <span className="inline-flex rounded-md bg-emerald-50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-emerald-600">
        PUBLISHED
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-bold tracking-wide text-slate-500">
      DRAFT
    </span>
  );
}

function CategoryPicker({
  value,
  onChange,
  categories,
}: {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
}) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setAdding(false);
        setNewCategory("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const commitNewCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed) onChange(trimmed);
    setNewCategory("");
    setAdding(false);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative mt-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-[12px] transition-all duration-150 outline-none ${
          open ? "border-[#c8102e] ring-2 ring-[#c8102e]/20" : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <span className={value ? "text-[#111827]" : "text-slate-400"}>{value || "Select category"}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180 text-[#c8102e]" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-[12px] shadow-lg">
          <div className="max-h-40 overflow-y-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  onChange(cat);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left transition-colors duration-150 ${
                  cat === value ? "bg-[#c8102e] text-white" : "text-[#111827] hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="border-t border-slate-200 p-2">
            {adding ? (
              <div className="flex items-center gap-1.5">
                <input
                  autoFocus
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && commitNewCategory()}
                  placeholder="New category name"
                  className="flex-1 rounded-md border border-slate-200 px-2 py-1.5 text-[11px] outline-none transition-all duration-150 focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20"
                />
                <button
                  type="button"
                  onClick={commitNewCategory}
                  className="rounded-md bg-[#c8102e] px-2.5 py-1.5 text-[11px] font-semibold text-white transition-all duration-150 hover:bg-[#a80d26] active:scale-95"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-semibold text-[#c8102e] transition-colors duration-150 hover:bg-red-50"
              >
                <Plus className="h-3 w-3" />
                Add new category
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function EditBlogModal({
  blog,
  categories,
  onClose,
  onSave,
}: {
  blog: BlogItem;
  categories: string[];
  onClose: () => void;
  onSave: (blog: BlogItem) => void;
}) {
  const [draft, setDraft] = useState<BlogItem>(blog);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const updateDraft = (field: keyof BlogItem, value: string) => {
    setDraft((d) => ({ ...d, [field]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) updateDraft("image", URL.createObjectURL(file));
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 transition-opacity duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-5 shadow-xl transition-all duration-150"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-[#111827]">Edit Blog Post</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-all duration-150 hover:bg-slate-100 hover:text-slate-600 active:scale-95"
            aria-label="Close editor"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="my-4 border-t border-slate-200" />

        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-semibold text-[#111111]">Featured Image</label>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageSelect}
              className="hidden"
            />
            <div
              onClick={() => imageInputRef.current?.click()}
              className="group relative mt-1 flex h-32 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 transition-all duration-200 hover:border-[#c8102e] hover:bg-[#FEF2F2]"
            >
              {draft.image ? (
                <img
                  src={draft.image}
                  alt={draft.title}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-slate-400 transition-colors duration-200 group-hover:text-[#c8102e]">
                  <ImageIcon className="h-5 w-5" />
                  <span className="text-[11px] font-semibold">Click to upload image</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-[12px] font-semibold text-[#111111]">Title</label>
            <input
              value={draft.title ?? ""}
              onChange={(e) => updateDraft("title", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-[#111111]">Category</label>
            <CategoryPicker
              value={draft.category ?? ""}
              onChange={(value) => updateDraft("category", value)}
              categories={categories}
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-[#111111]">Description</label>
            <textarea
              value={draft.description ?? ""}
              onChange={(e) => updateDraft("description", e.target.value)}
              placeholder="A short summary shown in previews and search results."
              className="mt-1 min-h-16 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-[#111111]">Blog Content</label>
            <textarea
              value={draft.content ?? ""}
              onChange={(e) => updateDraft("content", e.target.value)}
              placeholder="Write the full blog post here..."
              className="mt-1 min-h-40 w-full rounded-lg border border-slate-200 px-3 py-2 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-[12px] font-semibold text-slate-600 transition-all duration-150 hover:border-slate-300 hover:bg-slate-50 active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(draft)}
            className="flex-1 rounded-lg bg-[#c8102e] px-3 py-2 text-[12px] font-bold text-white transition-all duration-150 hover:bg-[#a80d26] hover:shadow-md active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export function BlogsListTable({
  section,
  onChange,
}: {
  section: Section;
  onChange: (updatedSection: Section) => void;
}) {
  useSectionApi(section, onChange);

  const [blogs, setBlogs] = useState<BlogItem[]>(() => normalizePostsToBlogs(section.content.posts));
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setBlogs(normalizePostsToBlogs(section.content.posts));
  }, [section.content.posts]);


  const categoryOptions: DropdownOption[] = useMemo(() => {
    const unique = Array.from(new Set(blogs.map((p) => p.category)));
    return [{ value: "", label: "All Categories" }, ...unique.map((c) => ({ value: c, label: c }))];
  }, [blogs]);

  const statusOptions: DropdownOption[] = [
    { value: "", label: "All Statuses" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
  ];

  const filteredBlogs = blogs.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    const matchesStatus = !statusFilter || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const saveBlog = async (updated: BlogItem) => {
    setSaving(true);
    setError(null);
    
    try {
      const nextBlogs = blogs.map((b) => (b.id === updated.id ? updated : b));
      const updatedSection = {
        ...section,
        content: {
          ...section.content,
          posts: serializeBlogsToPosts(nextBlogs),
        },
      };
      
      // Call backend API to update the block
      if (section._blockId && section._pageId && section._blockKey && section._blockType) {
        await updateContentBlock(
          section._blockId,
          section._pageId,
          section._blockKey,
          section._blockType,
          updatedSection.content,
          section.order,
          section.visible
        );
      }
      
      // Update local state and section
      setBlogs(nextBlogs);
      onChange(updatedSection);
      setEditingBlog(null);
    } catch (err: any) {
      const msg = err?.message || "Failed to save blog";
      setError(msg);
      console.error("Save blog error:", msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow duration-200 hover:shadow-md">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-4">
        <div className="relative min-w-[200px] flex-1 max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blogs..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-[12px] transition-all duration-150 outline-none focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 focus:bg-white hover:border-slate-300"
          />
        </div>

        <FilterDropdown label="Category" value={categoryFilter} onChange={setCategoryFilter} options={categoryOptions} />
        <FilterDropdown label="Status" value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Date Published</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map((blog) => (
              <tr
                key={blog.id}
                className="border-t border-slate-100 transition-colors duration-150 hover:bg-slate-50"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="text-[12px] font-semibold text-[#111827]">{blog.title}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{blog.category}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={blog.status} />
                </td>
                <td className="px-5 py-3 text-[12px] text-slate-500">{blog.datePublished}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingBlog(blog)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-all duration-150 hover:bg-slate-200 active:scale-95"
                      aria-label="Edit blog"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const nextBlogs = blogs.filter((b) => b.id !== blog.id);
                        setBlogs(nextBlogs);
                        onChange({
                          ...section,
                          content: {
                            ...section.content,
                            posts: serializeBlogsToPosts(nextBlogs),
                          },
                        });
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-[#c8102e] transition-all duration-150 hover:bg-red-100 active:scale-95"
                      aria-label="Delete blog"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredBlogs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-[12px] text-slate-400">
                  No blogs match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingBlog && (
        <EditBlogModal
          blog={editingBlog}
          categories={categoryOptions.map((o) => o.value).filter(Boolean)}
          onClose={() => setEditingBlog(null)}
          onSave={saveBlog}
        />
      )}
    </div>
  );
}