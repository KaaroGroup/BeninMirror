import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'Quelles sont les options de paiement acceptées ?',
    answer: 'Nous acceptons les paiements par mobile money. Pour votre sécurité, tous les paiements sont traités via des plateformes sécurisées.'
  },
  {
    question: 'Comment puis-je réserver un guide touristique ?',
    answer: 'Vous pouvez réserver un guide directement sur notre site dans la section "Guides". Choisissez votre guide en fonction de ses spécialités et des langues parlées, puis sélectionnez vos dates.'
  },
  {
    question: 'Quelle est votre politique d\'annulation ?',
    answer: 'Nous offrons un remboursement complet pour les annulations effectuées au moins 7 jours avant la date prévue. Pour les annulations plus tardives, des frais peuvent s\'appliquer.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Questions fréquentes
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Tout ce que vous devez savoir pour préparer votre voyage
          </p>
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 flex justify-between items-center bg-white hover:bg-gray-50 focus:outline-none"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 py-4 bg-gray-50">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;