// Site photographs (public/images/site). All freely licensed; full list with
// sources in docs/image-credits.md.

export interface SitePhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit: string;
  creditUrl: string;
  license: string;
  /** focal point for object-position */
  position?: string;
}

export const PHOTOS = {
  bottles: {
    src: "/images/site/hero-celadon-bottles.webp",
    alt: "Rows of glazed stoneware bottles in olive celadon, pale teal and matte black at Heath Ceramics, Sausalito",
    width: 2000,
    height: 1334,
    credit: "Jessica Ruscello",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Large_ceramic_bottles_(Unsplash).jpg",
    license: "CC0",
    position: "50% 55%",
  },
  shino: {
    src: "/images/site/shino-tea-bowl.webp",
    alt: "A Shino tea bowl with a thick, pitted white glaze over warm clay",
    width: 1600,
    height: 1111,
    credit: "Marie-Lan Nguyen, Musée des Beaux-Arts de Lyon",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Shino_chawan_MBA_Lyon_E554-146.jpg",
    license: "CC BY 3.0",
    position: "50% 50%",
  },
  wheel: {
    src: "/images/site/hands-at-the-wheel.webp",
    alt: "Clay-covered hands opening a terracotta pot on a spinning wheel",
    width: 1600,
    height: 1067,
    credit: "Jared Sluyter",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Making_pottery_(Unsplash).jpg",
    license: "CC0",
    position: "50% 50%",
  },
  earthen: {
    src: "/images/site/earthen-pots-drying.webp",
    alt: "Rows of unfired earthen pots drying in the sun at Pottery Town, Bangalore",
    width: 2000,
    height: 1334,
    credit: "Advay m",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Earthen_pots_drying_in_the_sun.jpg",
    license: "CC BY-SA 4.0",
    position: "50% 60%",
  },
  hands: {
    src: "/images/site/hands-in-clay.webp",
    alt: "Two hands pressing a lump of grey clay on a worn wooden bench",
    width: 1600,
    height: 1067,
    credit: "Alex Jones",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Pottery_and_craft_(Unsplash).jpg",
    license: "CC0",
    position: "55% 50%",
  },
  onta: {
    src: "/images/site/onta-pots-drying.webp",
    alt: "Lidded Onta ware pots drying on wooden boards in Hita, Japan",
    width: 2000,
    height: 1500,
    credit: "STA3816",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Onta_Pottery_drying_in_the_sun.jpg",
    license: "CC BY-SA 3.0",
    position: "50% 40%",
  },
} satisfies Record<string, SitePhoto>;
