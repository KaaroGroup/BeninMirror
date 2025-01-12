import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import BookingForm from '../components/BookingForm';

interface TouristSite {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  image_url: string;
}

const TouristSites = () => {
  const [sites, setSites] = useState<TouristSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState<TouristSite | null>(null);

  useEffect(() => {
    const fetchSites = async () => {
      const { data, error } = await supabase
        .from('tourist_sites')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching sites:', error);
      } else {
        setSites(data || []);
      }
      setLoading(false);
    };

    fetchSites();
  }, []);

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sites Touristiques</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sites.map((site) => (
            <div key={site.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={site.image_url}
                alt={site.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{site.name}</h2>
                <p className="text-gray-600 mb-4">{site.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-600 font-semibold">
                    {site.price.toLocaleString('fr-FR')} FCFA
                  </span>
                  <button
                    onClick={() => setSelectedSite(site)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
                  >
                    Réserver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedSite && (
          <BookingForm
            type="tourist_site"
            itemId={selectedSite.id}
            price={selectedSite.price}
            onSuccess={() => {
              setSelectedSite(null);
              alert('Réservation effectuée avec succès !');
            }}
            onCancel={() => setSelectedSite(null)}
          />
        )}
      </div>
    </div>
  );
}

export default TouristSites;