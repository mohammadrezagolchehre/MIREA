'use client'

import Grainient from "../Grainient";

type Props = {
  color1?: string;
  color2?: string;
  color3?: string;
}

export default function Background({
  color1 = "#120c6e",
  color2 = "#1E293B",
  color3 = "#ff9190",
}: Props) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black"
    >
      <div
        className="mirea-gradient-fallback absolute -inset-[12%]"
        style={{
          background: `
            radial-gradient(circle at 18% 22%, ${color1} 0%, transparent 42%),
            radial-gradient(circle at 82% 24%, ${color3} 0%, transparent 40%),
            radial-gradient(circle at 48% 88%, ${color2} 0%, transparent 52%),
            linear-gradient(135deg, ${color2} 0%, ${color1} 52%, ${color3} 100%)
          `,
        }}
      />
      <div className="absolute inset-0">
          <Grainient
            color1={color1}
            color2={color2}
            color3={color3}
            timeSpeed={0.035}
            warpStrength={0.22}
            warpFrequency={2.2}
            warpSpeed={0.5}
            warpAmplitude={65.0}
            blendSoftness={0.18}
            blendAngle={-25}
            rotationAmount={60.0}
            noiseScale={1.0}
            grainAmount={0.018}
            grainScale={1.4}
            grainAnimated={false}
            contrast={1.08}
            gamma={1.05}
            saturation={0.82}
            zoom={1.06}
          />
      </div>
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
