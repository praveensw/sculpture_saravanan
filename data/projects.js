/* ==========================================================================
   PORTFOLIO DATA  –  ADD / EDIT / REMOVE PROJECTS HERE
   The gallery, filters, lightbox and homepage highlights all read this list.
   No HTML changes are needed to add a project.

   The entries below are DEVELOPMENT PLACEHOLDERS ("placeholder: true").
   They show a "Placeholder" badge on the site. Replace them with your real,
   completed projects and set placeholder to false (or delete the field).

   Fields:
     id          unique, url-safe text
     title       project title
     location    town / district, Tamil Nadu
     category    one of: deity, gopuram, pillar, mandapam, architecture,
                 decorative, completed
     description short text about the work
     featured    true → appears in "Project Highlights" on the homepage
     images      list of { src, alt } – first image is the cover
   ========================================================================== */
window.PROJECT_CATEGORIES = [
  { key: "deity",        label: "Deity Sculptures" },
  { key: "gopuram",      label: "Gopuram Works" },
  { key: "pillar",       label: "Pillar Sculptures" },
  { key: "mandapam",     label: "Mandapam Works" },
  { key: "architecture", label: "Temple Architecture" },
  { key: "decorative",   label: "Decorative Sculptures" },
  { key: "completed",    label: "Completed Temple Projects" }
];

window.PROJECTS = [
  {
    id: "sample-deity-1", placeholder: true, featured: true,
    title: "Sample Project – Deity Sculpture",
    location: "[Town, District]",
    category: "deity",
    description: "Placeholder entry. Replace with a real deity sculpture project: describe the deity, height, finish and temple.",
    images: [
      { src: "images/placeholders/deity-1.svg", alt: "Placeholder for a cement deity sculpture photograph" },
      { src: "images/placeholders/deity-2.svg", alt: "Placeholder for a second view of the deity sculpture" }
    ]
  },
  {
    id: "sample-gopuram-1", placeholder: true, featured: true,
    title: "Sample Project – Gopuram Sculptures",
    location: "[Town, District]",
    category: "gopuram",
    description: "Placeholder entry. Replace with a real gopuram project: number of tiers, figures sculpted and installation details.",
    images: [
      { src: "images/placeholders/gopuram-1.svg", alt: "Placeholder for a temple gopuram sculpture photograph" },
      { src: "images/placeholders/gopuram-2.svg", alt: "Placeholder for a gopuram detail photograph" }
    ]
  },
  {
    id: "sample-pillar-1", placeholder: true, featured: true,
    title: "Sample Project – Temple Pillars",
    location: "[Town, District]",
    category: "pillar",
    description: "Placeholder entry. Replace with a real pillar and column sculpture project.",
    images: [
      { src: "images/placeholders/pillar-1.svg", alt: "Placeholder for a sculpted temple pillar photograph" },
      { src: "images/placeholders/pillar-2.svg", alt: "Placeholder for a pillar detail photograph" }
    ]
  },
  {
    id: "sample-mandapam-1", placeholder: true,
    title: "Sample Project – Mandapam Works",
    location: "[Town, District]",
    category: "mandapam",
    description: "Placeholder entry. Replace with a real mandapam sculpture project.",
    images: [
      { src: "images/placeholders/mandapam-1.svg", alt: "Placeholder for a mandapam sculpture photograph" },
      { src: "images/placeholders/mandapam-2.svg", alt: "Placeholder for a mandapam detail photograph" }
    ]
  },
  {
    id: "sample-architecture-1", placeholder: true,
    title: "Sample Project – Temple Architecture",
    location: "[Town, District]",
    category: "architecture",
    description: "Placeholder entry. Replace with a real traditional architectural design project.",
    images: [
      { src: "images/placeholders/architecture-1.svg", alt: "Placeholder for a temple architecture photograph" }
    ]
  },
  {
    id: "sample-decorative-1", placeholder: true,
    title: "Sample Project – Decorative Sculptures",
    location: "[Town, District]",
    category: "decorative",
    description: "Placeholder entry. Replace with a real decorative sculpture project.",
    images: [
      { src: "images/placeholders/decorative-1.svg", alt: "Placeholder for a decorative cement sculpture photograph" }
    ]
  },
  {
    id: "sample-completed-1", placeholder: true,
    title: "Sample Project – Completed Temple",
    location: "[Town, District]",
    category: "completed",
    description: "Placeholder entry. Replace with a real completed temple project and the scope of work you delivered.",
    images: [
      { src: "images/placeholders/completed-1.svg", alt: "Placeholder for a completed temple project photograph" }
    ]
  }
];
