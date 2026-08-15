"use client";

import { useEffect, useState } from "react";
import { GripVertical, Plus } from "lucide-react";

export interface PageSection {
  id: string | number;
  title: string;
  type: string;
  href?: string;
}

export interface PageSectionsProps {
  sections?: PageSection[];
  selectedId?: string | number;
  onSelect?: (section: PageSection) => void;
  onAddSection?: () => void;
  onReorder?: (sections: PageSection[]) => void;
  addLabel?: string;
}

export default function PageSections({
  sections: sectionsProp,
  selectedId: selectedIdProp,
  onSelect,
  onAddSection,
  onReorder,
}: PageSectionsProps) {
  const [sections, setSections] = useState<PageSection[]>(sectionsProp ?? defaultSections);
  const [selectedId, setSelectedId] = useState<string | number | undefined>(selectedIdProp ?? sectionsProp?.[0]?.id ?? defaultSections[0].id);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (sectionsProp) {
      setSections(sectionsProp);
    }
  }, [sectionsProp]);

  useEffect(() => {
    if (selectedIdProp !== undefined) {
      setSelectedId(selectedIdProp);
    }
  }, [selectedIdProp]);

  const handleSelect = (section: PageSection) => {
    setSelectedId(section.id);
    onSelect?.(section);
  };

  const handleDragStart = (index: number) => (event: React.DragEvent) => {
    setDragIndex(index);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (index: number) => (event: React.DragEvent) => {
    event.preventDefault();
    if (index !== overIndex) {
      setOverIndex(index);
    }
  };

  const handleDrop = (index: number) => (event: React.DragEvent) => {
    event.preventDefault();
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }

    const next = [...sections];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);

    setSections(next);
    onReorder?.(next);
    setDragIndex(null);
    setOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <div className="w-[180px] rounded-2xl">
      <div className="mb-3 pl-1 text-[11px] font-bold uppercase tracking-[0.6px] text-[#4B5563]">Page sections</div>

      <div className="flex flex-col gap-2">
        {sections.map((section, index) => {
          const isSelected = section.id === selectedId;
          const isDragOver = overIndex === index && dragIndex !== index;

          return (
            <div
              key={section.id}
              draggable
              onDragStart={handleDragStart(index)}
              onDragOver={handleDragOver(index)}
              onDrop={handleDrop(index)}
              onDragEnd={handleDragEnd}
              onClick={() => handleSelect(section)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-3 transition ${isSelected ? "border-[#F6D4D9] bg-[#FDEEF0]" : "border-[#ECECEF] bg-white"} ${isDragOver ? "border-dashed border-[#E0475C]" : ""}`}
            >
              <GripVertical size={16} className="flex-shrink-0 cursor-grab text-[#C9C9CE]" />
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-semibold text-primary">{section.title}</span>
                <span className="text-[10px] text-[#C8102E]">{section.type}</span>
              </div>
            </div>
          );
        })}

     
      </div>
    </div>
  );
}

const defaultSections: PageSection[] = [
  { id: 1, title: "Hero Banner", type: "Hero" },
  { id: 2, title: "Our Services", type: "Services" },
  { id: 3, title: "Why FilerNow", type: "About" },
  { id: 4, title: "Who We Are", type: "About" },
  { id: 5, title: "How It Works", type: "Video" },
  { id: 6, title: "FAQ", type: "FAQ" },
  { id: 7, title: "Testimonials", type: "Reviews" },
  { id: 8, title: "Recent Blogs", type: "Blog" },
  { id: 9, title: "Call to Action", type: "CTA" },
  // { id: 10, title: "Footer", type: "Footer" },
];