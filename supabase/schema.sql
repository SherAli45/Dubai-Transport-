-- ====================================================================
-- DUBAI TRANSPORT & LOGISTICS SERVICES
-- Supabase PostgreSQL Database Schema
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Services Table
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  long_description TEXT,
  icon TEXT NOT NULL,
  image_url TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Vehicles / Fleet Table
CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  vehicle_name TEXT NOT NULL,
  vehicle_type TEXT NOT NULL, -- 'truck', 'van', 'pickup', 'box_truck', 'flatbed', 'car', 'other'
  short_description TEXT NOT NULL,
  capacity TEXT NOT NULL,
  suitable_for TEXT NOT NULL,
  image_url TEXT NOT NULL,
  availability_status TEXT DEFAULT 'available', -- 'available', 'busy', 'maintenance'
  dimensions TEXT,
  payload_capacity TEXT,
  active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Service Areas Table (Dubai Districts)
CREATE TABLE IF NOT EXISTS service_areas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  district TEXT NOT NULL, -- 'Central Dubai', 'Old Dubai & Deira', 'Industrial & Logistics', 'New Dubai & Marina', 'Suburban'
  popular BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Quote Requests Table
CREATE TABLE IF NOT EXISTS quote_requests (
  id TEXT PRIMARY KEY,
  reference_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT,
  service_id TEXT REFERENCES services(id) ON DELETE SET NULL,
  vehicle_id TEXT REFERENCES vehicles(id) ON DELETE SET NULL,
  pickup_area TEXT NOT NULL,
  dropoff_area TEXT NOT NULL,
  goods_type TEXT NOT NULL,
  load_size TEXT NOT NULL, -- 'Small', 'Medium', 'Large', 'Not Sure'
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  additional_notes TEXT,
  status TEXT DEFAULT 'New', -- 'New', 'Contacted', 'Quotation Sent', 'Confirmed', 'Driver Assigned', 'Completed', 'Cancelled'
  admin_notes TEXT,
  quoted_amount NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  whatsapp TEXT,
  company_name TEXT,
  total_bookings INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  quote_id TEXT REFERENCES quote_requests(id) ON DELETE SET NULL,
  reference_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  vehicle_id TEXT REFERENCES vehicles(id) ON DELETE SET NULL,
  pickup_area TEXT NOT NULL,
  dropoff_area TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  scheduled_time TEXT NOT NULL,
  status TEXT DEFAULT 'Scheduled', -- 'Scheduled', 'In Progress', 'Delivered', 'Cancelled'
  driver_name TEXT,
  driver_contact TEXT,
  total_amount NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'Unread', -- 'Unread', 'Responded', 'Archived'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Admin Profiles / Users
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) policies
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can read active services, vehicles, and service areas
CREATE POLICY "Public can view active services" ON services FOR SELECT USING (active = true);
CREATE POLICY "Public can view active vehicles" ON vehicles FOR SELECT USING (active = true);
CREATE POLICY "Public can view active service areas" ON service_areas FOR SELECT USING (active = true);

-- Public can insert quote requests and contact messages
CREATE POLICY "Public can submit quote requests" ON quote_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can submit contact messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Admins full access
CREATE POLICY "Admin full access on services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access on vehicles" ON vehicles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access on quote_requests" ON quote_requests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access on contact_messages" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access on service_areas" ON service_areas FOR ALL USING (auth.role() = 'authenticated');
