import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import BookingForm from '../components/BookingForm';
import { Search, Filter } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  location: string;
  cuisine_type: string;
  price_range: string;
  image_url: string;
}

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');

  useEffect(() => {
    const fetchRestaurants = async () => {
      let query = supabase
        .from('restaurants')
        .select('*')
        .order('name');

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      if (selectedCuisine !== 'all') {
        query = query.eq('cuisine_type', selectedCuisine);
      }

      if (selectedPriceRange !== 'all') {
        query = query.eq('price_range', selectedPriceRange);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching restaurants:', error);
      } else {
        setRestaurants(data || []);
      }
      setLoading(false);
    };

    fetchRestaurants();
  }, [searchTerm, selectedCuisine, selectedPriceRange]);

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
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Restaurants</h1>
          
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un restaurant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">Toutes les cuisines</option>
              <option value="Béninoise">Béninoise</option>
              <option value="Africaine">Africaine</option>
              <option value="Internationale">Internationale</option>
            </select>

            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="px-4 py-2 border rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">Tous les prix</option>
              <option value="€">€ - Économique</option>
              <option value="€€">€€ - Intermédiaire</option>
              <option value="€€€">€€€ - Haut de gamme</option>
            </select>
          </div>
        </div>

        {restaurants.length === 0 ? (
          <p className="text-center text-gray-600">Aucun restaurant ne correspond à vos critères.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={restaurant.image_url}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">{restaurant.name}</h2>
                    <span className="text-emerald-600">{restaurant.price_range}</span>
                  </div>
                  <p className="text-gray-600 mb-2">{restaurant.description}</p>
                  <p className="text-sm text-emerald-600 mb-4">
                    Cuisine: {restaurant.cuisine_type}
                  </p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setSelectedRestaurant(restaurant)}
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

        {selectedRestaurant && (
          <BookingForm
            type="restaurant"
            itemId={selectedRestaurant.id}
            price={5000} // Prix fixe pour la réservation
            onSuccess={() => {
              setSelectedRestaurant(null);
              alert('Réservation effectuée avec succès !');
            }}
            onCancel={() => setSelectedRestaurant(null)}
          />
        )}
      </div>
    </div>
  );
}

export default Restaurants;