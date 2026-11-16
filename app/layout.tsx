import type { Metadata, Viewport } from "next";
import {
  Archivo,
  Caveat,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import { BoardMotion } from "./components/board/BoardMotion";
import { YouCursor } from "./components/board/YouCursor";
import { MotionProvider } from "./components/motion/MotionProvider";
import { SmoothScroll } from "./components/motion/SmoothScroll";
import { profileLinks } from "./data/portfolio";
import { siteUrl } from "./site";
import "./globals.css";
import "./styles/sections.css";
import "./styles/hero.css";
import "./styles/board.css";

// Archivo's width axis gives the expanded display cuts; body text stays normal width.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

// One italic serif phrase per headline.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
});

// The handwriting on the board: annotations, sticky notes, arrow labels.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  // Secondary face: don't compete with the display font for early bandwidth.
  preload: false,
});

const title = "Hemal Herath — Software Engineer · Mobile, Web & AI";
const description =
  "Hemal Herath is a software engineer in Colombo, Sri Lanka, who designs and ships production websites, web apps, Flutter apps and AI products — 300K+ Play Store downloads across three apps — with Flutter, Next.js, TypeScript, PHP (CodeIgniter/Laravel) and FastAPI.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "Hemal Herath",
  authors: [{ name: "Hemal Herath", url: "https://github.com/HemalStewart" }],
  creator: "Hemal Herath",
  keywords: [
    "Hemal Herath",
    "software engineer",
    "Sri Lanka",
    "Colombo",
    "Flutter",
    "Next.js",
    "TypeScript",
    "mobile developer",
    "Flutter developer",
    "web developer",
    "web designer",
    "AI",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Hemal Herath",
    locale: "en_US",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f1ea",
  colorScheme: "light",
};

/*
 * Runs before first paint. `data-motion` turns on the scroll reveals, whose
 * hidden states would otherwise strand content; it is never set with reduced
 * motion, and it is withdrawn if the script that plays them never arrives.
 */
const boardScript = `try{var d=document.documentElement;if(!matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.motion="on";setTimeout(function(){if(!window.__board)delete d.dataset.motion},5000)}}catch(e){}`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hemal Herath",
  jobTitle: "Software Engineer",
  url: siteUrl,
  image: `${siteUrl}/opengraph-image`,
  email: "mailto:nuwanhemal@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Colombo",
    addressCountry: "LK",
  },
  sameAs: profileLinks
    .filter((link) => link.label === "GitHub" || link.label === "LinkedIn")
    .map((link) => link.href),
  knowsAbout: [
    "Web design",
    "Web development",
    "Flutter",
    "Next.js",
    "TypeScript",
    "PHP",
    "FastAPI",
    "AI",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Westminster",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: boardScript }} />
      </head>
      <body>
        <MotionProvider>
          <SmoothScroll />
          <BoardMotion />
          <YouCursor />
          {children}
        </MotionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
