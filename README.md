# Temple Sculpture Works – Website

A fast, responsive static website (HTML5, CSS3, vanilla JavaScript – no build step, no framework) for a Tamil Nadu temple cement sculpture business.

## 1. Run it locally

Open `index.html` in a browser. Or serve the folder:

```
python3 -m http.server 8000     # then visit http://localhost:8000
```

## 2. Folder structure

```
index.html  about.html  services.html  works.html  experience.html (3D tour)  process.html  enquiry.html  contact.html
css/style.css            all styling (colour variables at the top of the file)
js/config.js             ★ business name, phone, WhatsApp, email, address, hours, map, social links
js/components.js         reusable header, footer, floating WhatsApp button, icons, structured data
js/main.js               mobile menu, sticky header, scroll animations
js/gallery.js            gallery filters, masonry/grid layout, lightbox
js/forms.js              form validation, success message, WhatsApp hand-off, backend hook
js/temple3d.js           3D Temple Experience scene (Three.js)
js/vendor/               three.min.js, OrbitControls.js, BufferGeometryUtils.js (bundled, MIT licence) – no CDN needed
images/photos/           ★ drop YOUR real photos here (hero.jpg, about.jpg, workshop.jpg) – used automatically
data/projects.js         ★ portfolio projects and categories
images/                  favicon, placeholder images (images/placeholders/)
robots.txt  sitemap.xml  SEO files
```

## 3. Before you go live – checklist

