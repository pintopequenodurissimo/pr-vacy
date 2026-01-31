import privacyLogo from "@/assets/privacy-logo-png_seeklogo-648492.png";

const Header = () => {
  return (
    <header className="w-full h-16 sm:h-20 md:h-24 bg-card border-b border-border flex items-center justify-center overflow-hidden relative z-0">
      <div className="container mx-auto px-4 flex justify-center">
        <a href="/" className="flex items-center">
          <img
            src={privacyLogo}
            alt="Privacy logo"
            className="h-28 sm:h-40 md:h-48 object-contain"
          />
        </a>
      </div>
    </header>
  );
};

export default Header;
