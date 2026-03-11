import { useEffect, useState } from "react";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"draw" | "glow" | "exit">("draw");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("glow"), 2000);
    const t2 = setTimeout(() => setPhase("exit"), 2800);
    const t3 = setTimeout(onComplete, 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background ${
        phase === "exit" ? "animate-splash-out" : ""
      }`}
    >
      {/* Decorative gear */}
      <svg
        className="absolute top-10 right-10 w-20 h-20 text-primary/10 animate-gear"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M50 30a20 20 0 100 40 20 20 0 000-40zm0 30a10 10 0 110-20 10 10 0 010 20z" />
        <path d="M47 10h6v12h-6zM47 78h6v12h-6zM78 47v6H66v-6zM22 47v6H10v-6zM69.8 23.6l4.2 4.2-8.5 8.5-4.2-4.2zM34.5 63.7l4.2 4.2-8.5 8.5-4.2-4.2zM76.4 69.8l-4.2 4.2-8.5-8.5 4.2-4.2zM36.3 34.5l-4.2 4.2-8.5-8.5 4.2-4.2z" />
      </svg>

      <svg
        className="absolute bottom-16 left-12 w-14 h-14 text-muted-foreground/10 animate-gear"
        style={{ animationDirection: "reverse", animationDuration: "12s" }}
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M50 30a20 20 0 100 40 20 20 0 000-40zm0 30a10 10 0 110-20 10 10 0 010 20z" />
        <path d="M47 10h6v12h-6zM47 78h6v12h-6zM78 47v6H66v-6zM22 47v6H10v-6z" />
      </svg>

      {/* CK Letters */}
      <div className={phase === "glow" ? "animate-ck-glow" : ""}>
        <svg viewBox="0 0 200 100" className="w-48 h-24 md:w-64 md:h-32">
          <text
            x="20"
            y="78"
            className="animate-ck-draw"
            fill="none"
            stroke="hsl(24 100% 50%)"
            strokeWidth="2"
            fontSize="72"
            fontFamily="Rajdhani, sans-serif"
            fontWeight="700"
          >
            CK
          </text>
        </svg>
      </div>

      <p className="mt-4 text-sm tracking-[0.3em] uppercase text-muted-foreground animate-slide-up stagger-3">
        CoreKonstruct
      </p>

      {/* Loading bar */}
      <div className="mt-8 w-48 h-0.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-[2800ms] ease-out"
          style={{ width: phase === "draw" ? "30%" : phase === "glow" ? "80%" : "100%" }}
        />
      </div>
    </div>
  );
};

export default SplashScreen;
