import "./mockups.css";
import { ChatSoulScreen } from "./screens/chatsoul-ai";
import { EnglishMindScreen } from "./screens/englishmind-ai";
import { HuddleScreen } from "./screens/huddle";
import { LinkForexScreen } from "./screens/linkforex";
import { NoviceMonkScreen } from "./screens/novice-monk-registry";
import { PaperMindScreen } from "./screens/papermind";
import { PdmsScreen } from "./screens/pdms";
import { ScholarScreen } from "./screens/scholar-desktop";
import { SeaCloudScreen } from "./screens/sea-cloud-dalawella";
import { SmartGuardianScreen } from "./screens/smart-guardian-pro";
import { WriteScanScreen } from "./screens/writescan";

/*
 * Project screens, one file each in ./screens. Web products are rebuilt in
 * code from the live interface (real labels, figures and layout; invented
 * names where the real screen shows people); mobile apps whose screens are
 * artwork and photography (VibeChat, WriteScan) show their real store
 * screenshots, and the Sea Cloud website shows its real homepage.
 */
const SCREENS: Record<string, () => React.JSX.Element> = {
  linkforex: LinkForexScreen,
  "chatsoul-ai": ChatSoulScreen,
  writescan: WriteScanScreen,
  pdms: PdmsScreen,
  "smart-guardian-pro": SmartGuardianScreen,
  "novice-monk-registry": NoviceMonkScreen,
  huddle: HuddleScreen,
  "scholar-desktop": ScholarScreen,
  papermind: PaperMindScreen,
  "englishmind-ai": EnglishMindScreen,
  "sea-cloud-dalawella": SeaCloudScreen,
};

export function ProjectMockup({ slug }: { slug: string }) {
  const Screen = SCREENS[slug];
  return Screen ? <Screen /> : null;
}
