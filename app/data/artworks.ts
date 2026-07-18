export type ArtCategory = "tanjore" | "miniature" | "pichwai" | "canvas";

export interface Artwork {
  id: number;
  src: string;
  title: string;
  year: string;
  description: string;
  category: ArtCategory;
}

export const artworks: Artwork[] = [
  { id: 0,  src: "/photos/p1.jpg",         title: "Serenity I",      year: "2024", description: "A meditative exploration of form and stillness, rendered in quiet hues that speak of the unseen." , category: "pichwai" },
  { id: 1,  src: "/photos/p2.jpg",         title: "Serenity II",     year: "2024", description: "Companion to Serenity I — the dialogue between two silences, separated yet whole." , category: "pichwai" },
  { id: 2,  src: "/photos/download-1.jpg", title: "Emergence",       year: "2023", description: "From the depths of the canvas, forms rise and dissolve. Life in perpetual becoming." , category: "miniature" },
  { id: 3,  src: "/photos/download-2.jpg", title: "Resonance",       year: "2023", description: "Vibrations made visible. Every mark a frequency, every hue a wavelength of feeling." , category: "miniature" },
  { id: 4,  src: "/photos/download-3.jpg", title: "Confluence",      year: "2023", description: "Where two streams of thought meet and merge into something neither could achieve alone." , category: "tanjore" },
  { id: 5,  src: "/photos/download-4.jpg", title: "Dusk Fragment",   year: "2023", description: "A moment caught between day and dark — fleeting, luminous, irretrievably beautiful." , category: "miniature" },
  { id: 6,  src: "/photos/download-5.jpg", title: "Void Bloom",      year: "2022", description: "Even in absence, something flowers. The void as fertile ground for imagination." , category: "tanjore" },
  { id: 7,  src: "/photos/download-6.jpg", title: "Cartography",     year: "2022", description: "Mapping interior landscapes. The territory of emotion, drawn with line and light." , category: "canvas" },
  { id: 8,  src: "/photos/download-7.jpg", title: "Tension Arc",     year: "2022", description: "The moment before release. A bow drawn taut, the arrow still and loaded." , category: "tanjore" },
  { id: 9,  src: "/photos/download-8.jpg", title: "Gentle Weight",   year: "2022", description: "Some things press softly but persistently. This is their portrait." , category: "canvas" },
  { id: 10, src: "/photos/download-9.jpg", title: "Chromatic Memory","year": "2022", description: "Color as mnemonics. Each shade a door to a room we have forgotten we entered." , category: "tanjore" },
  { id: 11, src: "/photos/download-10.jpg",title: "Still Current",   year: "2021", description: "Water that appears still but moves beneath. Stillness is never absolute." , category: "canvas" },
  { id: 12, src: "/photos/download-11.jpg",title: "Threshold",       year: "2021", description: "The doorway between what was and what might be. Standing here, always." , category: "pichwai" },
  { id: 13, src: "/photos/download-12.jpg",title: "Fracture Lines",  year: "2021", description: "Where things break, light enters. The cracks are the most honest parts." , category: "miniature" },
  { id: 14, src: "/photos/download-13.jpg",title: "Slow Hours",      year: "2021", description: "Time rendered tactile. You can almost feel the weight of an afternoon." , category: "canvas" },
  { id: 15, src: "/photos/download-14.jpg",title: "Echo Chamber",    year: "2021", description: "Repetition as meaning. The echo that arrives back, changed." , category: "canvas" },
  { id: 16, src: "/photos/download-15.jpg",title: "Mineral Deep",    year: "2020", description: "Geological time compressed. Layers of earth and self, stratified." , category: "tanjore" },
  { id: 17, src: "/photos/download-16.jpg",title: "Peripheral",      year: "2020", description: "What we see from the corner of the eye. The truths that vanish when looked at directly." , category: "miniature" },
  { id: 18, src: "/photos/download-17.jpg",title: "Soft Geometry",   year: "2020", description: "Mathematics made warm. The tenderness hidden inside every perfect form." , category: "canvas" },
  { id: 19, src: "/photos/download-18.jpg",title: "Undercurrent",    year: "2020", description: "Below the surface of things, a pull. Invisible but insistent, shaping everything." , category: "tanjore" },
  { id: 20, src: "/photos/8210519f-bf3c-4eb4-8be0-f0c2b25e98fd.jpg", title: "Unnamed I", year: "2024", description: "Some works resist naming. They exist as pure sensation, prior to language." , category: "pichwai" },
  { id: 21, src: "/photos/c4051c2c-6458-4a0a-8976-ceb10d5a47b8.jpg", title: "Unnamed II", year: "2024", description: "The second in a series of works that refuse the frame of a title." , category: "pichwai" },
];
