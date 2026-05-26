// Twitter card image — same dimensions as OG (summary_large_image is 1200x630).
// Re-export the opengraph-image route so we don't duplicate the render code.
export { default, alt, size, contentType } from "./opengraph-image";
