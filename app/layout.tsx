import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Cursor } from "./components/motion/Cursor";
import { MotionProvider } from "./components/motion/MotionProvider";
import { SmoothScroll } from "./components/motion/SmoothScroll";
import { SpotlightTracker } from "./components/motion/SpotlightTracker";
import { profileLinks } from "./data/portfolio";
import { siteUrl } from "./site";
import "./globals.css";

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
  "Hemal Herath is a software engineer in Colombo, Sri Lanka, shipping production mobile, web and AI products — 300K+ Play Store downloads across three apps — with Flutter, Next.js, TypeScript, PHP (CodeIgniter/Laravel) and FastAPI.";

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
  themeColor: "#0a0b0a",
  colorScheme: "dark",
};

// Show the boot screen once per session: repeat visits skip straight in.
const bootScript = `try{var s=sessionStorage;if(s.getItem("hh:boot"))document.documentElement.dataset.boot="skip";else s.setItem("hh:boot","1")}catch(e){}`;

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
  knowsAbout: ["Flutter", "Next.js", "TypeScript", "PHP", "FastAPI", "AI"],
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
      className={`${archivo.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <MotionProvider>
          <SmoothScroll />
          <Cursor />
          <SpotlightTracker />
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
