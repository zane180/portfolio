import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import ChapterRail from "@/components/ChapterRail";
import MarqueeStrip from "@/components/MarqueeStrip";
import NeuralHero from "@/components/NeuralHero";
import EducationJourney from "@/components/EducationJourney";
import ProjectShowcase from "@/components/ProjectShowcase";
import StorySkills from "@/components/StorySkills";
import Experience from "@/components/Experience";
import BeyondCode from "@/components/BeyondCode";
import StoryContact from "@/components/StoryContact";

export default function Home() {
  return (
    <div>
      <CustomCursor />
      <Navbar />
      <ChapterRail />
      <main>
        <NeuralHero />
        <MarqueeStrip />
        <EducationJourney />
        <ProjectShowcase />
        <MarqueeStrip />
        <StorySkills />
        <Experience />
        <BeyondCode />
        <MarqueeStrip />
        <StoryContact />
      </main>
    </div>
  );
}
