import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">À propos</h3>
            <p className="text-gray-400">
              Bénin Mirror est votre guide touristique complet pour découvrir les merveilles du Bénin.
              Nous vous aidons à planifier votre voyage parfait.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/sites-touristiques" className="text-gray-400 hover:text-white">
                  Sites Touristiques
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="text-gray-400 hover:text-white">
                  Hôtels
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-gray-400 hover:text-white">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="/guides" className="text-gray-400 hover:text-white">
                  Guides
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Phone className="h-5 w-5 mr-2" />
                +229016732576 /  +2290166672622
              </li>
              <li className="flex items-center text-gray-400">
                <Mail className="h-5 w-5 mr-2" />
               kaarogroupsarl@gmail.com
              </li>
              <li className="flex items-center text-gray-400">
                <MapPin className="h-5 w-5 mr-2" />
                Akonaboè, Porto-Novo (Bénin)
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/kaarogroupsarl" className="text-gray-400 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/kaarogroupsarl" className="text-gray-400 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://x.com/kaarogroupsarl" className="text-gray-400 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} Bénin Mirror. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;