import "./websites.css";
import Image from "next/image";
import { Browser, Mock } from "../kit";

/**
 * Shipped websites show their real homepage, like Sea Cloud. Shots are
 * 1280px wide headless-Chrome captures of the live sites in public/work/sites.
 */
function Website({
  url,
  shot,
  height = 800,
  palette,
}: {
  url: string;
  shot: string;
  height?: number;
  palette: Record<string, string>;
}) {
  return (
    <Mock name="web" palette={palette}>
      <Browser url={url}>
        <Image
          className="web-shot"
          src={`/work/sites/${shot}.jpg`}
          alt=""
          width={1280}
          height={height}
          sizes="(max-width: 900px) 90vw, 400px"
        />
      </Browser>
    </Mock>
  );
}

export function PirivenScreen() {
  return (
    <Website
      url="piriven.moe.gov.lk"
      shot="piriven"
      palette={{ "--m-bg": "#2a1418", "--m-fg": "#fbf3e6", "--m-panel": "#3a1d22" }}
    />
  );
}

export function NilaveliScreen() {
  return (
    <Website
      url="nilavelibeachresort.com"
      shot="nilaveli"
      palette={{ "--m-bg": "#0d2b30", "--m-fg": "#f6efe2", "--m-panel": "#123840" }}
    />
  );
}

export function CeylonSelectScreen() {
  return (
    <Website
      url="ceylonselect.com"
      shot="ceylon-select"
      palette={{ "--m-bg": "#f5f3ee", "--m-fg": "#1f3a2f", "--m-panel": "#ffffff" }}
    />
  );
}

export function CalcifyScreen() {
  return (
    <Website
      url="calcifyint.com"
      shot="calcify"
      palette={{ "--m-bg": "#0b0b0d", "--m-fg": "#f2f1ec", "--m-panel": "#151518" }}
    />
  );
}

export function LakminiScreen() {
  return (
    <Website
      url="lakminiint.com"
      shot="lakmini"
      height={736}
      palette={{ "--m-bg": "#0b0b0b", "--m-fg": "#f4f1ec", "--m-panel": "#161616" }}
    />
  );
}
