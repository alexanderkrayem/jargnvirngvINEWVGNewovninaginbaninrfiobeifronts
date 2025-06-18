import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-[#005CB9] text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold">طب الأسنان العربي</Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
            <Link to="/" className={`nav-link ${isActive('/') ? 'font-bold' : ''}`}>
              الرئيسية
            </Link>
            <Link to="/articles" className={`nav-link ${isActive('/articles') ? 'font-bold' : ''}`}>
              المقالات
            </Link>
            <Link to="/research-topics" className={`nav-link ${isActive('/research-topics') ? 'font-bold' : ''}`}>
              أبحاث علمية
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="ابحث..."
                className="bg-[#0047A0] text-white px-4 py-2 rounded-full pr-10 placeholder-gray-300 w-44 focus:outline-none focus:ring-2 focus:ring-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fadeIn">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث..."
                  className="w-full bg-[#0047A0] text-white px-4 py-2 rounded-full pr-10 placeholder-gray-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search size={18} />
                </button>
              </div>
            </form>
            <nav className="flex flex-col space-y-3">
              <Link to="/" className={`py-2 ${isActive('/') ? 'font-bold' : ''}`} onClick={toggleMenu}>
                الرئيسية
              </Link>
              <Link to="/articles" className={`py-2 ${isActive('/articles') ? 'font-bold' : ''}`} onClick={toggleMenu}>
                المقالات
              </Link>
              <Link to="/research-topics" className={`py-2 ${isActive('/research-topics') ? 'font-bold' : ''}`} onClick={toggleMenu}>
                أبحاث علمية
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;