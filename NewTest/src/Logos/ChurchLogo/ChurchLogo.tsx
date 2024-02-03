import logoLight from '@/assets/FBC+TV+Logo+CMYK.png'; // adjust the path as needed
import logoDark from '@/assets/FBC+TV+Logo+white.png';
import './ChurchLogoStyle.css'; // adjust the path as needed
import { useTheme } from "@/components/theme-provider"


function cLogo() {
    const { theme } = useTheme();
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const logo = isDark ? logoDark : logoLight;
  return (
    <>
      <img src={logo} alt="My Logo" className="my-logo" />
   
    </>
  );
}
export default cLogo