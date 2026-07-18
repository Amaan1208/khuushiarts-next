import { ArtCategory } from "../data/artworks";

export interface CategoryInfo {
  slug: ArtCategory;
  name: string;
  tagline: string;
  description: string;
  preview: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: "tanjore",
    name: "Tanjore Art",
    tagline: "Gold leaf and gesso relief in the South Indian devotional tradition",
    description:
      "Panels built up in gesso relief and finished with gold leaf, glass beads, and jewel tones. Each piece follows the Thanjavur tradition of giving the deity physical presence: the gold catches lamplight the way temple icons do.",
    preview: "/photos/c2.jpg",
  },
  {
    slug: "miniature",
    name: "Miniature Paintings",
    tagline: "Court scenes and devotional narratives in fine brushwork",
    description:
      "Small-format works in the Rajasthani and Pahari manner: single-hair brushes, mineral pigments, and compositions that reward a viewer standing close. Scenes of music, courtship, and devotion painted at the scale of a held page.",
    preview: "/photos/c4.jpg",
  },
  {
    slug: "pichwai",
    name: "Pichwai Art",
    tagline: "Shrinathji, lotus, and cattle in the Nathdwara temple style",
    description:
      "Devotional cloth paintings from the Nathdwara tradition, made to hang behind the deity. Recurring motifs of Shrinathji, lotus garlands, and sacred cows are rendered in dense, celebratory detail.",
    preview: "/photos/c1.jpg",
  },
  {
    slug: "canvas",
    name: "Canvas Paintings",
    tagline: "Contemporary compositions in oil and acrylic",
    description:
      "Modern canvas work alongside the traditional forms: studies of animals, architecture, and daily life where the older disciplines of color and patience carry into contemporary subjects.",
    preview: "/photos/c3.jpg",
  },
];
