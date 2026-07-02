import AchievementHud from "@/components/AchievementHud";
import Atmosphere from "@/components/Atmosphere";
import SmoothScroll from "@/components/SmoothScroll";
import { XRayToggle } from "@/components/XRay";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import ChapterRail from "@/components/ChapterRail";
import GitHubHeartbeat from "@/components/GitHubHeartbeat";
import MarqueeStrip from "@/components/MarqueeStrip";
import NeuralHero from "@/components/NeuralHero";
import EducationJourney from "@/components/EducationJourney";
import ProjectShowcase from "@/components/ProjectShowcase";
import StorySkills from "@/components/StorySkills";
import Experience from "@/components/Experience";
import BeyondCode from "@/components/BeyondCode";
import MatchWithZane from "@/components/MatchWithZane";
import StoryContact from "@/components/StoryContact";

export default function Home() {
  return (
    <div>
      <SmoothScroll />
      <Atmosphere />
      <CustomCursor />
      <Navbar />
      <ChapterRail />
      <AchievementHud />
      <XRayToggle />
      <main>
        <NeuralHero />
        <GitHubHeartbeat />
        <MarqueeStrip />
        <EducationJourney />
        <ProjectShowcase />
        <MarqueeStrip />
        <StorySkills />
        <Experience />
        <BeyondCode />
        <MatchWithZane />
        <MarqueeStrip />
        <StoryContact />
      </main>
    </div>
  );
}
