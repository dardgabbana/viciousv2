import Image from "next/image";

interface PageFooterProps {
  showLogo?: boolean;
  light?: boolean;
}

export default function PageFooter({ showLogo = true, light = false }: PageFooterProps) {
  return (
    <>
      {showLogo && (
        <div className="fixed bottom-5 left-4 z-40">
          <Image
            src={light ? "/images/logo-black.png" : "/images/logo-white.png"}
            alt="Vicious"
            width={120}
            height={45}
            className="w-[80px] md:w-[110px] h-auto"
          />
        </div>
      )}
      <div className="fixed bottom-5 left-0 right-0 text-center pointer-events-none px-3">
        <span className="v-ui-11 v-muted">2026 VICIOUS. ALL RIGHTS RESERVED.</span>
      </div>
    </>
  );
}
