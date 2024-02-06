import logoLight from '@/assets/FBC_TV_Logo.png'; // adjust the path as needed
import logoDark from '@/assets/FBC_TV_Logo_white.png';
import '@/Logos/ChurchLogo.css'; // adjust the path as needed
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