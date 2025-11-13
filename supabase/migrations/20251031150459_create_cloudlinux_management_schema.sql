/*
  # CloudLinux Server Management Schema

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `username` (text, unique) - root user login
      - `password_hash` (text) - hashed password
      - `created_at` (timestamptz)
      - `last_login` (timestamptz)
    
    - `system_users`
      - `id` (uuid, primary key)
      - `username` (text, unique) - system username
      - `email` (text)
      - `php_version` (text) - selected PHP version
      - `nodejs_version` (text) - selected Node.js version
      - `database_type` (text) - mysql or postgresql
      - `database_version` (text) - database version
      - `status` (text) - active, suspended, etc.
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `available_versions`
      - `id` (uuid, primary key)
      - `software_type` (text) - php, nodejs, mysql, postgresql
      - `version` (text) - version number
      - `is_active` (boolean) - whether this version is available
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin users only
*/

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can read own data"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admin users can update own data"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS system_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text,
  php_version text DEFAULT '8.2',
  nodejs_version text DEFAULT '20.x',
  database_type text DEFAULT 'mysql',
  database_version text DEFAULT '8.0',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE system_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can view all system users"
  ON system_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can create system users"
  ON system_users FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin users can update system users"
  ON system_users FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin users can delete system users"
  ON system_users FOR DELETE
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS available_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  software_type text NOT NULL,
  version text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(software_type, version)
);

ALTER TABLE available_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can view available versions"
  ON available_versions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can manage versions"
  ON available_versions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO available_versions (software_type, version) VALUES
  ('php', '7.4'),
  ('php', '8.0'),
  ('php', '8.1'),
  ('php', '8.2'),
  ('php', '8.3'),
  ('nodejs', '16.x'),
  ('nodejs', '18.x'),
  ('nodejs', '20.x'),
  ('nodejs', '21.x'),
  ('mysql', '5.7'),
  ('mysql', '8.0'),
  ('mysql', '8.1'),
  ('postgresql', '13'),
  ('postgresql', '14'),
  ('postgresql', '15'),
  ('postgresql', '16')
ON CONFLICT (software_type, version) DO NOTHING;