1. **`js/config.js`** – replace every value marked `REPLACE`: business name, address, phone, WhatsApp number (country code + number, no `+`), email, hours, domain (`siteUrl`), social links.
2. **Google Maps** – on Google Maps search your business → *Share* → *Embed a map* → copy the `src="…"` URL into `contact.mapEmbedUrl`.
3. **Images** – every picture in `images/placeholders/` is a **labelled placeholder**. Add real photographs of your own work: put `hero.jpg`, `about.jpg` and `workshop.jpg` in `images/photos/` (they replace the placeholders automatically and the "placeholder" note disappears), and add project photos as described in §5. Do not use photos of projects you did not execute.
4. **About page** – replace the highlighted note box in `about.html` with your real company story. Add only verified facts (no years of experience, awards or project counts unless true).
5. **Restoration service** – `services.html` includes "Sculpture Restoration and Renovation". If you do not offer it, delete that `<article id="restoration">` block and remove the link to it from your menu/footer if added.
6. **Domain in SEO tags** – in every `.html` file, `robots.txt` and `sitemap.xml`, replace `https://www.example.com` with your real domain (use your editor's *Find & Replace in files*).
7. **Social share image** – add a 1200×630 `images/og-image.jpg` (a photo of your best work).
8. Search for the text `[Enter` across the project to catch any remaining placeholders.

## 4. Updating business information

All contact details live in **`js/config.js`**. Edit once; the header, footer, contact page, WhatsApp links and structured data update everywhere.

LocalBusiness structured data (JSON-LD) is added automatically **only after** you replace the placeholder name, phone and domain, so that no unverified details are published.

## 5. Adding or changing gallery images

1. Save optimised photos in `images/projects/` (create the folder). Recommended: JPG/WebP, about 1600 px wide, under 300 KB each. Use descriptive file names like `gopuram-madurai-1.jpg`.
2. Open `data/projects.js` and add an entry:

```js
{
  id: "ganesha-statue-salem",          // unique
  title: "Ganesha Cement Sculpture",
  location: "Salem, Tamil Nadu",
  category: "deity",                   // deity | gopuram | pillar | mandapam | architecture | decorative | completed
  description: "10 ft Ganesha sculpture installed at …",
  featured: true,                      // show on homepage highlights (first 3 featured)
  images: [
    { src: "images/projects/ganesha-1.jpg", alt: "10 ft cement Ganesha sculpture at Salem temple" },
    { src: "images/projects/ganesha-2.jpg", alt: "Close-up of Ganesha sculpture detail" }
  ]
}
```

3. Delete the sample entries (those with `placeholder: true`). The gallery, filters, lightbox and homepage update automatically. A category filter appears only when it has projects. To add a new category, add it to `PROJECT_CATEGORIES` in the same file.

Write meaningful `alt` text – it helps SEO and accessibility.

## 6. The enquiry and contact forms

The forms validate mandatory fields (name, valid Indian mobile, email, project, category, location, description), reject non-image/oversized uploads, and include a hidden spam-trap field.

**Current behaviour (no backend):** after valid submission a confirmation appears with a **Send on WhatsApp** button that opens WhatsApp with the enquiry pre-filled. Reference images cannot travel through a WhatsApp link, so the message asks the customer to share them in the chat. The structured payload is also logged to the browser console for developers.

**Connecting a backend later:** set `formEndpoint` in `js/config.js` to your API URL. Forms are then POSTed as `multipart/form-data` with the fields, the image files and a JSON `payload` field (`formType`, `submittedAt`, `fields`, `files`). This is the integration point for enquiry management, quotations and an admin dashboard. Quick no-code options: Formspree, Web3Forms, Getform, or Google Apps Script – paste their endpoint URL.

## 7. Deployment

The site is plain static files – upload the whole folder to any host:

- **Netlify / Cloudflare Pages / Vercel** – drag and drop the folder (or connect a Git repo). Free, HTTPS included.
- **GitHub Pages** – push to a repo and enable Pages.
- **Shared hosting (cPanel)** – upload the folder contents to `public_html`.

After launch: submit `https://yourdomain/sitemap.xml` in Google Search Console and create a Google Business Profile for local search.

## 8. SEO implementation

- Unique `<title>` and meta description per page targeting terms such as *temple cement sculptures*, *temple sculpture works in Tamil Nadu*, *cement god statues*, *temple gopuram works*, *temple pillar sculptures*, *custom temple sculptures*.
- Open Graph and Twitter meta tags, canonical URLs, semantic headings, image `alt` text, lazy-loaded images.
- `robots.txt`, `sitemap.xml`, LocalBusiness JSON-LD (see §4).

Note: header and footer are injected by `js/components.js`; page content itself is plain HTML that search engines read directly.

## 9. Accessibility and performance

Skip link, keyboard-operable menu and lightbox (Esc, ←/→), focus styles, ARIA labels, form error announcements, reduced-motion support, high-contrast palette, mobile-first CSS, lazy loading and no heavy libraries.

## 10. The 3D Temple Experience (`experience.html`)

A realistic-style, interactive South Indian temple compound built with Three.js and generated entirely in code: a seven-kalasam gopuram with sloped tiers, arched niches and painted stucco figures; a stone-framed doorway with guardian figures; a pillared porch; red-and-white striped compound walls; a flagstaff; palms and hills; and devotees walking in the courtyard. Visitors can drag to rotate, scroll/pinch to zoom, switch camera views (Aerial, Front, Entrance, Crown), switch lighting (Day, Dusk, Night with lamps and string lights), toggle auto-rotate, go full screen, and tap gold markers that explain each part and link to the matching service.

- It is **illustrative** and labelled as such on the page. It is not a photograph or model of any completed project; keep that note unless you replace it with your own scanned or modelled work.
- Edit marker texts and links in `HOTS`, camera positions in `VIEWS`, lighting in `TIMES` and tier colours in `PLASTER` inside `js/temple3d.js`.
- To show a real 3D model of your own sculpture later (a `.glb` file), add `GLTFLoader.js` from the same Three.js version (r128) to `js/vendor/` and load it in `temple3d.js`.
- Performance: geometry is merged into a few draw calls, pixel ratio is capped on phones, rendering pauses when off-screen or the tab is hidden, reduced-motion is respected, and a friendly fallback shows if WebGL is unavailable.

## 11. Future expansion (not built yet, by design)

The following are intentionally **not** in this release (no dead buttons): admin dashboard, dynamic portfolio management, enquiry management, quotation generation, customer login, order tracking, production, inventory, labour and expense/financial modules.

The structure is ready for them: portfolio data is already separated in `data/projects.js` (can be swapped for an API/CMS), forms already build a structured payload and support an endpoint, and header/footer are shared components. For a larger system, migrate to React using the same palette (CSS variables in `style.css`) and the same data shapes.
