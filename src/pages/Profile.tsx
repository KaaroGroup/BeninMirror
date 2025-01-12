import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Booking {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  tourist_site?: { name: string };
  hotel?: { name: string };
  restaurant?: { name: string };
  guide?: { name: string };
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          start_date,
          end_date,
          total_price,
          status,
          tourist_site:tourist_site_id(name),
          hotel:hotel_id(name),
          restaurant:restaurant_id(name),
          guide:guide_id(name)
        `)
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
      } else {
        setBookings(data || []);
      }
      setLoading(false);
    };

    fetchBookings();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  const getBookingTitle = (booking: Booking) => {
    if (booking.tourist_site) return booking.tourist_site.name;
    if (booking.hotel) return booking.hotel.name;
    if (booking.restaurant) return booking.restaurant.name;
    if (booking.guide) return booking.guide.name;
    return 'Réservation';
  };

  return (
    <div className="min-h-screen pt-16 px-4">
      <div className="max-w-4xl mx-auto py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Mon Profil</h1>
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              Se déconnecter
            </button>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Informations personnelles</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-600">Email: {user.email}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Mes Réservations</h2>
            {loading ? (
              <p>Chargement des réservations...</p>
            ) : bookings.length === 0 ? (
              <p className="text-gray-600">Aucune réservation pour le moment.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{getBookingTitle(booking)}</h3>
                        <p className="text-sm text-gray-600">
                          Du {new Date(booking.start_date).toLocaleDateString('fr-FR')}
                          {booking.end_date && booking.end_date !== booking.start_date && 
                            ` au ${new Date(booking.end_date).toLocaleDateString('fr-FR')}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-600 font-medium">
                          {booking.total_price.toLocaleString('fr-FR')} FCFA
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          Status: {booking.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;