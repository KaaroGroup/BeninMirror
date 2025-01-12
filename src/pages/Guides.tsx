import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import BookingForm from '../components/BookingForm';
import { Search } from 'lucide-react';

interface Guide {
  id: string;
  name: string;
  description: string;
  languages: string[];
  price_per_day: number;
  image_url: string;
}

const Guides = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  useEffect(() => {
    const fetchGuides = async () => {
      let query = supabase
        .from('guides')
        .select('*')
        .order('name');

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      if (selectedLanguage !== 'all') {
        query = query.contains('languages', [selectedLanguage]);
      }

      switch (priceRange) {
        case 'low':
          query = query.lte('price_per_day', 25000);
          break;
        case 'medium':
          query = query.gt('price_per_day', 25000).lte('price_per_day', 50000);
          break;
        case 'high':
          query = query.gt('price_per_day', 50000);
          break;
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching guides:', error);
      } else {
        setGuides(data || []);
      }
      setLoading(false);
    };

    fetchGuides();
  }, [searchTerm, selectedLanguage, priceRange]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 px-4">
        <div className="max-w-7xl mx-auto py-12">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 px-4">
      <div className="max-w-7xl mx-auto py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Guides Touristiques</h1>
          
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un guide..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">Toutes les langues</option>
              <option value="Français">Français</option>
              <option value="Anglais">Anglais</option>
              <option value="Fon">Fon</option>
              <option value="Yoruba">Yoruba</option>
            </select>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value as typeof priceRange)}
              className="px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">Tous les prix</option>
              <option value="low">{"< 25,000 FCFA/jour"}</option>
              <option value="medium">25,000 - 50,000 FCFA/jour</option>
              <option value="high">{"> 50,000 FCFA/jour"}</option>
            </select>
          </div>
        </div>

        {guides.length === 0 ? (
          <p className="text-center text-gray-600">Aucun guide ne correspond à vos critères.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide) => (
              <div key={guide.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={guide.image_url}
                  alt={guide.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{guide.name}</h2>
                  <p className="text-gray-600 mb-4">{guide.description}</p>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Langues parlées:</h3>
                    <div className="flex flex-wrap gap-2">
                      {guide.languages.map((language, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-600 font-semibold">
                      {guide.price_per_day.toLocaleString('fr-FR')} FCFA / jour
                    </span>
                    <button
                      onClick={() => setSelectedGuide(guide)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
                    >
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedGuide && (
          <BookingForm
            type="guide"
            itemId={selectedGuide.id}
            price={selectedGuide.price_per_day}
            onSuccess={() => {
              setSelectedGuide(null);
              alert('Réservation effectuée avec succès !');
            }}
            onCancel={() => setSelectedGuide(null)}
          />
        )}
      </div>
    </div>
  );
}

export default Guides;