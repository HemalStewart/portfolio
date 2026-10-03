import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { profileLinks } from "./data/portfolio";
import { siteUrl } from "./site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
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
  "Hemal Herath is a software engineer in Colombo, Sri Lanka, shipping production mobile, web and AI products with Flutter, Next.js, TypeScript, PHP (CodeIgniter/Laravel) and FastAPI.";

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
  themeColor: "#f4f2ea",
  colorScheme: "light",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hemal Herath",
  jobTitle: "Software Engineer",
  url: siteUrl,
  image: `${siteUrl}/avatar.png`,
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
