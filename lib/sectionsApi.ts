import type { Section } from "@/types/content";
import { getAdminAuthHeaders } from "@/lib/auth";

export interface SectionApiItem {
  id: number;
  page_id: number;
  block_key: string;
  block_type: string;
  content: Record<string, any>;
  order_index: number;
  is_published: boolean;
}

const blockKeyTypeMap: Record<string, Section["type"]> = {
  hero: "Hero",
  our_services: "Services",
  why_filernow: "About",
  see_how_it_works: "Video",
  faq: "FAQ",
  testimonials: "Reviews",
  recent_blogs: "Blog",
  final_cta: "CTA",
};

const blockTypeFallbackMap: Record<string, Section["type"]> = {
  hero: "Hero",
  services_grid: "Services",
  timeline_steps: "About",
  video_cta: "Video",
  faq_accordion: "FAQ",
  testimonial_carousel: "Reviews",
  blog_grid: "Blog",
  cta_banner: "CTA",
};

const blockKeyTitleMap: Record<string, string> = {
  hero: "Hero Banner",
  our_services: "Our Services",
  why_filernow: "Why FilerNow",
  see_how_it_works: "See How It Works",
  faq: "FAQ",
  testimonials: "Testimonials",
  recent_blogs: "Recent Blogs",
  final_cta: "Final CTA",
};

const localSectionIdToApiBlockKey: Record<string, string> = {
  hero: "hero",
  services: "our_services",
  why: "why_filernow",
  how: "see_how_it_works",
  faq: "faq",
  reviews: "testimonials",
  blog: "recent_blogs",
  cta: "final_cta",
};

