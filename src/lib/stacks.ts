export type FrameworkId =
  | "nextjs"
  | "react"
  | "nuxt"
  | "vue"
  | "svelte"
  | "angular"
  | "html"
  | "wordpress";

export interface Framework {
  id: FrameworkId;
  name: string;
  letter: string;
  badgeBg: string;
  hint: string;
  filename: string;
}

export const FRAMEWORKS: Framework[] = [
  { id: "nextjs", name: "Next.js", letter: "N", badgeBg: "bg-black", hint: "App Router · next/script", filename: "app/layout.tsx" },
  { id: "react", name: "React / Vite", letter: "R", badgeBg: "bg-[#0a8fb5]", hint: "Vite · CRA · SPA", filename: "index.html" },
  { id: "nuxt", name: "Nuxt 3", letter: "U", badgeBg: "bg-[#00dc82]", hint: "Vue · nuxt.config", filename: "nuxt.config.ts" },
  { id: "vue", name: "Vue", letter: "V", badgeBg: "bg-[#2f9e6e]", hint: "Vue 3 · main.ts", filename: "src/main.ts" },
  { id: "svelte", name: "SvelteKit", letter: "S", badgeBg: "bg-[#e0451f]", hint: "+layout.svelte", filename: "src/routes/+layout.svelte" },
  { id: "angular", name: "Angular", letter: "A", badgeBg: "bg-[#c2262e]", hint: "index.html", filename: "src/index.html" },
  { id: "html", name: "HTML", letter: "H", badgeBg: "bg-[#e2662b]", hint: "Plain script tag", filename: "index.html" },
  { id: "wordpress", name: "WordPress", letter: "W", badgeBg: "bg-[#2a6aa1]", hint: "functions.php / plugin", filename: "functions.php" },
];

export function isFrameworkId(v: string | null | undefined): v is FrameworkId {
  return !!v && FRAMEWORKS.some((f) => f.id === v);
}

export function getFramework(id: string | null | undefined): Framework {
  return FRAMEWORKS.find((f) => f.id === id) ?? FRAMEWORKS[0];
}

export function getSnippet(
  framework: FrameworkId | string,
  opts: { beaconSrc: string; projectId: string; domain: string },
): { filename: string; code: string; language: string } {
  const { beaconSrc, projectId, domain } = opts;
  const tag = `<script\n  defer\n  src="${beaconSrc}"\n  data-pid="${projectId}"\n  data-domain="${domain}"\n></script>`;
  switch (framework) {
    case "nextjs":
      return {
        filename: "app/layout.tsx",
        language: "tsx",
        code: `import Script from "next/script";\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <body>\n        {children}\n        <Script\n          src="${beaconSrc}"\n          data-pid="${projectId}"\n          data-domain="${domain}"\n          strategy="afterInteractive"\n        />\n      </body>\n    </html>\n  );\n}`,
      };
    case "nuxt":
      return {
        filename: "nuxt.config.ts",
        language: "ts",
        code: `export default defineNuxtConfig({\n  app: {\n    head: {\n      script: [\n        {\n          src: "${beaconSrc}",\n          defer: true,\n          "data-pid": "${projectId}",\n          "data-domain": "${domain}",\n        },\n      ],\n    },\n  },\n});`,
      };
    case "vue":
      return {
        filename: "src/main.ts",
        language: "ts",
        code: `// src/main.ts —beacon loads once, custom events anywhere\nconst s = document.createElement("script");\ns.defer = true;\ns.src = "${beaconSrc}";\ns.setAttribute("data-pid", "${projectId}");\ns.setAttribute("data-domain", "${domain}");\ndocument.head.appendChild(s);\n\n// window.route?.track("signup_completed", { plan: "pro" });`,
      };
    case "svelte":
      return {
        filename: "src/routes/+layout.svelte",
        language: "svelte",
        code: `<svelte:head>\n  <script\n    defer\n    src="${beaconSrc}"\n    data-pid="${projectId}"\n    data-domain="${domain}"\n  ></script>\n</svelte:head>\n\n<slot />`,
      };
    case "angular":
      return {
        filename: "src/index.html",
        language: "html",
        code: `<!-- src/index.html, before </body> -->\n${tag}`,
      };
    case "wordpress":
      return {
        filename: "functions.php",
        language: "php",
        code: `// functions.php — loads beacon on every page\nadd_action('wp_head', function () { ?>\n  <script\n    defer\n    src="${beaconSrc}"\n    data-pid="${projectId}"\n    data-domain="${domain}"\n  ></script>\n<?php });`,
      };
    case "react":
      return {
        filename: "index.html",
        language: "html",
        code: `<!-- index.html <head> — Vite / CRA -->\n${tag}\n\n<script>\n  // custom events anywhere:\n  // window.route?.track("signup_completed", { plan: "pro" });\n</script>`,
      };
    case "html":
    default:
      return {
        filename: "index.html",
        language: "html",
        code: `<!-- paste before </head> -->\n${tag}`,
      };
  }
}
