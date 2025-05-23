-- Create site_settings table
create table if not exists site_settings (
  id uuid default extensions.uuid_generate_v4() primary key,
  site_name text not null default 'ITwala Academy',
  contact_email text not null default 'sales@it-wala.com',
  support_phone text not null default '+91 7982303199',
  maintenance_mode boolean not null default false,
  enrollments_enabled boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default settings if not exists
insert into site_settings (site_name, contact_email, support_phone)
values ('ITwala Academy', 'sales@it-wala.com', '+91 7982303199')
on conflict do nothing;

-- Enable RLS
alter table site_settings enable row level security;

-- Create policies
create policy "Allow read access to all users" on site_settings
  for select using (true);

create policy "Allow update access to admins only" on site_settings
  for update using (
    auth.jwt() ->> 'role' = 'admin'
  );

create policy "Allow insert access to admins only" on site_settings
  for insert with check (
    auth.jwt() ->> 'role' = 'admin'
  );

create policy "Allow delete access to admins only" on site_settings
  for delete using (
    auth.jwt() ->> 'role' = 'admin'
  );
