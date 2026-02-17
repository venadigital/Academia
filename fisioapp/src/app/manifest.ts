import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FISIOAPP",
    short_name: "FISIOAPP",
    description: "Seguimiento clínico y operativo para centros de fisioterapia.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f2ec",
    theme_color: "#1f7a76",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
