/*
  # Ajout des données initiales

  1. Contenu ajouté
    - Sites touristiques populaires du Bénin
    - Hôtels de différentes gammes
    - Restaurants variés
    - Guides touristiques professionnels

  2. Structure
    - Données représentatives pour chaque catégorie
    - Prix réalistes
    - Descriptions détaillées
*/

-- Sites touristiques
INSERT INTO tourist_sites (name, description, location, price, image_url) VALUES
('Porte du Non-Retour', 'Monument historique marquant le dernier point de départ des esclaves. Un lieu de mémoire et de recueillement essentiel pour comprendre l''histoire du Bénin.', 'Ouidah', 2000, 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Door_of_no_return_ouidah_benin.jpg/1200px-Door_of_no_return_ouidah_benin.jpg'),
('Palais Royal d''Abomey', 'Classé au patrimoine mondial de l''UNESCO, ce complexe de palais raconte l''histoire du royaume du Dahomey à travers son architecture et ses bas-reliefs.', 'Abomey', 5000, 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Royal_Palaces_of_Abomey-108852.jpg'),
('Cité Lacustre de Ganvié', 'Surnommée la "Venise de l''Afrique", Ganvié est un village construit sur pilotis où la vie s''organise entièrement sur l''eau.', 'Ganvié', 10000, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/0b/ce/5c/20160924-125431-largejpg.jpg?w=1200&h=-1&s=1'),
('Parc National de la Pendjari', 'L''un des derniers refuges de la faune sauvage d''Afrique de l''Ouest, abritant lions, éléphants, antilopes et de nombreuses espèces d''oiseaux.', 'Tanguiéta', 15000, 'https://www.africanparks.org/sites/default/files/styles/ratio_2_1_xl/public/2022-05/W-Benin_Banner.jpg?h=a402f45b&itok=8-8VGYxP');

-- Hôtels
INSERT INTO hotels (name, description, location, price_per_night, image_url) VALUES
('Golden Tulip Le Diplomate', 'Hôtel 5 étoiles offrant un confort moderne avec piscine, spa et restaurants gastronomiques.', 'Cotonou', 120000, 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/484561650.jpg?k=f7d8e606b2c7b0c4933c7c6b9b1f7d8f7d8e606b2c7b0c4933c7c6b9b1f7d8f&o=&hp=1'),
('Azalai Hotel', 'Établissement de luxe alliant confort occidental et charme africain, idéalement situé au cœur de la ville.', 'Cotonou', 85000, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/4c/4f/e2/azalai-hotel-cotonou.jpg?w=1200&h=-1&s=1'),
('Bénin Royal Hôtel', 'Hôtel de charme offrant une vue imprenable sur la ville avec un service personnalisé.', 'Porto-Novo', 45000, 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/484561650.jpg?k=f7d8e606b2c7b0c4933c7c6b9b1f7d8f7d8e606b2c7b0c4933c7c6b9b1f7d8f&o=&hp=1'),
('Casa del Papa', 'Resort en bord de mer proposant des bungalows traditionnels et une plage privée.', 'Ouidah', 65000, 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/484561650.jpg?k=f7d8e606b2c7b0c4933c7c6b9b1f7d8f7d8e606b2c7b0c4933c7c6b9b1f7d8f&o=&hp=1');

-- Restaurants
INSERT INTO restaurants (name, description, location, cuisine_type, price_range, image_url) VALUES
('Chez Clarisse', 'Restaurant traditionnel servant les meilleurs plats béninois dans une ambiance authentique.', 'Cotonou', 'Béninoise', '€', 'https://media-cdn.tripadvisor.com/media/photo-s/06/50/99/70/chez-clarisse.jpg'),
('Le Petit Paris', 'Fine cuisine française avec une touche africaine, dans un cadre élégant.', 'Cotonou', 'Internationale', '€€€', 'https://media-cdn.tripadvisor.com/media/photo-s/06/50/99/70/le-petit-paris.jpg'),
('Maquis du Port', 'Restaurant de fruits de mer proposant des poissons frais du jour dans un cadre décontracté.', 'Cotonou', 'Africaine', '€€', 'https://media-cdn.tripadvisor.com/media/photo-s/06/50/99/70/maquis-du-port.jpg'),
('La Terrasse', 'Restaurant panoramique offrant une vue sur la ville et une cuisine fusion afro-européenne.', 'Porto-Novo', 'Internationale', '€€', 'https://media-cdn.tripadvisor.com/media/photo-s/06/50/99/70/la-terrasse.jpg');

-- Guides
INSERT INTO guides (name, description, languages, price_per_day, image_url) VALUES
('Koffi Mensah', 'Guide expérimenté spécialisé dans l''histoire du royaume du Dahomey et des traditions vaudou.', ARRAY['Français', 'Anglais', 'Fon'], 35000, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80'),
('Marie Hounsou', 'Guide nature passionnée par la faune et la flore, experte du Parc de la Pendjari.', ARRAY['Français', 'Anglais', 'Yoruba'], 30000, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80'),
('Pascal Ahouansou', 'Spécialiste des sites historiques de la route des esclaves et de la culture vaudou.', ARRAY['Français', 'Fon'], 25000, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80'),
('Aminata Soro', 'Guide culturelle experte en artisanat traditionnel et marchés locaux.', ARRAY['Français', 'Anglais', 'Yoruba', 'Fon'], 28000, 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80');