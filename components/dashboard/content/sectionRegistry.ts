import type { ComponentType } from "react";
import type { Section, SectionType } from "@/types/content";
import { AboutSectionForm } from "./sections//AboutSectionForm";
import { CtaSectionForm } from "./sections/CtaSectionForm";
import { FaqSectionForm } from "./sections/FaqSectionForm";
// import { FooterSectionForm } from "./sections/FooterSectionForm";
import { HeroSectionForm } from "./sections/HeroSectionForm";
import { HowItWorksSectionForm } from "./sections/HowItWorksSectionForm";
import { BlogsListTable } from "./sections/RecentBlogsSectionForm";
import { ServicesSectionForm } from "./sections/ServicesSectionForm";
import { TestimonialsSectionForm } from "./sections/TestimonialsSectionForm";

export interface SectionFormProps {
  section: Section;
  onChange: (updatedSection: Section) => void;
  onSave?: (updatedSection: Section) => Promise<void> | void;
  onDelete?: (updatedSection: Section) => Promise<void> | void;
  saving?: boolean;
}

export const sectionFormRegistry: Record<SectionType, ComponentType<SectionFormProps>> = {
  Hero: HeroSectionForm,
  Services: ServicesSectionForm,
  About: AboutSectionForm,
  Video: HowItWorksSectionForm,
  FAQ: FaqSectionForm,
  Reviews: TestimonialsSectionForm,
  Blog: BlogsListTable,
  CTA: CtaSectionForm,
  // Footer: FooterSectionForm,
};
