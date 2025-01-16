import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MapPin, DollarSign, FileText, Image as ImageIcon } from 'lucide-react';

interface ServiceFormProps {
  partnerType: string;
  partnerId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const PartnerServiceForm = ({ partnerType, partnerId, onSuccess, onCancel }: ServiceFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    price: '',
    imageUrl: '',
    cuisineType: '', // Pour les restaurants
    priceRange: '', // Pour les restaurants
    languages: [], // Pour les guides
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let tableName = '';
    let data = {};

    switch (partnerType) {
      case 'cultural_site':
        tableName = 'tourist_sites';
        data = {
          name: formData.name,
          description: formData.description,
          location: formData.location,
          price: parseFloat(formData.price),
          image_url: formData.imageUrl,
          partner_id: partnerId
        };
        break;

      case 'accommodation':
        tableName = 'hotels';
        data = {
          name: formData.name,
          description: formData.description,
          location: formData.location,
          price_per_night: parseFloat(formData.price),
          image_url: formData.imageUrl,
          partner_id: partnerId
        };
        break;

      case 'restaurant':
        tableName = 'restaurants';
        data = {
          name: formData.name,
          description: formData.description,
          location: formData.location,
          cuisine_type: formData.cuisineType,
          price_range: formData.priceRange,
          image_url: formData.imageUrl,
          partner_id: partnerId
        };
        break;

      case 'transport':
        tableName = 'guides';
        data = {
          name: formData.name,
          description: formData.description,
          languages: formData.languages,
          price_per_day: parseFloat(formData.price),
          image_url: formData.imageUrl,
          partner_id: partnerId
        };
        break;
    }

    const { error } = await supabase
      .from(tableName)
      .insert([data]);

    if (error) {
      console.error('Error adding service:', error);
      alert('Une erreur est survenue lors de l\'ajout du service');
    } else {
      onSuccess();
    }

    setLoading(false);
  };

  const renderSpecificFields = () => {
    switch (partnerType) {
      case 'restaurant':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type de cuisine
              </label>
              <select
                value={formData.cuisineType}
                onChange={(e) => setFormData(prev => ({ ...prev, cuisineType: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                required
              >
                <option value="">Sélectionnez un type</option>
                <option value="Béninoise">Béninoise</option>
                <option value="Africaine">Africaine</option>
                <option value="Internationale">Internationale</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gamme de prix
              </label>
              <select
                value={formData.priceRange}
                onChange={(e) => setFormData(prev => ({ ...prev, priceRange: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                required
              >
                <option value="">Sélectionnez une gamme</option>
                <option value="€">€ - Économique</option>
                <option value="€€">€€ - Intermédiaire</option>
                <option value="€€€">€€€ - Haut de gamme</option>
              </select>
            </div>
          </>
        );

      case 'transport':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Langues parlées
            </label>
            <div className="mt-2 space-y-2">
              {['Français', 'Anglais', 'Fon', 'Yoruba'].map((lang) => (
                <label key={lang} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    checked={formData.languages.includes(lang)}
                    onChange={(e) => {
                      const newLanguages = e.target.checked
                        ? [...formData.languages, lang]
                        : formData.languages.filter(l => l !== lang);
                      setFormData(prev => ({ ...prev, languages: newLanguages }));
                    }}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2">{lang}</span>
                </label>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getPriceLabel = () => {
    switch (partnerType) {
      case 'cultural_site':
        return 'Prix d\'entrée (FCFA)';
      case 'accommodation':
        return 'Prix par nuit (FCFA)';
      case 'transport':
        return 'Prix par jour (FCFA)';
      default:
        return 'Prix (FCFA)';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Ajouter un nouveau service</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              required
            />
          </div>

          {partnerType !== 'transport' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Localisation
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>
          )}

          {partnerType !== 'restaurant' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {getPriceLabel()}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>
          )}

          {renderSpecificFields()}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              URL de l'image
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <ImageIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Ajout en cours...' : 'Ajouter le service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnerServiceForm;