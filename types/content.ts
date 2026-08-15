export type SectionType =
  | "Hero"
  | "Services"
  | "About"
  | "Video"
  | "FAQ"
  | "Reviews"
  | "Blog"
  | "CTA"
  // | "Footer";

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  order: number;
  content: Record<string, any>;
  // Backend metadata for updates/deletes
  _blockId?: number;
  _blockKey?: string;
  _blockType?: string;
  _pageId?: number;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  status: "Published" | "Draft";
  sectionsCount: number;
  lastEdited: string;
}
