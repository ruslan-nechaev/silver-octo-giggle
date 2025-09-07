import { Component as TextGlow } from "@/components/ui/text-glow-hover";

const DemoOne = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center bg-[#111111]">
      <div className="w-full h-full">
        <TextGlow
          text="Aura"
          copies={100}
          textColor="#FFFFFF"
          backgroundColor="#111111"
          font={{ fontFamily: "UnifrakturMaguntia, system-ui", fontSize: 120, fontWeight: 600 }}
          shadowColor="#FFFFFF"
          useGradientGlow={false}
          animateGlow={false}
          shadowScaleFactor={0.01}
          glowBlur={64}
          glowOpacity={2}
        />
      </div>
    </div>
  );
};

export { DemoOne };



