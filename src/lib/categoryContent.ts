export type CategorySlug = "events" | "media" | "influencer-marketing";

type ProjectMedia =
  | {
      type: "youtube";
      videoId: string;
    }
  | {
      type: "image";
      src: string;
    };

export interface CategoryProject {
  title: string;
  client: string;
  description: string;
  media: ProjectMedia;
  tags: string[];
}

export interface CategoryContent {
  slug: CategorySlug;
  label: string;
  title: string;
  description: string;
  projects: CategoryProject[];
}

// Add or replace projects here. Images should live in /public and start with /.
export const categoryContent: Record<CategorySlug, CategoryContent> = {
  events: {
    slug: "events",
    label: "Events",
    title: "Events that people remember",
    description:
      "From launch moments to community gatherings, we turn live experiences into meaningful brand growth.",
    projects: [
      {
        title: "Community Programs",
        client: "Add client name",
        description: "Add the event format, audience, and key result here.",
        media: { type: "image", src: "/SMXIII.jpeg" },
        tags: ["Community", "Activation"],
      },
      {
        title: "Brand Activations",
        client: "Add client name",
        description: "Add the story behind this activation.",
        media: { type: "image", src: "/LXIV.jpeg" },
        tags: ["Brand", "Campaign"],
      },
      {
        title: "Conferences & Summits",
        client: "Add client name",
        description: "Add your project details here.",
        media: { type: "image", src: "/CIXIX.jpeg" },
        tags: ["Conference", "Production"],
      },
    ],
  },
  media: {
    slug: "media",
    label: "Media",
    title: "Stories built for attention",
    description:
      "We shape sharp creative, content systems, and campaigns that move brands from being seen to being remembered.",
    projects: [
      {
        title: "Symbiotes Launch",
        client: "SWARUP RAO",
        description:
          "Add a short description of the media work and its outcome.",
        media: { type: "youtube", videoId: "52wosMtvB6Y" },
        tags: ["Brand launch"],
      },
      {
        title: "Devfest 2025",
        client: "GDG New Delhi",
        description: "Add the campaign story, format, and result here.",
        media: { type: "youtube", videoId: "COhQaIwIDCM" },
        tags: ["Events"],
      },
      {
        title: "Devfest 2024",
        client: "GDG Noida",
        description: "Add your project details here.",
        media: { type: "youtube", videoId: "qbLf1nbAhoA" },
        tags: ["Events"],
      },
      {
        title: "Unifest 2025",
        client: "Galgotias University",
        description: "Add the publication, audience, and impact here.",
        media: { type: "youtube", videoId: "oWOKIKMu6QA" },
        tags: ["Events"],
      },
      {
        title: "The GRUB Fest",
        client: "The House of Coconut",
        description: "Add the publication, audience, and impact here.",
        media: { type: "youtube", videoId: "FoMKV9WOdE0?" },
        tags: ["Events"],
      },
      {
        title: "Freshers 2025",
        client: "Galgotias University",
        description: "Add the publication, audience, and impact here.",
        media: { type: "youtube", videoId: "YZNY22KM1f0?" },
        tags: ["Events"],
      },
      {
        title: "EchoSphere 2026",
        client: "Knotic & Agora",
        description: "Add the publication, audience, and impact here.",
        media: { type: "youtube", videoId: "CSNn28xt8gg" },
        tags: ["Events"],
      },
      {
        title: "BGMI Edit",
        client: "Mystic Black",
        description: "Add the publication, audience, and impact here.",
        media: { type: "youtube", videoId: "MrWQHN4UjEo" },
        tags: ["Gaming"],
      },
      {
        title: "APEX Legends Edit",
        client: "Mystic Black",
        description: "Add the publication, audience, and impact here.",
        media: { type: "youtube", videoId: "2-H1T3yibho" },
        tags: ["Gaming"],
      },
      {
        title: "Battlefield 1",
        client: "Mystic Black",
        description: "Add the publication, audience, and impact here.",
        media: { type: "youtube", videoId: "NIeG6KGMaIM" },
        tags: ["Gaming"],
      },

    ],
  },
  "influencer-marketing": {
    slug: "influencer-marketing",
    label: "Influencer Marketing",
    title: "Influence with intention",
    description:
      "We connect brands with the right voices, turning creator partnerships into trusted conversations and measurable growth.",
    projects: [
      {
        title: "Creator Partnerships",
        client: "Add client name",
        description:
          "Add a short description of the creator program and result.",
        media: { type: "image", src: "/LXIV.jpeg" },
        tags: ["Creators", "Partnerships"],
      },
      {
        title: "Product Seeding",
        client: "Add client name",
        description: "Add the audience, product, and campaign outcome here.",
        media: { type: "image", src: "/LVII.jpeg" },
        tags: ["Seeding", "Launch"],
      },
      {
        title: "Always-on Programs",
        client: "Add client name",
        description: "Add the program details here.",
        media: { type: "image", src: "/CIXIX.jpeg" },
        tags: ["Always-on", "Community"],
      },
      {
        title: "Performance Campaigns",
        client: "Add client name",
        description: "Add the campaign metrics and story here.",
        media: { type: "image", src: "/SMXIII.jpeg" },
        tags: ["Performance", "Growth"],
      },
    ],
  },
};
