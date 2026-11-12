/* ==========================================================================
   SITE CONFIGURATION  –  EDIT THIS FILE TO UPDATE BUSINESS INFORMATION
   Every value marked "REPLACE" is a placeholder. Nothing here is invented
   business information; fill in your real details before going live.
   ========================================================================== */
window.SITE = {
  businessName: "[Enter Business Name]",            // REPLACE
  tagline: "Traditional Craftsmanship – Creating Timeless Divine Spaces",
  region: "Tamil Nadu, India",

  // Domain where the site will be hosted (no trailing slash). Used for SEO tags.
  siteUrl: "https://www.example.com",               // REPLACE

  contact: {
    address: "[Enter business address], Tamil Nadu, India", // REPLACE
    phoneDisplay: "+91 00000 00000",                // REPLACE (shown to visitors)
    phoneTel: "+910000000000",                      // REPLACE (digits for tel: link)
    whatsappNumber: "910000000000",                 // REPLACE (country code + number, no + or spaces)
    email: "info@example.com",                      // REPLACE
    hours: [                                        // REPLACE with real hours
      { days: "Monday – Saturday", time: "[Enter opening hours]" },
      { days: "Sunday", time: "[Enter hours or 'By appointment']" }
    ],
    // Paste the "src" URL from Google Maps → Share → Embed a map. Leave "" to show a search-based map.
    mapEmbedUrl: "",                                // REPLACE
    mapQuery: "Tamil Nadu, India"                   // used only if mapEmbedUrl is empty
  },

  // Leave a link as "" to hide that icon.
  social: {
    facebook: "",
    instagram: "",
    youtube: "",
    whatsappChannel: ""
  },

  // Optional: endpoint for a future backend (see README → "Connecting a backend").
  // While this is "", forms validate, confirm on screen and offer WhatsApp sending.
  formEndpoint: ""
};

// True once real contact numbers have been entered.
window.SITE.isConfigured = !/^9100000/.test(window.SITE.contact.whatsappNumber);
