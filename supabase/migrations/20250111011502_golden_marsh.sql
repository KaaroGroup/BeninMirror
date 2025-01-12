/*
  # Initial Schema for Bénin Mirror

  1. New Tables
    - `tourist_sites`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `location` (text)
      - `price` (numeric)
      - `image_url` (text)
      - `created_at` (timestamp)

    - `hotels`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `location` (text)
      - `price_per_night` (numeric)
      - `image_url` (text)
      - `created_at` (timestamp)

    - `restaurants`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `location` (text)
      - `cuisine_type` (text)
      - `price_range` (text)
      - `image_url` (text)
      - `created_at` (timestamp)

    - `guides`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `languages` (text[])
      - `price_per_day` (numeric)
      - `image_url` (text)
      - `created_at` (timestamp)

    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `tourist_site_id` (uuid, references tourist_sites)
      - `hotel_id` (uuid, references hotels)
      - `restaurant_id` (uuid, references restaurants)
      - `guide_id` (uuid, references guides)
      - `start_date` (date)
      - `end_date` (date)
      - `total_price` (numeric)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Tourist Sites
CREATE TABLE tourist_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  price numeric NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tourist_sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tourist sites are viewable by everyone"
  ON tourist_sites
  FOR SELECT
  TO public
  USING (true);

-- Hotels
CREATE TABLE hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  price_per_night numeric NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hotels are viewable by everyone"
  ON hotels
  FOR SELECT
  TO public
  USING (true);

-- Restaurants
CREATE TABLE restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  cuisine_type text NOT NULL,
  price_range text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Restaurants are viewable by everyone"
  ON restaurants
  FOR SELECT
  TO public
  USING (true);

-- Guides
CREATE TABLE guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  languages text[] NOT NULL,
  price_per_day numeric NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guides are viewable by everyone"
  ON guides
  FOR SELECT
  TO public
  USING (true);

-- Bookings
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  tourist_site_id uuid REFERENCES tourist_sites,
  hotel_id uuid REFERENCES hotels,
  restaurant_id uuid REFERENCES restaurants,
  guide_id uuid REFERENCES guides,
  start_date date NOT NULL,
  end_date date NOT NULL,
  total_price numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT "At least one service must be booked" CHECK (
    tourist_site_id IS NOT NULL OR
    hotel_id IS NOT NULL OR
    restaurant_id IS NOT NULL OR
    guide_id IS NOT NULL
  )
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);