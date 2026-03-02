import { useTheme } from "@/components/theme-provider";

interface LogoProps {
  size?: string;
}

export function Logo({ size = "5em" }: LogoProps) {
  const { theme } = useTheme();
  const b2endpoint = import.meta.env.VITE_REACT_B2_ENDPOINT;

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const logo = isDark
    ? b2endpoint + "logos/FBC_TV_Logo_White.png"
    : b2endpoint + "logos/FBC_TV_Logo.png";

  return (
    <img
      src={logo}
      alt="Logo"
      className="block w-auto object-contain rounded-md"
      style={{ height: size }}
    />
  );
}