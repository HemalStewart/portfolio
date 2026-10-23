import { Mock } from "../kit";
import { StoreShots } from "./store-shots";

/** VibeChat AI's real App Store screenshots — its characters are artwork. */
export function ChatSoulScreen() {
  return (
    <Mock name="cs" palette={{ "--m-bg": "#0b0907", "--m-fg": "#fff4e6" }}>
      <StoreShots
        glow="247 162 27"
        shots={["01", "06", "04", "05", "12"].map(
          (n) => `/work/vibechat/${n}.webp`,
        )}
      />
    </Mock>
  );
}
