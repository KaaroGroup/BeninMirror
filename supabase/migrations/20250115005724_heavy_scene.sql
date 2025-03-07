/*
  # Système de partenaires

  1. Nouvelles Tables
    - `partner_types` : Types de partenaires
    - `partners` : Informations des partenaires
    - `partner_stats` : Statistiques des partenaires

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Policies pour la gestion des accès
*/

-- Types de partenaires
CREATE TABLE partner_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE partner_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partner types are viewable by everyone"
  ON partner_types FOR SELECT
  TO public
  USING (true);

-- Partenaires
CREATE TABLE partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  type_id uuid REFERENCES partner_types NOT NULL,
  business_name text NOT NULL,
  contact_person text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  registration_number text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view their own data"
  ON partners FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Partners can update their own data"
  ON partners FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Statistiques des partenaires
CREATE TABLE partner_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES partners NOT NULL,
  total_bookings integer DEFAULT 0,
  total_revenue numeric DEFAULT 0,
  last_booking_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE partner_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view their own stats"
  ON partner_stats FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = partner_stats.partner_id
      AND partners.user_id = auth.uid()
    )
  );

-- Insertion des types de partenaires
INSERT INTO partner_types (name, description) VALUES
('cultural_site', 'Promoteur de site culturel'),
('accommodation', 'Promoteur de lieu d''hébergement'),
('restaurant', 'Promoteur de restaurant'),
('transport', 'Agence de transport ou chauffeur');