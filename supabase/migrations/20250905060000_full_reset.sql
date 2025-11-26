/*
  # Complete database reset and seed

  This migration recreates every application table, policy, and default row
  required for the SpeakersCircle site. It also ensures three default admin
  accounts exist in Supabase Auth with confirmed email/password login.
*/

-- Required for UUID generation and password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================
-- Clean slate (drop app tables)
-- =============================================
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.editable_content CASCADE;
DROP TABLE IF EXISTS public.contact_submissions CASCADE;

-- =============================================
-- Tables
-- =============================================
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  description text NOT NULL,
  payment_link text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  is_recurring boolean DEFAULT false,
  recurrence_type text CHECK (
    recurrence_type IS NULL OR recurrence_type IN ('weekly', 'monthly')
  ),
  recurrence_days text[] DEFAULT '{}',
  recurrence_end_date date
);

CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  content text NOT NULL,
  program text NOT NULL DEFAULT 'YLC Graduate',
  category text DEFAULT 'Students',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.editable_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text UNIQUE NOT NULL,
  content text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- Row Level Security & Policies
-- =============================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editable_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events readable"
  ON public.events
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Events admin manage"
  ON public.events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Testimonials readable"
  ON public.testimonials
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Testimonials admin manage"
  ON public.testimonials
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Editable readable"
  ON public.editable_content
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Editable admin manage"
  ON public.editable_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Contact anyone insert"
  ON public.contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Contact admin read"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- =============================================
-- Default content
-- =============================================
INSERT INTO public.editable_content (section, content) VALUES
  ('mission', 'To foster strong communication, leadership, and life skills, that will help individuals unlock their full potential, by building meaningful connections, and creating lasting impact in their personal and professional lives.'),
  ('vision', 'SpeakersCircle is dedicated to equipping youth with essential communication and leadership skills, helping them build strong personal and professional networks. We develop vital life skills, including confidence, teamwork, and time management preparing them for success in all aspects of life. SpeakersCircle is a community where you gain invaluable guidance from mentors. We believe that your voice is your superpower.'),
  ('about_founder', '<p>Shalini Suravarjjala is a software engineer, technology educator, and the founder of SpeakersCircle. With over 21 years in the software industry and 17+ years in education, she has mentored hundreds of students in robotics, drone technology, and programming while also guiding youth in communication, leadership, and confidence-building.</p><p>As the director of several successful youth initiatives—including Dublin High School''s award-winning robotics program—she has helped students transform technical curiosity into real-world innovation, while also inspiring them to express themselves with clarity and purpose.</p><p>Passionate about empowering the next generation, Shalini combines her love for engineering and education with her dedication to mentorship. At SpeakersCircle, she teaches students not only how to communicate effectively—in speeches, conversations, interviews, and digital platforms—but also how to lead with confidence, embrace their unique voices, and pay it forward by mentoring others.</p>'),
  ('newsletter', '<h3>Welcome to SpeakersCircle!</h3><p>Join us for an exciting journey of communication and leadership development. Our programs are designed to help students find their voice and build confidence.</p><p><strong>Current Programs:</strong></p><ul><li>Youth Leadership Circle (YLC) - 6-8 week introductory program</li><li>Gavel Club - Weekly meetings for ongoing development</li><li>CICC Elementary - Communication skills for younger students</li><li>1-on-1 Coaching - Personalized instruction</li></ul>'),
  ('impact_stats', '[{"value": "95%", "label": "Increase in Confidence", "color": "text-[#FA7C92]"}, {"value": "200+", "label": "Students Mentored", "color": "text-[#6EC4DB]"}, {"value": "17+", "label": "Years of Experience", "color": "text-[#66AB8C]"}, {"value": "100%", "label": "Dedication to Growth", "color": "text-[#FFF7C0]"}]'),
  ('registration_link', 'http://tinyurl.com/SpeakersCircleYLP'),
  ('program_flyer_link', ''),
  ('program_description_link', ''),
  ('newsletter_link', ''),
  ('instagram_link', 'https://www.instagram.com/gallantgaveliers'),
  ('facebook_link', 'https://www.facebook.com/profile.php?id=100022753525879'),
  ('youtube_link', '')
ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content;

