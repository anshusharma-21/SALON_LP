// Resolves files in /public against the deploy base (works at / and at /uksalons/).
export const asset = (p) => `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`;
export const img = (name) => asset(`images/${name}`);
