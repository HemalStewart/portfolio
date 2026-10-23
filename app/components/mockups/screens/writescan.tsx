import { Mock } from "../kit";
import { StoreShots } from "./store-shots";

/** WriteScan's real store screenshots, fanned on its blue-glow stage. */
export function WriteScanScreen() {
  return (
    <Mock name="ws" palette={{ "--m-bg": "#050a17", "--m-fg": "#eef4ff" }}>
      <StoreShots
        glow="38 112 255"
        shots={["ocr", "handwriting", "home", "pdf-tools", "ai-bots"].map(
          (n) => `/work/writescan/${n}.webp`,
        )}
      />
    </Mock>
  );
}
