-- =====================================================
-- SCHÉMA COMPLET DE LA BASE DE DONNÉES
-- Plateforme Présidentielle Dr Serge Ghislain Djorie
-- =====================================================

-- Ce script crée toutes les tables nécessaires pour la plateforme
-- avec leurs relations, contraintes et politiques RLS

-- =====================================================
-- TABLE: users
-- Description: Gestion des utilisateurs administrateurs
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'moderator')),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour users
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update users"
  ON users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete users"
  ON users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- =====================================================
-- TABLE: posts
-- Description: Articles de blog et actualités
-- =====================================================

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_en text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT 'Campagne' CHECK (category IN ('Campagne', 'Programmes', 'Déclarations', 'Médiation', 'Paix 2020', 'Autre')),
  content text NOT NULL,
  content_en text NOT NULL,
  excerpt text NOT NULL,
  excerpt_en text NOT NULL,
  image_url text,
  published boolean DEFAULT false,
  published_at timestamptz,
  author_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

-- Activer RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour posts
CREATE POLICY "Anyone can view published posts"
  ON posts FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can view all posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete posts"
  ON posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- =====================================================
-- TABLE: videos
-- Description: Vidéos et discours
-- =====================================================

CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_en text NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text,
  description text NOT NULL,
  description_en text NOT NULL,
  location text,
  tags text[] DEFAULT ARRAY[]::text[],
  duration integer DEFAULT 0,
  published boolean DEFAULT false,
  event_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_videos_published ON videos(published);
CREATE INDEX IF NOT EXISTS idx_videos_event_date ON videos(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_videos_tags ON videos USING gin(tags);

-- Activer RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour videos
CREATE POLICY "Anyone can view published videos"
  ON videos FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can view all videos"
  ON videos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete videos"
  ON videos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- =====================================================
-- TABLE: program_sections
-- Description: Sections du programme électoral
-- =====================================================

CREATE TABLE IF NOT EXISTS program_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_en text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  content_en text NOT NULL,
  icon text DEFAULT 'shield',
  priority integer DEFAULT 0,
  color text DEFAULT 'blue',
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_program_sections_priority ON program_sections(priority);
CREATE INDEX IF NOT EXISTS idx_program_sections_published ON program_sections(published);

-- Activer RLS
ALTER TABLE program_sections ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour program_sections
CREATE POLICY "Anyone can view published program sections"
  ON program_sections FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can view all program sections"
  ON program_sections FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert program sections"
  ON program_sections FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update program sections"
  ON program_sections FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete program sections"
  ON program_sections FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- =====================================================
-- TABLE: messages
-- Description: Messages des citoyens (espace citoyen)
-- =====================================================

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message_type text NOT NULL CHECK (message_type IN ('support', 'grievance', 'idea', 'question')),
  subject text NOT NULL,
  content text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  response text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(message_type);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_public ON messages(is_public);

-- Activer RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour messages
CREATE POLICY "Anyone can view public approved messages"
  ON messages FOR SELECT
  USING (is_public = true AND status = 'approved');

CREATE POLICY "Anyone can insert messages"
  ON messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all messages"
  ON messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete messages"
  ON messages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- =====================================================
-- TABLE: donations
-- Description: Gestion des dons
-- =====================================================

CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name text NOT NULL,
  email text NOT NULL,
  phone text,
  amount numeric NOT NULL CHECK (amount > 0),
  currency text DEFAULT 'XAF',
  payment_method text NOT NULL CHECK (payment_method IN ('card', 'mobile_money', 'bank_transfer')),
  payment_provider text CHECK (payment_provider IN ('stripe', 'orange_money', 'moov_money', 'bank')),
  transaction_id text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  receipt_url text,
  is_anonymous boolean DEFAULT false,
  message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_email ON donations(email);

-- Activer RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour donations
CREATE POLICY "Anyone can insert donations"
  ON donations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all donations"
  ON donations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update donations"
  ON donations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- TABLE: newsletter_subscriptions
-- Description: Abonnements à la newsletter
-- =====================================================

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  confirmed boolean DEFAULT false,
  confirmation_token text UNIQUE,
  language text DEFAULT 'fr' CHECK (language IN ('fr', 'en')),
  subscribed_at timestamptz DEFAULT now(),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_confirmed ON newsletter_subscriptions(confirmed);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed_at ON newsletter_subscriptions(subscribed_at DESC);

-- Activer RLS
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour newsletter_subscriptions
CREATE POLICY "Anyone can insert newsletter subscriptions"
  ON newsletter_subscriptions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update their own subscription"
  ON newsletter_subscriptions FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all subscriptions"
  ON newsletter_subscriptions FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- FONCTIONS UTILES
-- =====================================================

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_program_sections_updated_at BEFORE UPDATE ON program_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VUES UTILES
-- =====================================================

-- Vue pour les statistiques de donations
CREATE OR REPLACE VIEW donation_stats AS
SELECT
  COUNT(*) as total_donations,
  SUM(amount) FILTER (WHERE status = 'completed') as total_amount,
  AVG(amount) FILTER (WHERE status = 'completed') as average_amount,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_donations,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_donations
FROM donations;

-- Vue pour les statistiques de messages
CREATE OR REPLACE VIEW message_stats AS
SELECT
  COUNT(*) as total_messages,
  COUNT(*) FILTER (WHERE message_type = 'support') as support_messages,
  COUNT(*) FILTER (WHERE message_type = 'grievance') as grievance_messages,
  COUNT(*) FILTER (WHERE message_type = 'idea') as idea_messages,
  COUNT(*) FILTER (WHERE message_type = 'question') as question_messages,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_messages,
  COUNT(*) FILTER (WHERE status = 'approved') as approved_messages
FROM messages;

-- =====================================================
-- FIN DU SCHÉMA
-- =====================================================
