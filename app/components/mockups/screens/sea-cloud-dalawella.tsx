import "./sea-cloud-dalawella.css";
import Image from "next/image";
import { Browser, Mock } from "../kit";

/** Sea Cloud is a website, so like the showcase it shows the real homepage. */
export function SeaCloudScreen() {
  return (
    <Mock
      name="sc"
      palette={{
        "--m-bg": "#0f2a2a",
        "--m-fg": "#f4f1ea",
        "--m-panel": "#132c2c",
      }}
    >
      <Browser url="hotel-kohl-ten.vercel.app">
        <Image
          className="sc-shot"
          src="/showcase/thumbs/seacloud.jpg"
          alt=""
          width={1280}
          height={800}
          sizes="(max-width: 900px) 90vw, 400px"
        />
      </Browser>
    </Mock>
  );
}
