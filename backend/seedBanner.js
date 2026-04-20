import mongoose from "mongoose";
import dotenv from "dotenv";
import PageBanner from "./models/PageBanner.js";

dotenv.config();

const seedData = [
  {
    page: "main",
    banners: [
      {
        title: "Main Banner 1",
        image: "https://picsum.photos/seed/main-1/1200/400",
        link: "/",
        order: 1,
      },
      {
        title: "Main Banner 2",
        image: "https://picsum.photos/seed/main-2/1200/400",
        link: "/",
        order: 2,
      },
      {
        title: "Main Banner 3",
        image: "https://picsum.photos/seed/main-3/1200/400",
        link: "/",
        order: 3,
      },
      {
        title: "Main Banner 4",
        image: "https://picsum.photos/seed/main-4/1200/400",
        link: "/",
        order: 4,
      }
    ],
  },

  {
    page: "men",
    banners: [
      {
        title: "Men Banner 1",
        image: "https://picsum.photos/seed/men-1/1200/400",
        link: "/men",
        order: 1,
      },
      {
        title: "Men Banner 2",
        image: "https://picsum.photos/seed/men-2/1200/400",
        link: "/men",
        order: 2,
      },
      {
        title: "Men Banner 3",
        image: "https://picsum.photos/seed/men-3/1200/400",
        link: "/men",
        order: 3,
      },
      {
        title: "Men Banner 4",
        image: "https://picsum.photos/seed/men-4/1200/400",
        link: "/men",
        order: 4,
      }
    ],
  },

  {
    page: "women",
    banners: [
      {
        title: "Women Banner 1",
        image: "https://picsum.photos/seed/women-1/1200/400",
        link: "/women",
        order: 1,
      },
      {
        title: "Women Banner 2",
        image: "https://picsum.photos/seed/women-2/1200/400",
        link: "/women",
        order: 2,
      },
      {
        title: "Women Banner 3",
        image: "https://picsum.photos/seed/women-3/1200/400",
        link: "/women",
        order: 3,
      },
      {
        title: "Women Banner 4",
        image: "https://picsum.photos/seed/women-4/1200/400",
        link: "/women",
        order: 4,
      }
    ],
  },

  {
    page: "shoes",
    banners: [
      {
        title: "Shoes Banner 1",
        image: "https://picsum.photos/seed/shoes-1/1200/400",
        link: "/shoes",
        order: 1,
      },
      {
        title: "Shoes Banner 2",
        image: "https://picsum.photos/seed/shoes-2/1200/400",
        link: "/shoes",
        order: 2,
      },
      {
        title: "Shoes Banner 3",
        image: "https://picsum.photos/seed/shoes-3/1200/400",
        link: "/shoes",
        order: 3,
      },
      {
        title: "Shoes Banner 4",
        image: "https://picsum.photos/seed/shoes-4/1200/400",
        link: "/shoes",
        order: 4,
      }
    ],
  },
];

const seedBanners = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await PageBanner.deleteMany();
    await PageBanner.insertMany(seedData);

    console.log("✅ Seeded without loops");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedBanners();