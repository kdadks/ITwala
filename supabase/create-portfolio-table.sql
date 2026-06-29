-- Portfolio Items Table
-- Stores all portfolio projects with comprehensive information

CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Information
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  industry TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Mobile App', 'Web Platform', 'E-commerce', 'Healthcare')),
  
  -- Links and Media
  href TEXT NOT NULL, -- External project URL
  logo TEXT NOT NULL, -- Logo image path
  
  -- Visual Styling
  color TEXT NOT NULL CHECK (color IN ('indigo', 'pink', 'cyan', 'green', 'blue')),
  
  -- Project Details (JSON arrays)
  features JSONB NOT NULL DEFAULT '[]', -- Array of feature strings
  technologies JSONB NOT NULL DEFAULT '[]', -- Array of technology strings
  
  -- Impact and Metrics
  impact TEXT NOT NULL, -- Impact description text
  metrics JSONB NOT NULL DEFAULT '[]', -- Array of {label, value} objects
  
  -- Ordering and Status
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create index for common queries
CREATE INDEX idx_portfolio_items_category ON portfolio_items(category);
CREATE INDEX idx_portfolio_items_is_active ON portfolio_items(is_active);
CREATE INDEX idx_portfolio_items_display_order ON portfolio_items(display_order);
CREATE INDEX idx_portfolio_items_is_featured ON portfolio_items(is_featured, display_order);

-- Enable RLS
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view active portfolio items)
CREATE POLICY "Anyone can view active portfolio items"
  ON portfolio_items
  FOR SELECT
  USING (is_active = true);

-- Admin full access
CREATE POLICY "Admins can do everything with portfolio items"
  ON portfolio_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_portfolio_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER portfolio_items_updated_at
  BEFORE UPDATE ON portfolio_items
  FOR EACH ROW
  EXECUTE FUNCTION update_portfolio_items_updated_at();

-- Insert existing portfolio data
INSERT INTO portfolio_items (
  title, description, industry, category, href, logo, color, 
  features, technologies, impact, metrics, display_order, is_active, is_featured
) VALUES
(
  'RaahiRides',
  'Travel apps for Eastern UP, connecting travelers and drivers for a seamless journey. Comprehensive travel solutions from point-to-point journeys to corporate retreats.',
  'Travel Industry',
  'Mobile App',
  'https://www.raahirides.com',
  '/images/raahi_rides_logo.png',
  'indigo',
  '["Real-time GPS tracking", "Secure payments", "Driver verification", "24/7 support"]'::jsonb,
  '["React Native", "Node.js", "Supabase", "Google Maps API"]'::jsonb,
  '10,000+ active users, 95% customer satisfaction',
  '[{"label": "Active Users", "value": "1K+"}, {"label": "Satisfaction", "value": "95%"}, {"label": "Daily Rides", "value": "50+"}]'::jsonb,
  1, true, true
),
(
  'Vishal Creations',
  'Premium Plastic & Chemical Raw Materials Supplier.',
  'Manufacturing',
  'E-commerce',
  'https://www.vishalcreations.com',
  '/images/VC Logo.png',
  'pink',
  '["Quality assurance", "Bulk supply", "Custom formulations", "Fast delivery"]'::jsonb,
  '["Next.js", "Tailwind CSS", "Stripe", "Vercel"]'::jsonb,
  '500+ B2B clients, 40% increase in online orders',
  '[{"label": "B2B Clients", "value": "500+"}, {"label": "Order Growth", "value": "+40%"}, {"label": "Products", "value": "20+"}]'::jsonb,
  2, true, true
),
(
  'How2doAI',
  'A comprehensive AI app finder and comparison platform, enabling AI automation for end-to-end workflows. Discover, compare, and integrate top AI tools.',
  'Artificial Intelligence',
  'Web Platform',
  'https://www.how2doai.com',
  '/images/logo.png',
  'cyan',
  '["AI tool comparison", "Workflow automation", "Integration guides", "Performance analytics"]'::jsonb,
  '["React", "TypeScript", "OpenAI API", "PostgreSQL"]'::jsonb,
  '50,000+ monthly visitors, 1,000+ AI tools catalogued',
  '[{"label": "Monthly Visitors", "value": "5K+"}, {"label": "AI Tools", "value": "1000+"}, {"label": "Comparisons", "value": "5K+/mo"}]'::jsonb,
  3, true, true
),
(
  'Ayuh Clinic',
  'Comprehensive Healthcare Solutions. From professional home care services to natural homeopathic healing - integrated healthcare with compassion and expertise.',
  'Healthcare',
  'Healthcare',
  'https://ayuhclinic.netlify.app/',
  '/images/AYUH_Logo_2.png',
  'green',
  '["Home care services", "Homeopathic treatments", "Expert consultations", "Wellness programs"]'::jsonb,
  '["React", "Firebase", "Netlify", "Stripe"]'::jsonb,
  '2,000+ patients served, 4.9/5 rating',
  '[{"label": "Patients Served", "value": "2K+"}, {"label": "Rating", "value": "4.9/5"}, {"label": "Treatments", "value": "500+/mo"}]'::jsonb,
  4, true, true
),
(
  'KH Therapy',
  'Physio clinic offering expert physiotherapy and rehabilitation services for all ages. Personalized care for pain relief, mobility, and wellness.',
  'Physiotherapy Clinic',
  'Healthcare',
  'https://khtherapy.ie/',
  '/images/KH.png',
  'blue',
  '["Pain management", "Rehabilitation programs", "Sports therapy", "Post-surgery care"]'::jsonb,
  '["Node.js", "Supabase", "Sum up"]'::jsonb,
  '1,500+ successful treatments, 98% recovery rate',
  '[{"label": "Treatments", "value": "1.5K+"}, {"label": "Recovery Rate", "value": "98%"}, {"label": "Services", "value": "12"}]'::jsonb,
  5, true, true
),
(
  'Nirchal',
  'Retail garments store offering a wide range of clothing and accessories for all ages. Quality products at affordable prices.',
  'Retail Garments',
  'E-commerce',
  'https://nirchal.com/',
  '/images/Nirchal_Logo.png',
  'pink',
  '["Wide selection", "Affordable prices", "Quality assurance", "Fast shipping"]'::jsonb,
  '["React", "Commerce.js", "Stripe", "Netlify"]'::jsonb,
  '5,000+ products sold, 200+ daily orders',
  '[{"label": "Products Sold", "value": "5K+"}, {"label": "Daily Orders", "value": "20+"}, {"label": "Catalog", "value": "100+"}]'::jsonb,
  6, true, true
),
(
  'eYogi Gurukul',
  'Online Learning Platform offering Indian cultural, religious yoga classes and wellness programs for all ages. Expert instructors and personalized plans.',
  'Education & Wellness',
  'Web Platform',
  'https://eyogigurukul.com/ssh-app',
  '/images/eyogiLogo.png',
  'cyan',
  '["Wellness programs", "Digital Platform", "Personalized plans", "Expert instructors"]'::jsonb,
  '["Next.js", "Tailwind CSS", "Supabase", "Stripe", "WebRTC"]'::jsonb,
  '1,000+ students enrolled, 100+ courses',
  '[{"label": "Students", "value": "1K+"}, {"label": "Courses", "value": "13+"}, {"label": "Completion", "value": "85%"}]'::jsonb,
  7, true, true
),
(
  'Pandit Rajesh Joshi',
  'Online Platform offering spiritual guidance and religious teachings for all ages. Expert pandit with personalized plans.',
  'Religious & Spiritual',
  'Web Platform',
  'https://www.panditrajeshjoshi.com/',
  '/images/Raj ji.svg',
  'cyan',
  '["Spiritual guidance", "Religious teachings", "Personalized plans", "Expert pandit"]'::jsonb,
  '["Next.js", "Tailwind CSS", "Supabase", "Stripe", "WebRTC"]'::jsonb,
  '250+ Poojas conducted, 100+ satisfied clients',
  '[{"label": "Poojas", "value": "250+"}, {"label": "Clients", "value": "100+"}, {"label": "Rating", "value": "5.0/5"}]'::jsonb,
  8, true, true
),
(
  'Adamstown.info',
  'Built-and-owned digital property by ITWala — a full-stack informational platform covering the Adamstown area. Demonstrates end-to-end product ownership from development and hosting to SEO and content strategy.',
  'Digital Media',
  'Web Platform',
  'https://www.adamstown.info',
  '/images/adam.jpeg',
  'indigo',
  '["Built & owned by ITWala", "SEO optimised", "Content strategy", "Performance first"]'::jsonb,
  '["Next.js", "Tailwind CSS", "Vercel", "Google Analytics"]'::jsonb,
  'ITWala-owned product — built, hosted and operated in-house',
  '[{"label": "Monthly Visitors", "value": "1000+"}, {"label": "Ranking", "value": "Top 3"}, {"label": "Daily Visitors", "value": "100+"}]'::jsonb,
  9, true, true
),
(
  'UK Knee & Sports Clinic',
  'Comprehensive SEO Improvement Program for a leading UK Knee Surgeon and sports injury clinic. Delivered on-page optimisation, technical audits, local SEO, and content strategy to boost organic search visibility and drive new patient enquiries.',
  'Healthcare',
  'Healthcare',
  'https://www.ukkneeandsportsinjuryclinic.co.uk/',
  '/images/UK.jpg',
  'green',
  '["Technical SEO audit", "On-page optimisation", "Local SEO", "Content strategy"]'::jsonb,
  '["Google Search Console", "RankMath", "Schema Markup", "Analytics"]'::jsonb,
  'Improved organic rankings and increased patient enquiry volume',
  '[{"label": "Organic Traffic", "value": "+60%"}, {"label": "Rankings", "value": "Top 5"}, {"label": "Enquiries", "value": "+40%"}]'::jsonb,
  10, true, true
);

-- Create a view for public portfolio (for better performance)
CREATE OR REPLACE VIEW public_portfolio AS
SELECT 
  id, title, description, industry, category, href, logo, color,
  features, technologies, impact, metrics, display_order
FROM portfolio_items
WHERE is_active = true
ORDER BY display_order ASC;

COMMENT ON TABLE portfolio_items IS 'Portfolio projects displayed on the portfolio page';
COMMENT ON VIEW public_portfolio IS 'Public view of active portfolio items ordered by display_order';
