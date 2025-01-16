import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, User, Menu, X, Building } from 'lucide-react';
import { useAuth } from '../lib/auth';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center">
            <Compass className="h-8 w-8 text-emerald-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Bénin Mirror</span>
          </Link>

          {/* Menu mobile */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-emerald-600">
              Accueil
            </Link>
            <Link to="/sites-touristiques" className="text-gray-700 hover:text-emerald-600">
              Sites Touristiques
            </Link>
            <Link to="/hotels" className="text-gray-700 hover:text-emerald-600">
              Hôtels
            </Link>
            <Link to="/restaurants" className="text-gray-700 hover:text-emerald-600">
              Restaurants
            </Link>
            <Link to="/guides" className="text-gray-700 hover:text-emerald-600">
              Guides
            </Link>
            <Link to="/partner/register" className="text-gray-700 hover:text-emerald-600">
              <Building className="h-5 w-5 inline-block mr-1" />
              Devenir Partenaire
            </Link>
            {user ? (
              <div className="relative group">
                <button className="flex items-center text-emerald-600 hover:text-emerald-700">
                  <User className="h-5 w-5 mr-1" />
                  <span>Mon Compte</span>
                </button>
                <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl hidden group-hover:block">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mon Profil
                  </Link>
                  <Link
                    to="/partner/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard Partenaire
                  </Link>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Menu mobile overlay */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-700 hover:text-emerald-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/sites-touristiques"
              className="block px-3 py-2 text-gray-700 hover:text-emerald-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Sites Touristiques
            </Link>
            <Link
              to="/hotels"
              className="block px-3 py-2 text-gray-700 hover:text-emerald-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Hôtels
            </Link>
            <Link
              to="/restaurants"
              className="block px-3 py-2 text-gray-700 hover:text-emerald-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Restaurants
            </Link>
            <Link
              to="/guides"
              className="block px-3 py-2 text-gray-700 hover:text-emerald-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Guides
            </Link>
            <Link
              to="/partner/register"
              className="block px-3 py-2 text-gray-700 hover:text-emerald-600"
              onClick={() => setIsMenuOpen(false)}
            >
              <Building className="h-5 w-5 inline-block mr-1" />
              Devenir Partenaire
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-emerald-600 hover:text-emerald-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5 inline-block mr-1" />
                  Mon Profil
                </Link>
                <Link
                  to="/partner/dashboard"
                  className="block px-3 py-2 text-emerald-600 hover:text-emerald-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard Partenaire
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate('/auth');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-emerald-600 hover:text-emerald-700"
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;