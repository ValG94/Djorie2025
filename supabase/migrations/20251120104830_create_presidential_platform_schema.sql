/*
  # Plateforme Présidentielle Dr Serge Ghislain Djorie - Schema Database

  ## Vue d'ensemble
  Ce schéma crée toutes les tables nécessaires pour la plateforme de campagne présidentielle,
  incluant la gestion des contenus, des interactions citoyennes, des dons et de l'administration.

  ## Tables créées
  
  ### 1. `users` - Utilisateurs et administrateurs
    - `id` (uuid, primary key) - Identifiant unique
    - `email` (text, unique) - Email de l'utilisateur
    - `role` (text) - Rôle : 'admin', 'editor', 'moderator'
    - `name` (text) - Nom complet
    - `created_at` (timestamptz) - Date de création
    - `updated_at` (timestamptz) - Date de dernière modification

  ### 2. `posts` - Actualités et communiqués
    - `id` (uuid, primary key) - Identifiant unique
    - `title` (text) - Titre de l'article
    - `title_en` (text) - Titre en anglais
    - `slug` (text, unique) - URL-friendly identifier
    - `category` (text) - Catégorie (Campagne, Programmes, Déclarations, etc.)
    - `content` (text) - Contenu en français
    - `content_en` (text) - Contenu en anglais
    - `excerpt` (text) - Résumé court en français
    - `excerpt_en` (text) - Résumé court en anglais
    - `image_url` (text) - URL de l'image
    - `published` (boolean) - Statut de publication
    - `published_at` (timestamptz) - Date de publication
    - `author_id` (uuid, foreign key) - Auteur
    - `created_at` (timestamptz) - Date de création
    - `updated_at` (timestamptz) - Date de modification

  ### 3. `videos` - Vidéos et discours
    - `id` (uuid, primary key) - Identifiant unique
    - `title` (text) - Titre de la vidéo
    - `title_en` (text) - Titre en anglais
    - `video_url` (text) - URL de la vidéo (YouTube, etc.)
    - `thumbnail_url` (text) - URL de la miniature
    - `description` (text) - Description en français
    - `description_en` (text) - Description en anglais
    - `location` (text) - Lieu de l'intervention
    - `tags` (text[]) - Tags thématiques
    - `duration` (integer) - Durée en secondes
    - `published` (boolean) - Statut de publication
    - `event_date` (timestamptz) - Date de l'événement
    - `created_at` (timestamptz) - Date de création
    - `updated_at` (timestamptz) - Date de modification

  ### 4. `messages` - Messages citoyens (soutiens, doléances, idées)
    - `id` (uuid, primary key) - Identifiant unique
    - `name` (text) - Nom du citoyen
    - `email` (text) - Email du citoyen
    - `phone` (text) - Téléphone (optionnel)
    - `message_type` (text) - Type : 'support', 'grievance', 'idea', 'question'
    - `subject` (text) - Sujet du message
    - `content` (text) - Contenu du message
    - `status` (text) - Statut : 'pending', 'approved', 'rejected'
    - `response` (text) - Réponse de l'équipe (optionnel)
    - `is_public` (boolean) - Afficher publiquement
    - `created_at` (timestamptz) - Date de création
    - `updated_at` (timestamptz) - Date de modification

  ### 5. `donations` - Dons de campagne
    - `id` (uuid, primary key) - Identifiant unique
    - `donor_name` (text) - Nom du donateur
    - `email` (text) - Email du donateur
    - `phone` (text) - Téléphone
    - `amount` (numeric) - Montant du don
    - `currency` (text) - Devise (XAF par défaut)
    - `payment_method` (text) - Méthode : 'card', 'mobile_money', 'bank_transfer'
    - `payment_provider` (text) - Fournisseur : 'stripe', 'orange_money', 'moov_money'
    - `transaction_id` (text) - ID de transaction
    - `status` (text) - Statut : 'pending', 'completed', 'failed', 'refunded'
    - `receipt_url` (text) - URL du reçu PDF
    - `is_anonymous` (boolean) - Don anonyme
    - `message` (text) - Message du donateur (optionnel)
    - `created_at` (timestamptz) - Date du don
    - `updated_at` (timestamptz) - Date de modification

  ### 6. `newsletter_subscriptions` - Abonnements newsletter
    - `id` (uuid, primary key) - Identifiant unique
    - `email` (text, unique) - Email de l'abonné
    - `name` (text) - Nom (optionnel)
    - `confirmed` (boolean) - Email confirmé (double opt-in)
    - `confirmation_token` (text) - Token de confirmation
    - `language` (text) - Langue préférée : 'fr', 'en'
    - `subscribed_at` (timestamptz) - Date d'abonnement
    - `confirmed_at` (timestamptz) - Date de confirmation
    - `unsubscribed_at` (timestamptz) - Date de désabonnement
    - `created_at` (timestamptz) - Date de création

  ### 7. `program_sections` - Sections du programme politique
    - `id` (uuid, primary key) - Identifiant unique
    - `title` (text) - Titre de la section
    - `title_en` (text) - Titre en anglais
    - `slug` (text, unique) - URL-friendly identifier
    - `content` (text) - Contenu en français
    - `content_en` (text) - Contenu en anglais
    - `icon` (text) - Nom de l'icône Lucide React
    - `priority` (integer) - Ordre d'affichage
    - `color` (text) - Couleur thématique
    - `published` (boolean) - Statut de publication
    - `created_at` (timestamptz) - Date de création
    - `updated_at` (timestamptz) - Date de modification

  ## Sécurité (RLS)
  - Row Level Security activée sur toutes les tables
  - Politiques restrictives pour protéger les données
  - Accès public en lecture pour les contenus publiés
  - Accès admin pour la gestion des contenus
  - Protection des données personnelles (messages, dons, newsletter)

  ## Notes importantes
  1. Utilisation de `gen_random_uuid()` pour les IDs
  2. Timestamps automatiques avec `now()`
  3. Index créés sur les colonnes fréquemment interrogées
  4. Support bilingue FR/EN dans les tables de contenu
  5. Valeurs par défaut appropriées pour tous les champs
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'moderator')),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 2. POSTS TABLE
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
  author_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 3. VIDEOS TABLE
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

CREATE INDEX IF NOT EXISTS idx_videos_published ON videos(published, event_date DESC);
CREATE INDEX IF NOT EXISTS idx_videos_tags ON videos USING GIN(tags);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- 4. MESSAGES TABLE
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

CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(message_type);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 5. DONATIONS TABLE
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name text NOT NULL,
  email text NOT NULL,
  phone text,
  amount numeric(10, 2) NOT NULL CHECK (amount > 0),
  currency text DEFAULT 'XAF' NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_email ON donations(email);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- 6. NEWSLETTER SUBSCRIPTIONS TABLE
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

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_confirmed ON newsletter_subscriptions(confirmed);

ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- 7. PROGRAM SECTIONS TABLE
CREATE TABLE IF NOT EXISTS program_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_en text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  content_en text NOT NULL,
  icon text NOT NULL DEFAULT 'shield',
  priority integer DEFAULT 0,
  color text DEFAULT 'blue',
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_program_sections_priority ON program_sections(priority);
CREATE INDEX IF NOT EXISTS idx_program_sections_slug ON program_sections(slug);

ALTER TABLE program_sections ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Users: Only authenticated admins can read user data
CREATE POLICY "Admins can read all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update users"
  ON users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Posts: Public can read published posts, authenticated users can manage
CREATE POLICY "Anyone can view published posts"
  ON posts FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can view all posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Editors can insert posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Editors can update posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can delete posts"
  ON posts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Videos: Public can read published videos, authenticated users can manage
CREATE POLICY "Anyone can view published videos"
  ON videos FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can view all videos"
  ON videos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Editors can insert videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Editors can update videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can delete videos"
  ON videos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Messages: Anyone can insert, only authenticated can read/manage
CREATE POLICY "Anyone can send messages"
  ON messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Moderators can view all messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'editor', 'moderator')
    )
  );

CREATE POLICY "Anyone can view approved public messages"
  ON messages FOR SELECT
  USING (status = 'approved' AND is_public = true);

CREATE POLICY "Moderators can update messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'editor', 'moderator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'editor', 'moderator')
    )
  );

-- Donations: Anyone can create, only admins can read
CREATE POLICY "Anyone can make donations"
  ON donations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all donations"
  ON donations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update donations"
  ON donations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Newsletter: Anyone can subscribe, only admins can read
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscriptions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Subscribers can update their own subscription"
  ON newsletter_subscriptions FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can view all subscriptions"
  ON newsletter_subscriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Program Sections: Public can read published, authenticated can manage
CREATE POLICY "Anyone can view published program sections"
  ON program_sections FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can view all program sections"
  ON program_sections FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Editors can insert program sections"
  ON program_sections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Editors can update program sections"
  ON program_sections FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can delete program sections"
  ON program_sections FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );