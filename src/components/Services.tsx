import React from 'react';
import { Compass, Hotel, Utensils, Car } from 'lucide-react';

const services = [
  {
    icon: Compass,
    title: 'Sites Touristiques',
    description: 'Découvrez les sites historiques et culturels emblématiques du Bénin'
  },
  {
    icon: Hotel,
    title: 'Hébergements',
    description: 'Trouvez le meilleur hébergement pour votre séjour'
  },
  {
    icon: Utensils,
    title: 'Restaurants',
    description: 'Savourez la délicieuse cuisine béninoise'
  },
  {
    icon: Car,
    title: 'Transport',
    description: 'Réservez un chauffeur pour vos visites guidées'
  }
];

const Services = () => {
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Nos Services
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Tout ce dont vous avez besoin pour un séjour inoubliable au Bénin
          </p>
        </div>
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="pt-6 bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-md bg-emerald-600 flex items-center justify-center">
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">{service.title}</h3>
                <p className="mt-2 text-base text-gray-500">{service.description}</p>
              </div>
              <div className="px-6 pb-6">
                <button className="mt-4 w-full bg-emerald-50 text-emerald-700 px-4 py-2 rounded-md hover:bg-emerald-100 transition-colors">
                  En savoir plus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Services;