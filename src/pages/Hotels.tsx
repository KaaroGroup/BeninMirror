import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import BookingForm from '../components/BookingForm';
import { Search } from 'lucide-react';

interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  price_per_night: number;
  image_url: string;
}

const Hotels = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  useEffect(() => {
    const fetchHotels = async () => {
      let query = supabase
        .from('hotels')
        .select('*')
        .order('name');

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      switch (priceRange) {
        case 'low':
          query = query.lte('price_per_night', 50000);
          break;
        case 'medium':
          query = query.gt('price_per_night', 50000).lte('price_per_night', 100000);
          break;
        case 'high':
          query = query.gt('price_per_night', 100000);
          break;
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching hotels:', error);
      } else {
        setHotels(data || []);
      }
      setLoading(false);
    };

    fetchHotels();
  }, [searchTerm, priceRange]);

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
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Hôtels</h1>
          
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un hôtel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value as typeof priceRange)}
              className="px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">Tous les prix</option>
              <option value="low">{"< 50,000 FCFA"}</option>
              <option value="medium">50,000 - 100,000 FCFA</option>
              <option value="high">{"> 100,000 FCFA"}</option>
            </select>
          </div>
        </div>

        {hotels.length === 0 ? (
          <p className="text-center text-gray-600">Aucun hôtel ne correspond à vos critères.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={hotel.image_url}
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{hotel.name}</h2>
                  <p className="text-gray-600 mb-4">{hotel.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-600 font-semibold">
                      {hotel.price_per_night.toLocaleString('fr-FR')} FCFA / nuit
                    </span>
                    <button
                      onClick={() => setSelectedHotel(hotel)}
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

        {selectedHotel && (
          <BookingForm
            type="hotel"
            itemId={selectedHotel.id}
            price={selectedHotel.price_per_night}
            onSuccess={() => {
              setSelectedHotel(null);
              alert('Réservation effectuée avec succès !');
            }}
            onCancel={() => setSelectedHotel(null)}
          />
        )}
      </div>
    </div>
  );
}

export default Hotels;