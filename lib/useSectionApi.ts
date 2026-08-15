import { useEffect, useRef } from "react";
import { fetchSectionBySectionId } from "@/lib/sectionsApi";
import type { Section } from "@/types/content";

export function useSectionApi(section: Section, onChange: (section: Section) => void) {
  const fetchedSectionId = useRef<string | null>(null);

  useEffect(() => {
    if (!section?.id) return;
    if (fetchedSectionId.current === section.id) return;

    let active = true;

    async function loadSection() {
      try {
        const apiSection = await fetchSectionBySectionId(1, section.id);
        if (active && apiSection) {
          onChange(apiSection);
          fetchedSectionId.current = section.id;
        }
      } catch (error) {
        console.error("Failed to load section data:", section.id, error);
      }
    }

    loadSection();

    return () => {
      active = false;
    };
  }, [section.id, onChange]);
}
