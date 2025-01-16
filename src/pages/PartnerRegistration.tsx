import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Building2, Phone, Mail, MapPin, Briefcase } from 'lucide-react';

interface PartnerType {
  id: string;
  name: string;
  description: string;
}

const PartnerRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [partnerTypes, setPartnerTypes] = useState<PartnerType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    typeId: '',
    businessName: '',
    contactPerson: '',
    phone: '',
    address: '',
    registrationNumber: ''
  });

  useEffect(() => {
    const fetchPartnerTypes = async () => {
      const { data, error } = await supabase
        .from('partner_types')
        .select('*');
      
      if (error) {
        console.error('Error fetching partner types:', error);
        setError('Erreur lors du chargement des types de partenaires');
      } else {
        setPartnerTypes(data || []);
      }
    };

    fetchPartnerTypes();
  }, []);

  const validateForm = () => {
    if (!formData.typeId) {
      setError('Veuillez sélectionner un type de partenaire');
      return false;
    }
    if (!formData.businessName.trim()) {
      setError('Le nom de l\'entreprise est requis');
      return false;
    }
    if (!formData.contactPerson.trim()) {
      setError('Le nom de la personne de contact est requis');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Le numéro de téléphone est requis');
      return false;
    }
    if (!formData.address.trim()) {
      setError('L\'adresse est requise');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError(null);
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Vérifier si l'utilisateur est déjà partenaire
      const { data: existingPartner } = await supabase
        .from('partners')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingPartner) {
        setError('Vous êtes déjà inscrit en tant que partenaire');
        setLoading(false);
        return;
      }

      // Créer le nouveau partenaire
      const { error: insertError } = await supabase
        .from('partners')
        .insert([{
          user_id: user.id,
          type_id: formData.typeId,
          business_name: formData.businessName,
          contact_person: formData.contactPerson,
          phone: formData.phone,
          address: formData.address,
          registration_number: formData.registrationNumber || null
        }]);

      if (insertError) {
        console.error('Error details:', insertError);
        if (insertError.code === '23505') {
          setError('Cette entreprise est déjà enregistrée');
        } else {
          setError(`Erreur lors de l'inscription: ${insertError.message}`);
        }
      } else {
        // Créer les statistiques initiales du partenaire
        const { data: newPartner } = await supabase
          .from('partners')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (newPartner) {
          await supabase
            .from('partner_stats')
            .insert([{
              partner_id: newPartner.id,
              total_bookings: 0,
              total_revenue: 0
            }]);
        }

        navigate('/partner/dashboard');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Une erreur inattendue est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto py-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-6">Devenir Partenaire</h2>
            <p className="text-center text-gray-600 mb-8">
              Pour devenir partenaire, vous devez d'abord créer un compte ou vous connecter.
            </p>
            <div className="space-y-4">
              <Link
                to="/auth"
                className="block w-full bg-emerald-600 text-white text-center py-2 px-4 rounded-md hover:bg-emerald-700"
              >
                Se connecter
              </Link>
              <div className="text-center">
                <span className="text-gray-600">Pas encore de compte ?</span>
                <Link
                  to="/auth"
                  className="ml-2 text-emerald-600 hover:text-emerald-700"
                >
                  S'inscrire
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-8">
            Inscription Partenaire
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type de partenaire
              </label>
              <select
                value={formData.typeId}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, typeId: e.target.value }));
                  setError(null);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                required
              >
                <option value="">Sélectionnez un type</option>
                {partnerTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom de l'entreprise
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, businessName: e.target.value }));
                    setError(null);
                  }}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Personne de contact
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, contactPerson: e.target.value }));
                    setError(null);
                  }}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, phone: e.target.value }));
                    setError(null);
                  }}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Adresse
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, address: e.target.value }));
                    setError(null);
                  }}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Numéro d'enregistrement (optionnel)
              </label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, registrationNumber: e.target.value }));
                  setError(null);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Inscription en cours...' : 'S\'inscrire en tant que partenaire'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PartnerRegistration;