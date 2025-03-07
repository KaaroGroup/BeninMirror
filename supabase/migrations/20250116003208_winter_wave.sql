-- Ajout de la politique d'insertion pour les statistiques des partenaires
CREATE POLICY "Partners can insert their own stats"
  ON partner_stats
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = partner_stats.partner_id
      AND partners.user_id = auth.uid()
    )
  );

-- Ajout de la politique de mise à jour pour les statistiques des partenaires
CREATE POLICY "Partners can update their own stats"
  ON partner_stats
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = partner_stats.partner_id
      AND partners.user_id = auth.uid()
    )
  );