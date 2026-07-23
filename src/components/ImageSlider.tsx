import Image from "next/image";

const images = Array.from(
  { length: 10 },
  (_, i) => `/images/slider/kobra-${String(i + 1).padStart(2, "0")}.jpg`
);

const loopImages = [...images, ...images];

export default function ImageSlider() {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex w-max animate-v-marquee">
        {loopImages.map((src, i) => (
          <div
            key={i}
            className="group relative h-[190px] w-[140px] md:h-[300px] md:w-[220px] flex-shrink-0 overflow-hidden bg-black/5"
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover grayscale-0 contrast-100 transition-[filter] duration-500 ease-out group-hover:grayscale group-hover:contrast-125 group-hover:brightness-90"
              sizes="(min-width: 768px) 220px, 140px"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#ff1a1a_0%,#8a0000_55%,#100000_100%)] opacity-0 mix-blend-multiply transition-opacity duration-500 ease-out group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
