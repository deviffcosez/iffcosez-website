// The IFFCO Kisan SEZ location on Google Maps, shared by the home page
// (Strategic Location) and the contact page so both always match.
export const MAP_QUERY =
  "IFFCO Kisan SEZ, Racharlapadu, Kodavaluru Mandalam, SPSR Nellore, Andhra Pradesh";

// Zoom level of the embed: 6 shows southern India around Nellore.
export const MAP_ZOOM = 6;

export const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=${MAP_ZOOM}&output=embed`;
export const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;
