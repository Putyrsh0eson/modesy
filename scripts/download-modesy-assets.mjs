import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const targetDir = path.join(rootDir, 'public', 'sites', 'modesy');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const assets = [
  // Logo
  { url: 'https://modesy.codingest.net/assets/img/logo.svg', filename: 'logo.svg' },
  // Sliders
  { url: 'https://modesy.codingest.net/uploads/slider/202608/slider_2560x800_6a94336760c054-95358530.webp', filename: 'slider-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/slider/202608/slider_2560x800_6a9434c4d28763-19000658.webp', filename: 'slider-2.webp' },
  // Categories
  { url: 'https://modesy.codingest.net/uploads/category/category_64fa3284422356-62618554.webp', filename: 'cat-clothing.webp' },
  { url: 'https://modesy.codingest.net/uploads/category/category_64fa32d947a2c2-95720633.webp', filename: 'cat-home-living.webp' },
  { url: 'https://modesy.codingest.net/uploads/category/category_64fa33016cd3d5-22961515.webp', filename: 'cat-toys.webp' },
  { url: 'https://modesy.codingest.net/uploads/category/category_64fa33130537d7-29441060.webp', filename: 'cat-womens-clothing.webp' },
  { url: 'https://modesy.codingest.net/uploads/category/category_64fa3334490a07-19765633.webp', filename: 'cat-mens-clothing.webp' },
  { url: 'https://modesy.codingest.net/uploads/category/category_64fa3341655123-11031908.webp', filename: 'cat-furniture.webp' },
  { url: 'https://modesy.codingest.net/uploads/category/category_64fa335861cdd2-08512447.webp', filename: 'cat-necklaces.webp' },
  { url: 'https://modesy.codingest.net/uploads/category/category_64fa33817aca32-54738529.webp', filename: 'cat-graphics.webp' },
  { url: 'https://modesy.codingest.net/uploads/category/category_64fa33c32d65d7-74266909.webp', filename: 'cat-painting.webp' },
  { url: 'https://modesy.codingest.net/uploads/category/category_64fa33e7271260-26824134.webp', filename: 'cat-boots.webp' },
  { url: 'https://modesy.codingest.net/uploads/category/category_64fa33f6b755e4-34777699.webp', filename: 'cat-pillows.webp' },
  { url: 'https://modesy.codingest.net/uploads/category/category_64fa340bbb1f36-33117053.webp', filename: 'cat-handbags.webp' },
  // Banners
  { url: 'https://modesy.codingest.net/uploads/blocks/202508/block_68b02a364b90c6-71529931.webp', filename: 'banner-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/blocks/202508/block_68b02a59a1d144-08234125.webp', filename: 'banner-2.webp' },
  { url: 'https://modesy.codingest.net/uploads/blocks/202508/block_68b02a748392d5-47296084.webp', filename: 'banner-3.webp' },
  { url: 'https://modesy.codingest.net/uploads/blocks/202508/block_68b02b0fa06e09-81527750.webp', filename: 'banner-4.webp' },
  { url: 'https://modesy.codingest.net/uploads/blocks/202508/block_68b02a91357c27-13557247.webp', filename: 'banner-5.webp' },
  // Payment
  { url: 'https://modesy.codingest.net/assets/img/payment/visa.svg', filename: 'visa.svg' },
  { url: 'https://modesy.codingest.net/assets/img/payment/mastercard.svg', filename: 'mastercard.svg' },
  { url: 'https://modesy.codingest.net/assets/img/payment/maestro.svg', filename: 'maestro.svg' },
  { url: 'https://modesy.codingest.net/assets/img/payment/amex.svg', filename: 'amex.svg' },
  { url: 'https://modesy.codingest.net/assets/img/payment/discover.svg', filename: 'discover.svg' },
  // Flags
  { url: 'https://modesy.codingest.net/uploads/blocks/flag_eng.jpg', filename: 'flag_eng.jpg' },
  // Products
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b47e4f83c917-29188591.webp', filename: 'prod-digital-prints-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b47e4d8478d6-88291147.webp', filename: 'prod-digital-prints-2.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b4201f177942-79779282.webp', filename: 'prod-lace-top-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b4201c061823-88575118.webp', filename: 'prod-lace-top-2.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b444b8350808-17188737.webp', filename: 'prod-lace-blouse-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b444ba2690c6-93793826.webp', filename: 'prod-lace-blouse-2.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b4782b9f3272-81456431.webp', filename: 'prod-sundress-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b4782d17e5e8-92500257.webp', filename: 'prod-sundress-2.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b411ed6f0554-72302953.webp', filename: 'prod-backpack-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b411f439fd39-00932789.webp', filename: 'prod-backpack-2.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b42a279b91f6-61790023.webp', filename: 'prod-sneakers-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b42a255e65b7-96161731.webp', filename: 'prod-sneakers-2.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b47ead253a50-47019432.webp', filename: 'prod-handbag-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b47eabaeb595-62316622.webp', filename: 'prod-handbag-2.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b483286b2598-48004230.webp', filename: 'prod-pillow-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b4833ada8cd5-61059376.webp', filename: 'prod-pillow-2.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b48029e507b3-80580535.webp', filename: 'prod-skirt-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b42b1dbd5113-51388874.webp', filename: 'prod-sunhat-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b4478aacfd82-63745400.webp', filename: 'prod-mens-shoes-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b4478e10d820-00614578.webp', filename: 'prod-mens-shoes-2.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b32b29e2f025-79851586.webp', filename: 'prod-tshirt-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b304f24b4223-50676672.webp', filename: 'prod-tshirt-2.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b48824422f87-70195961.webp', filename: 'prod-scarf-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b48827defcd6-43890638.webp', filename: 'prod-scarf-2.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b48729787ae5-77108034.webp', filename: 'prod-bootie-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b48731af7348-03410142.webp', filename: 'prod-bootie-2.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b48564a31327-49271135.webp', filename: 'prod-polka-dress-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b485694fb4e1-78372446.webp', filename: 'prod-polka-dress-2.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b484e37e8a50-42247775.webp', filename: 'prod-couch-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b4841c7942d4-77775842.webp', filename: 'prod-women-backpack-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b48436761319-74272069.webp', filename: 'prod-women-backpack-2.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b44b6b76e197-04055027.webp', filename: 'prod-blue-handbag-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b41f0210c3e2-91723360.webp', filename: 'prod-cute-handbag-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b41f0a9f9af2-04013465.webp', filename: 'prod-cute-handbag-2.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b41d399b3227-56366628.webp', filename: 'prod-black-leather-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b41d3b1f3f62-70315357.webp', filename: 'prod-black-leather-2.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b35c1e9c8457-42169009.webp', filename: 'prod-bracelet-1.webp' },
  { url: 'https://modesy.codingest.net/uploads/images/202508/img_w480_68b35c1cd280d9-73859894.webp', filename: 'prod-bracelet-2.webp' },
];

async function downloadAll() {
  console.log(`Starting download of ${assets.length} assets...`);
  for (const item of assets) {
    const dest = path.join(targetDir, item.filename);
    if (fs.existsSync(dest)) {
      console.log(`Already exists: ${item.filename}`);
      continue;
    }
    try {
      const res = await fetch(item.url);
      if (!res.ok) {
        console.error(`Failed to fetch ${item.url}: status ${res.status}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buffer);
      console.log(`Downloaded: ${item.filename}`);
    } catch (err) {
      console.error(`Error downloading ${item.url}:`, err.message);
    }
  }
  console.log('All assets processed successfully!');
}

downloadAll();
