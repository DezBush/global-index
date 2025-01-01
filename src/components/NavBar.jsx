import { useState, useEffect } from "react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickAway = (event) => {
      if (
        isMenuOpen &&
        !event.target.closest(".navbar") &&
        !event.target.closest("#id")
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickAway);
    return () => document.removeEventListener("click", handleClickAway);
  }, [isMenuOpen]);

  return (
    <header className="bg-gray-800 text-white navbar">
      <div className="container mx-auto flex items-center justify-between p-4">
        <a href="/" className="text-2xl font-bold hover:text-gray-300">
          Global Index
        </a>

        <nav className="hidden md:flex space-x-6">
          <a href="https://global-index-api.onrender.com/" className="hover:text-gray-300">
            API
          </a>
          <a href="https://github.com/DezBush/global-index" className="hover:text-gray-300">
            Github
          </a>
          <a href="https://desmondbush.com/" className="hover:text-gray-300">
            Contact
          </a>
        </nav>

        <button
          onClick={toggleMenu}
          className="block md:hidden text-gray-300 hover:text-white"
          aria-label="Toggle Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col space-y-2 p-4 bg-gray-700">
          <a href="https://github.com/DezBush/global-index" className="hover:text-gray-300">
            Github Link
          </a>
          <a href="https://global-index-api.onrender.com/" className="hover:text-gray-300">
            API
          </a>
          <a href="https://desmondbush.com/" className="hover:text-gray-300">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