INSERT INTO public.testimonials (name, content, program, category) VALUES
  ('Sarah Martinez', 'The Youth Leadership Circle transformed my confidence completely. I went from being terrified of speaking in front of others to presenting confidently at school events. Ms. Shalini created such a supportive environment where I could grow at my own pace.', 'YLC Graduate', 'Students'),
  ('Alex Chen', 'Joining the Gavel Club was the best decision I made in high school. The leadership skills I learned helped me become student body president, and I still use the communication techniques I learned every day in college.', 'Gavel Club Member', 'Alumni'),
  ('Maya Patel', 'I was so shy when I started CICC in elementary school. Now I''m in high school and I love giving presentations! The program taught me that my voice matters and gave me the tools to express myself clearly.', 'CICC Graduate', 'Students'),
  ('Jordan Williams', 'The 1-on-1 sessions with Ms. Shalini were exactly what I needed. She helped me prepare for college interviews and taught me professional communication skills that made all the difference in my applications.', '1-on-1 Student', 'Students'),
  ('Emma Rodriguez', 'SpeakersCircle didn''t just teach me public speaking - it taught me leadership, time management, and how to work with others. These skills have been invaluable in my internships and part-time jobs.', 'Gavel Club Member', 'Alumni'),
  ('David Kim', 'I joined YLC because my parents thought it would help with my shyness. What I discovered was a passion for communication and a group of friends who supported each other. I''m now mentoring younger students!', 'YLC Graduate', 'Students');

INSERT INTO public.events (title, date, time, description, payment_link) VALUES
  ('Youth Leadership Circle - New Cohort', '2025-02-15', '4:00 PM - 5:30 PM', 'Introduction to public speaking and first meeting experience. Students will learn the meeting format and observe experienced speakers.', ''),
  ('Professional Guest Speaker Workshop', '2025-03-08', '4:00 PM - 5:30 PM', 'Special workshop featuring a professional guest speaker discussing leadership in the workplace and effective communication strategies.', '');

-- =============================================
-- Default admin users (Supabase Auth)
-- =============================================
DO $$
DECLARE
  admin jsonb;
  new_user_id uuid;
BEGIN
  FOR admin IN
    SELECT *
    FROM jsonb_array_elements(
      '[
        {"email":"niksuravarjjala@gmail.com","password":"goatedmentor","full_name":"Nik Suravarjjala"},
        {"email":"yvsdevi@gmail.com","password":"coordinatorgoat","full_name":"YVS Devi"},
        {"email":"gallantgaveliers@gmail.com","password":"gallant12!","full_name":"Gallant Gaveliers"}
      ]'::jsonb
    )
  LOOP
    SELECT id
      INTO new_user_id
    FROM auth.users
    WHERE email = admin->>'email'
      AND deleted_at IS NULL
    LIMIT 1;

    IF new_user_id IS NOT NULL THEN
      CONTINUE;
    END IF;

    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at
    )
    VALUES (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      admin->>'email',
      crypt(admin->>'password', gen_salt('bf')),
      now(),
      now(),
      jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
      jsonb_build_object('role', 'admin', 'full_name', admin->>'full_name'),
      false,
      now(),
      now()
    )
    RETURNING id INTO new_user_id;

    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    )
    VALUES (
      gen_random_uuid(),
      new_user_id,
      jsonb_build_object(
        'sub', new_user_id::text,
        'email', admin->>'email',
        'email_verified', true,
        'phone_verified', false,
        'provider', 'email'
      ),
      'email',
      admin->>'email',
      now(),
      now(),
      now()
    );
  END LOOP;
END $$;
