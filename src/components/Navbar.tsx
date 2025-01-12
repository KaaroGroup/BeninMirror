import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, User } from 'lucide-react';
import { useAuth } from '../lib/auth';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center">
            <Compass className="h-8 w-8 text-emerald-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Bénin Mirror</span>
          </Link>
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
            {user ? (
              <Link to="/profile" className="flex items-center text-emerald-600 hover:text-emerald-700">
                <User className="h-5 w-5 mr-1" />
                <span>Mon Profil</span>
              </Link>
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
    </nav>
  );
};

export default Navbar;