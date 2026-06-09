"use client";
import Image from "next/image";

interface LogoProps {
  /** Show the platform name under the logo */
  show?: boolean;
}

const Logo: React.FC<LogoProps> = ({ show }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Use public SVG logo */}
      <Image
        src="/logo.svg"
        alt="Logo"
        width={64}
        height={64}
        className="mx-auto"
      />
        {show && (
          <span className="text-base font-medium text-foreground">ePathshala</span>
        )}
    </div>
  );
};

export default Logo;
