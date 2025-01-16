-- Ajout de la politique d'insertion pour les partenaires
CREATE POLICY "Partners can insert their own data"
  ON partners
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);