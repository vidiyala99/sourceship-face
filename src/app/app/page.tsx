import { Shell } from "@/components/shell";
import { StartPanel } from "@/components/start-panel";

export default function AppHome() {
  return (
    <Shell eyebrow="Ready when you are">
      <StartPanel />
    </Shell>
  );
}