function humanizeBlockKey(blockKey: string): string {
  return blockKeyTitleMap[blockKey] ??
    blockKey.replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

function normalizeContent(item: SectionApiItem): Record<string, any> {
  switch (item.block_key) {
    case "hero":
      return {
        subtitle: item.content.badge?.text ?? "",
        headline: item.content.heading?.title ?? "",
        highlight: item.content.heading?.highlight ?? "",
        description: item.content.description ?? "",
        primaryCtaText: item.content.buttons?.[0]?.text ?? "",
        primaryCtaUrl: item.content.buttons?.[0]?.url ?? "",
        secondaryCtaText: item.content.buttons?.[1]?.text ?? "",
        secondaryCtaUrl: item.content.buttons?.[1]?.url ?? "",
        stats: item.content.stats ?? [],
        background: item.content.background ?? {},
      };

    case "our_services":
      return {
        subtitle: item.content.eyebrow ?? "",
        heading: item.content.heading ?? "",
        description: item.content.subheading ?? "",
        services: (item.content.items ?? []).map((service: any) => ({
          icon: service.icon ?? "",
          title: service.label ?? "",
          description: service.description ?? "",
          visible: service.active ?? true,
          href: service.href ?? "",
        })),
      };

    case "why_filernow":
      return {
        subtitle: item.content.eyebrow ?? "",
        title: item.content.heading ?? "",
        description: item.content.subheading ?? "",
        steps: item.content.steps ?? [],
      };

    case "see_how_it_works":
      return {
        subtitle: item.content.eyebrow ?? "",
        title: item.content.heading ?? "",
        description: item.content.description ?? "",
        ctaText: item.content.cta?.label ?? "",
        ctaUrl: item.content.cta?.href ?? "",
        videoUrl: item.content.video?.video_url ?? "",
        videoThumbnail: item.content.video?.thumbnail ?? "",
      };

    case "faq":
      return {
        subtitle: item.content.eyebrow ?? "",
        title: item.content.heading ?? "",
        description: item.content.subheading ?? "",
        faqs: item.content.items ?? [],
      };

    case "testimonials":
      return {
        subtitle: item.content.eyebrow ?? "",
        title: item.content.heading ?? "",
        description: item.content.subheading ?? "",
        testimonials: item.content.items ?? [],
      };

    case "recent_blogs":
      return {
        subtitle: item.content.eyebrow ?? "",
        title: item.content.heading ?? "",
        description: item.content.subheading ?? "",
        posts: item.content.posts ?? [],
      };

    case "final_cta":
      return {
        heading: item.content.heading ?? "",
        description: item.content.description ?? "",
        buttonText: item.content.cta?.label ?? "",
        buttonLink: item.content.cta?.href ?? "",
      };

    default:
      return item.content;
  }
}

function mapApiItemToSection(item: SectionApiItem): Section {
  return {
    id: item.block_key,
    type: blockKeyTypeMap[item.block_key] ?? blockTypeFallbackMap[item.block_type] ?? "About",
    title: humanizeBlockKey(item.block_key),
    visible: item.is_published,
    order: item.order_index,
    content: normalizeContent(item),
    // Store backend metadata for updates and deletes
    _blockId: item.id,
    _blockKey: item.block_key,
    _blockType: item.block_type,
    _pageId: item.page_id,
  };
}

function serializeContent(blockKey: string, content: Record<string, any>): Record<string, any> {
  switch (blockKey) {
    case "hero":
      return {
        badge: { text: content.subtitle ?? "" },
        heading: {
          title: content.headline ?? "",
          highlight: content.highlight ?? "",
        },
        description: content.description ?? "",
        buttons: [
          { text: content.primaryCtaText ?? "", url: content.primaryCtaUrl ?? "" },
          { text: content.secondaryCtaText ?? "", url: content.secondaryCtaUrl ?? "" },
        ],
        stats: content.stats ?? [],
        background: content.background ?? {},
      };

    case "our_services":
      return {
        eyebrow: content.subtitle ?? "",
        heading: content.heading ?? "",
        subheading: content.description ?? "",
        items: (content.services ?? []).map((service: any) => ({
          icon: service.icon ?? "",
          label: service.title ?? "",
          description: service.description ?? "",
          active: service.visible ?? true,
          href: service.href ?? "",
        })),
      };

    case "why_filernow":
      return {
        eyebrow: content.subtitle ?? "",
        heading: content.title ?? "",
        subheading: content.description ?? "",
        steps: content.steps ?? [],
      };

    case "see_how_it_works":
      return {
        eyebrow: content.subtitle ?? "",
        heading: content.title ?? "",
        description: content.description ?? "",
        cta: {
          label: content.ctaText ?? "",
          href: content.ctaUrl ?? "",
        },
        video: {
          video_url: content.videoUrl ?? "",
          thumbnail: content.videoThumbnail ?? "",
        },
      };

    case "faq":
      return {
        eyebrow: content.subtitle ?? "",
        heading: content.title ?? "",
        subheading: content.description ?? "",
        items: content.faqs ?? [],
      };

    case "testimonials":
      return {
        eyebrow: content.subtitle ?? "",
        heading: content.title ?? "",
        subheading: content.description ?? "",
        items: content.testimonials ?? [],
      };

    case "recent_blogs":
      return {
        eyebrow: content.subtitle ?? "",
        heading: content.title ?? "",
        subheading: content.description ?? "",
        posts: content.posts ?? [],
      };

    case "final_cta":
      return {
        heading: content.heading ?? "",
        description: content.description ?? "",
        cta: {
          label: content.buttonText ?? "",
          href: content.buttonLink ?? "",
        },
      };

    default:
      return content;
  }
}

export async function fetchPageSections(pageId: number): Promise<Section[]> {
  const response = await fetch(`/api/proxy/admin/content/${pageId}`, {
    cache: "no-store",
    headers: {
      ...getAdminAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load sections: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as SectionApiItem[];
  return data.map(mapApiItemToSection).sort((a, b) => a.order - b.order);
}

export async function fetchSectionByBlockKey(pageId: number, blockKey: string): Promise<Section | null> {
  const sections = await fetchPageSections(pageId);
  return sections.find((section) => section.id === blockKey) ?? null;
}

export async function fetchSectionBySectionId(pageId: number, sectionId: string): Promise<Section | null> {
  const apiBlockKey = localSectionIdToApiBlockKey[sectionId] ?? sectionId;
  return fetchSectionByBlockKey(pageId, apiBlockKey);
}

export async function updateContentBlock(
  blockId: number,
  pageId: number,
  blockKey: string,
  blockType: string,
  content: Record<string, any>,
  orderIndex: number,
  isPublished: boolean
): Promise<void> {
  const response = await fetch(`/api/proxy/admin/content/${blockId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAdminAuthHeaders(),
    },
    body: JSON.stringify({
      page_id: pageId,
      block_key: blockKey,
      block_type: blockType,
      content: serializeContent(blockKey, content),
      order_index: orderIndex,
      is_published: isPublished,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update content block: ${response.status} ${response.statusText}`);
  }
}

export async function deleteContentBlock(blockId: number): Promise<void> {
  const response = await fetch(`/api/proxy/admin/content/${blockId}`, {
    method: "DELETE",
    headers: {
      ...getAdminAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete content block: ${response.status} ${response.statusText}`);
  }
}
