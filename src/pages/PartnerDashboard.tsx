import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { BarChart, Users, Calendar, DollarSign, Plus, Pencil, Trash2 } from 'lucide-react';
import PartnerServiceForm from './PartnerServiceForm';

interface PartnerData {
  id: string;
  business_name: string;
  type: {
    name: string;
    description: string;
  };
}

interface Stats {
  total_bookings: number;
  total_revenue: number;
  last_booking_date: string | null;
}

interface Service {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price?: number;
  price_per_night?: number;
  price_per_day?: number;
  location?: string;
  cuisine_type?: string;
  price_range?: string;
  languages?: string[];
}

const PartnerDashboard = () => {
  const { user } = useAuth();
  const [partnerData, setPartnerData] = useState<PartnerData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showServiceForm, setShowServiceForm] = useState(false);

  useEffect(() => {
    const fetchPartnerData = async () => {
      if (!user) return;

      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select(`
          id,
          business_name,
          type:partner_types(name, description)
        `)
        .eq('user_id', user.id)
        .single();

      if (partnerError) {
        console.error('Error fetching partner data:', partnerError);
        return;
      }

      if (partnerData) {
        setPartnerData(partnerData);

        // Fetch stats
        const { data: statsData, error: statsError } = await supabase
          .from('partner_stats')
          .select('*')
          .eq('partner_id', partnerData.id)
          .single();

        if (statsError) {
          console.error('Error fetching stats:', statsError);
        } else {
          setStats(statsData);
        }

        // Fetch services based on partner type
        let tableName = '';
        switch (partnerData.type.name) {
          case 'cultural_site':
            tableName = 'tourist_sites';
            break;
          case 'accommodation':
            tableName = 'hotels';
            break;
          case 'restaurant':
            tableName = 'restaurants';
            break;
          case 'transport':
            tableName = 'guides';
            break;
        }

        if (tableName) {
          const { data: servicesData, error: servicesError } = await supabase
            .from(tableName)
            .select('*')
            .eq('partner_id', partnerData.id);

          if (servicesError) {
            console.error('Error fetching services:', servicesError);
          } else {
            setServices(servicesData || []);
          }
        }
      }

      setLoading(false);
    };

    fetchPartnerData();
  }, [user]);

  const handleDeleteService = async (serviceId: string) => {
    if (!partnerData) return;

    const tableName = getTableName(partnerData.type.name);
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', serviceId);

    if (error) {
      console.error('Error deleting service:', error);
      alert('Une erreur est survenue lors de la suppression');
    } else {
      setServices(services.filter(s => s.id !== serviceId));
    }
  };

  const getTableName = (partnerType: string) => {
    switch (partnerType) {
      case 'cultural_site':
        return 'tourist_sites';
      case 'accommodation':
        return 'hotels';
      case 'restaurant':
        return 'restaurants';
      case 'transport':
        return 'guides';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 px-4">
        <div className="max-w-7xl mx-auto py-12">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!partnerData) {
    return (
      <div className="min-h-screen pt-16 px-4">
        <div className="max-w-7xl mx-auto py-12">
          <p>Vous n'êtes pas encore inscrit en tant que partenaire.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Tableau de bord - {partnerData.business_name}
          </h1>
          <p className="mt-2 text-gray-600">
            {partnerData.type.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-emerald-100">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Réservations totales</p>
                <p className="text-lg font-semibold text-gray-900">{stats?.total_bookings || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-emerald-100">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Revenu total</p>
                <p className="text-lg font-semibold text-gray-900">
                  {(stats?.total_revenue || 0).toLocaleString('fr-FR')} FCFA
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-emerald-100">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Dernière réservation</p>
                <p className="text-lg font-semibold text-gray-900">
                  {stats?.last_booking_date 
                    ? new Date(stats.last_booking_date).toLocaleDateString('fr-FR')
                    : 'Aucune'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-emerald-100">
                <BarChart className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Taux de conversion</p>
                <p className="text-lg font-semibold text-gray-900">--</p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des services */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Mes services</h2>
            <button
              onClick={() => setShowServiceForm(true)}
              className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ajouter un service
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="border rounded-lg overflow-hidden">
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-emerald-600 font-medium">
                      {service.price_per_night && `${service.price_per_night.toLocaleString('fr-FR')} FCFA/nuit`}
                      {service.price_per_day && `${service.price_per_day.toLocaleString('fr-FR')} FCFA/jour`}
                      {service.price && `${service.price.toLocaleString('fr-FR')} FCFA`}
                      {service.price_range && service.price_range}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showServiceForm && (
          <PartnerServiceForm
            partnerType={partnerData.type.name}
            partnerId={partnerData.id}
            onSuccess={() => {
              setShowServiceForm(false);
              // Recharger les services
              window.location.reload();
            }}
            onCancel={() => setShowServiceForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PartnerDashboard;