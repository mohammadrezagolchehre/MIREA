'use client'

import Grainient from "../Grainient"

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
    <>
      <div className="fixed inset-0 -z-20 pointer-events-none transition-all duration-[3000ms]">
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
      <div className="fixed inset-0 -z-10 bg-black/30 pointer-events-none" />
    </>
  );
}