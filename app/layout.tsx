import type { Metadata, Viewport } from "next";
import { Covered_By_Your_Grace, Martian_Mono, Mona_Sans } from "next/font/google";
import { BoardMotion } from "./components/board/BoardMotion";
import { YouCursor } from "./components/board/YouCursor";
import { MotionProvider } from "./components/motion/MotionProvider";
import { SmoothScroll } from "./components/motion/SmoothScroll";
import { Boot } from "./components/swarm/Boot";
import { Swarm } from "./components/swarm/Swarm";
import { profileLinks } from "./data/portfolio";
import { siteUrl } from "./site";
import "./globals.css";
import "./styles/sections.css";
import "./styles/hero.css";
import "./styles/board.css";

// Mona Sans (GitHub's typeface): its width axis gives the expanded display
// cuts, and body text stays at normal width.
const monaSans = Mona_Sans({
  variable: "--font-mona",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

// The handwriting on the board: a felt marker, as on a real whiteboard.
const marker = Covered_By_Your_Grace({
  variable: "--font-marker",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

const martianMono = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
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
  themeColor: "#0f0f11",
  colorScheme: "dark",
};

/*
 * Runs before first paint. `data-motion` turns on the scroll reveals, whose
 * hidden states would otherwise strand content; it is never set with reduced
 * motion, and it is withdrawn if the script that plays them never arrives.
 * It also restores the side panels a returning visitor left open.
 */
const boardScript = `try{var d=document.documentElement;if(!matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.motion="on";setTimeout(function(){if(!window.__board)delete d.dataset.motion},5000)}var p=localStorage.getItem("hh-panels")||"";if(p.indexOf("l")>-1)d.dataset.lp="";if(p.indexOf("r")>-1)d.dataset.rp=""}catch(e){}`;

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
      className={`${monaSans.variable} ${martianMono.variable} ${marker.variable}`}
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
          <Boot />
          {children}
          <Swarm />
        </MotionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
