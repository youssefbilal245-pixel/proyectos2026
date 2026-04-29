import "./index.css";
import { Composition } from "remotion";
import { SamuraiCyberpunk } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SamuraiCyberpunk"
        component={SamuraiCyberpunk}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
