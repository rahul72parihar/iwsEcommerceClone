const MEN_SHIRT_IMAGE = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
const WOMEN_DRESS_IMAGE = "https://plus.unsplash.com/premium_photo-1675186049409-f9f8f60ebb5e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const SHOE_IMAGE = "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export const hardcodedProductsData = [
  // MEN SHIRTS - 20 items ALL SAME IMAGE
  { id: "men-1", title: "Men's Classic White Shirt 1", price: "29.99", image: MEN_SHIRT_IMAGE, category: "MEN" },
  { id: "men-2", title: "Men's Blue Oxford Shirt 2", price: "34.99", image: MEN_SHIRT_IMAGE, category: "MEN" },
  { id: "men-3", title: "Men's Denim Shirt 3", price: "39.99", image: MEN_SHIRT_IMAGE, category: "MEN" },
  { id: "men-4", title: "Men's Flannel Shirt 4", price: "44.99", image: MEN_SHIRT_IMAGE, category: "MEN" },
  { id: "men-5", title: "Men's Linen Shirt 5", price: "49.99", image: MEN_SHIRT_IMAGE, category: "MEN" },
  { id: "men-6", title: "Men's Polo Shirt 6", price: "24.99", image: MEN_SHIRT_IMAGE, category: "MEN" },
  { id: "men-7", title: "Men's Button-Down 7", price: "32.99", image: MEN_SHIRT_IMAGE, category: "MEN" },
  { id: "men-8", title: "Men's Work Shirt 8", price: "28.99", image: MEN_SHIRT_IMAGE, category: "MEN" },
  { id: "men-9", title: "Men's Casual Shirt 9", price: "36.99", image: MEN_SHIRT_IMAGE, category: "MEN" },
  { id: "men-10", title: "Men's Slim Fit 10", price: "41.99", image: MEN_SHIRT_IMAGE, category: "MEN" },
  { id: "men-11", title: "Men's Plaid Shirt 11", price: "37.99", image: MEN_SHIRT_IMAGE, category: "MEN" },
  { id: "men-12", title: "Men's Chambray 12", price: "33.99", image: MEN_SHIRT_IMAGE, category: "MEN" },
  { id: "men-13", title: "Men's Patterned 13", price: "38.99", image: MEN_SHIRT_IMAGE, category: "MEN" },
  { id: "men-14", title: "Men's Long Sleeve 14", price: "42.99", image: MEN_SHIRT_IMAGE, category: "MEN" },
  { id: "men-15", title: "Men's Short Sleeve 15", price: "27.99", image: MEN_SHIRT_IMAGE, category: "MEN" },
  { id: "men-16", title: "Men's Formal Shirt 16", price: "45.99", image: MEN_SHIRT_IMAGE, category: "MEN" },
  { id: "men-17", title: "Men's Western Shirt 17", price: "35.99", image: MEN_SHIRT_IMAGE, category: "MEN" },
  { id: "men-18", title: "Men's Henley Shirt 18", price: "31.99", image: MEN_SHIRT_IMAGE, category: "MEN" },
  { id: "men-19", title: "Men's Tuxedo Shirt 19", price: "48.99", image: MEN_SHIRT_IMAGE, category: "MEN" },
  { id: "men-20", title: "Men's Dress Shirt 20", price: "52.99", image: MEN_SHIRT_IMAGE, category: "MEN" },
  
  // WOMEN DRESSES - 20 items ALL SAME IMAGE
{ id: "women-1", title: "Women's Maxi Dress 1", price: "59.99", image: WOMEN_DRESS_IMAGE, category: "WOMEN", trending: true },
  { id: "women-2", title: "Women's Cocktail Dress 2", price: "79.99", image: WOMEN_DRESS_IMAGE, category: "WOMEN" },
  { id: "women-3", title: "Women's Summer Dress 3", price: "49.99", image: WOMEN_DRESS_IMAGE, category: "WOMEN" },
  { id: "women-4", title: "Women's Evening Gown 4", price: "129.99", image: WOMEN_DRESS_IMAGE, category: "WOMEN" },
  { id: "women-5", title: "Women's Wrap Dress 5", price: "69.99", image: WOMEN_DRESS_IMAGE, category: "WOMEN" },
  { id: "women-6", title: "Women's Floral Dress 6", price: "54.99", image: WOMEN_DRESS_IMAGE, category: "WOMEN" },
  { id: "women-7", title: "Women's Shift Dress 7", price: "64.99", image: WOMEN_DRESS_IMAGE, category: "WOMEN" },
  { id: "women-8", title: "Women's A-Line Dress 8", price: "74.99", image: WOMEN_DRESS_IMAGE, category: "WOMEN" },
  { id: "women-9", title: "Women's Bodycon 9", price: "89.99", image: WOMEN_DRESS_IMAGE, category: "WOMEN" },
  { id: "women-10", title: "Women's Sundress 10", price: "44.99", image: WOMEN_DRESS_IMAGE, category: "WOMEN" },
  { id: "women-11", title: "Women's Midi Dress 11", price: "67.99", image: WOMEN_DRESS_IMAGE, category: "WOMEN" },
  { id: "women-12", title: "Women's Party Dress 12", price: "99.99", image: WOMEN_DRESS_IMAGE, category: "WOMEN" },
  { id: "women-13", title: "Women's Boho Dress 13", price: "72.99", image: WOMEN_DRESS_IMAGE, category: "WOMEN" },
  { id: "women-14", title: "Women's Lace Dress 14", price: "84.99", image: WOMEN_DRESS_IMAGE, category: "WOMEN" },
  { id: "women-15", title: "Women's Casual Dress 15", price: "58.99", image: WOMEN_DRESS_IMAGE, category: "WOMEN" },
  { id: "women-16", title: "Women's Formal Dress 16", price: "119.99", image: WOMEN_DRESS_IMAGE, category: "WOMEN" },
  { id: "women-17", title: "Women's Printed 17", price: "63.99", image: WOMEN_DRESS_IMAGE, category: "WOMEN" },
  { id: "women-18", title: "Women's Empire Dress 18", price: "77.99", image: WOMEN_DRESS_IMAGE, category: "WOMEN" },
  { id: "women-19", title: "Women's Peplum Dress 19", price: "82.99", image: WOMEN_DRESS_IMAGE, category: "WOMEN" },
  { id: "women-20", title: "Women's Sheath Dress 20", price: "94.99", image: WOMEN_DRESS_IMAGE, category: "WOMEN" },
  
  // SHOES - 20 items ALL SAME IMAGE
{ id: "shoes-1", title: "Men's Leather Shoes 1", price: "89.99", image: SHOE_IMAGE, category: "SHOES", trending: true },
  { id: "shoes-2", title: "Women's Heels 2", price: "129.99", image: SHOE_IMAGE, category: "SHOES" },
  { id: "shoes-3", title: "Sneakers 3", price: "79.99", image: SHOE_IMAGE, category: "SHOES" },
  { id: "shoes-4", title: "Boots 4", price: "149.99", image: SHOE_IMAGE, category: "SHOES" },
  { id: "shoes-5", title: "Loafers 5", price: "99.99", image: SHOE_IMAGE, category: "SHOES" },
  { id: "shoes-6", title: "Sandals 6", price: "69.99", image: SHOE_IMAGE, category: "SHOES" },
  { id: "shoes-7", title: "Casual Shoes 7", price: "85.99", image: SHOE_IMAGE, category: "SHOES" },
  { id: "shoes-8", title: "Dress Shoes 8", price: "119.99", image: SHOE_IMAGE, category: "SHOES" },
  { id: "shoes-9", title: "Running Shoes 9", price: "109.99", image: SHOE_IMAGE, category: "SHOES" },
  { id: "shoes-10", title: "Espadrilles 10", price: "74.99", image: SHOE_IMAGE, category: "SHOES" },
  { id: "shoes-11", title: "Wedge Heels 11", price: "134.99", image: SHOE_IMAGE, category: "SHOES" },
  { id: "shoes-12", title: "Flats 12", price: "59.99", image: SHOE_IMAGE, category: "SHOES" },
  { id: "shoes-13", title: "Platform Shoes 13", price: "94.99", image: SHOE_IMAGE, category: "SHOES" },
  { id: "shoes-14", title: "Ankle Boots 14", price: "139.99", image: SHOE_IMAGE, category: "SHOES" },
  { id: "shoes-15", title: "Mules 15", price: "84.99", image: SHOE_IMAGE, category: "SHOES" },
  { id: "shoes-16", title: "Slippers 16", price: "39.99", image: SHOE_IMAGE, category: "SHOES" },
  { id: "shoes-17", title: "Oxford Shoes 17", price: "104.99", image: SHOE_IMAGE, category: "SHOES" },
  { id: "shoes-18", title: "Pumps 18", price: "124.99", image: SHOE_IMAGE, category: "SHOES" },
  { id: "shoes-19", title: "Wedges 19", price: "114.99", image: SHOE_IMAGE, category: "SHOES" },
  { id: "shoes-20", title: "Brogues 20", price: "129.99", image: SHOE_IMAGE, category: "SHOES" }
];

export const categoriesList = ["MEN", "WOMEN", "SHOES"];

