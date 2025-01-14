import React from 'react';

const Hero = () => {
  return (
    <div className="relative pt-16">
      <div className="absolute inset-0">
        <img
          className="w-full h-[600px] object-cover"
src="https://journals.openedition.org/com/docannexe/image/10733/img-9-small580.png"
          alt="Paysage du Bénin"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Découvrez la magie du Bénin
        </h1>
        <p className="mt-6 text-xl text-white max-w-3xl">
          Explorez les merveilles culturelles, historiques et naturelles du Bénin. 
          Réservez vos visites guidées, hôtels et restaurants en quelques clics.
        </p>
        <div className="mt-10">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Destination</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
                  <option>Choisir une destination</option>
                  <option>Ouidah</option>
                  <option>Ganvié</option>
                  <option>Abomey</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="flex items-end">
                <button className="w-full bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700">
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;