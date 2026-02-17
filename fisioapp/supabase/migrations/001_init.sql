create extension if not exists pgcrypto;

create type public.app_role as enum (
  'superadmin',
  'admin',
  'fisiatra',
  'fisioterapeuta',
  'paciente'
);

create type public.patient_status as enum (
  'active',
  'inactive',
  'discharged'
);

create type public.appointment_status as enum (
  'scheduled',
  'confirmed',
  'completed',
  'cancelled',
  'no_show'
);

create type public.appointment_type as enum (
  'session',
  'medical',
  'evaluation'
);

create type public.session_type as enum (
  'therapeutic',
  'medical'
);

create type public.alert_priority as enum (
  'low',
  'medium',
  'high',
  'critical'
);

create type public.alert_status as enum (
  'active',
  'resolved'
);

create type public.alert_type as enum (
  'critical_pain',
  'pain_during_exercise',
  'low_adherence',
  'pain_trend',
  'inactivity'
);

create type public.consent_type as enum (
  'treatment',
  'data',
  'whatsapp',
  'video'
);

create type public.notification_channel as enum (
  'in_app',
  'email',
  'whatsapp'
);

create type public.notification_status as enum (
  'queued',
  'sent',
  'failed'
);

create table public.centers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  timezone text default 'America/Bogota',
  branding jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  center_id uuid not null references public.centers(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  center_id uuid not null references public.centers(id) on delete cascade,
  role public.app_role not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table public.patients (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  first_name text not null,
  last_name text not null,
  email text,
  phone_whatsapp text,
  gender text,
  date_of_birth date,
  primary_pathology text,
  status public.patient_status default 'active',
  created_at timestamptz default now()
);

create table public.patient_assignments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  professional_id uuid not null references auth.users(id) on delete cascade,
  assignment_role text default 'primary',
  created_at timestamptz default now(),
  unique(patient_id, professional_id)
);

create table public.pain_events (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  intensity int not null check (intensity between 0 and 10),
  location text not null,
  trigger text,
  duration text,
  note text,
  occurred_at timestamptz not null,
  created_at timestamptz default now()
);

create table public.exercise_library (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers(id) on delete cascade,
  title text not null,
  description text,
  source text default 'youtube',
  source_url text,
  thumbnail_url text,
  segment text,
  goal text,
  phase text,
  created_by uuid references auth.users(id),
  is_archived boolean default false,
  is_featured boolean default false,
  created_at timestamptz default now()
);

create table public.exercise_versions (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercise_library(id) on delete cascade,
  version_number int not null,
  snapshot jsonb not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table public.exercise_plans (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  created_by uuid references auth.users(id),
  status text default 'active',
  start_date timestamptz not null,
  end_date timestamptz,
  notes text,
  created_at timestamptz default now()
);

create table public.plan_exercises (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers(id) on delete cascade,
  plan_id uuid not null references public.exercise_plans(id) on delete cascade,
  exercise_id uuid not null references public.exercise_library(id) on delete cascade,
  expected_per_week int default 3,
  dosage jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table public.exercise_completions (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers(id) on delete cascade,
  plan_exercise_id uuid not null references public.plan_exercises(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  completed_at timestamptz not null,
  difficulty int,
  had_pain boolean,
  pain_intensity int,
  note text,
  created_at timestamptz default now()
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  professional_id uuid references auth.users(id),
  session_type public.session_type not null,
  subjective text,
  objective text,
  assessment text,
  plan text,
  pain_before int,
  pain_after int,
  started_at timestamptz not null,
  created_at timestamptz default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  professional_id uuid references auth.users(id),
  starts_at timestamptz not null,
  duration_minutes int default 45,
  appointment_type public.appointment_type default 'session',
  status public.appointment_status default 'scheduled',
  created_at timestamptz default now()
);

create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers(id) on delete cascade,
  patient_id uuid references public.patients(id) on delete cascade,
  professional_id uuid references auth.users(id),
  alert_type public.alert_type not null,
  priority public.alert_priority not null,
  status public.alert_status default 'active',
  summary text,
  triggered_at timestamptz not null,
  resolved_at timestamptz,
  created_at timestamptz default now()
);

create table public.alert_events (
  id uuid primary key default gen_random_uuid(),
  alert_id uuid not null references public.alerts(id) on delete cascade,
  action text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table public.consents (
  id uuid primary key default gen_random_uuid(),
  center_id uuid not null references public.centers(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  consent_type public.consent_type not null,
  accepted boolean default false,
  version text default 'v1',
  accepted_at timestamptz,
  accepted_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table public.notification_templates (
  id uuid primary key default gen_random_uuid(),
  center_id uuid references public.centers(id) on delete cascade,
  name text not null,
  channel public.notification_channel not null,
  content text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table public.notification_outbox (
  id uuid primary key default gen_random_uuid(),
  center_id uuid references public.centers(id) on delete cascade,
  template_id uuid references public.notification_templates(id) on delete set null,
  channel public.notification_channel not null,
  recipient_user_id uuid references auth.users(id) on delete set null,
  recipient_patient_id uuid references public.patients(id) on delete set null,
  payload jsonb default '{}'::jsonb,
  status public.notification_status default 'queued',
  error_message text,
  scheduled_at timestamptz default now(),
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz default now()
);

create or replace function public.current_center_id()
returns uuid
language sql
stable
as $$
  select center_id from public.user_roles
  where user_id = auth.uid() and is_active = true
  order by created_at desc
  limit 1;
$$;

create or replace function public.has_role(role_text text)
returns boolean
language sql
stable
as $$
  select exists(
    select 1 from public.user_roles
    where user_id = auth.uid()
      and is_active = true
      and role::text = role_text
  );
$$;

create or replace function public.is_same_center(center uuid)
returns boolean
language sql
stable
as $$
  select exists(
    select 1 from public.user_roles
    where user_id = auth.uid()
      and is_active = true
      and center_id = center
  );
$$;

create or replace function public.is_assigned_patient(p_id uuid)
returns boolean
language sql
stable
as $$
  select exists(
    select 1 from public.patient_assignments pa
    where pa.patient_id = p_id
      and pa.professional_id = auth.uid()
  );
$$;

alter table public.centers enable row level security;
alter table public.users enable row level security;
alter table public.user_roles enable row level security;
alter table public.patients enable row level security;
alter table public.patient_assignments enable row level security;
alter table public.pain_events enable row level security;
alter table public.exercise_library enable row level security;
alter table public.exercise_versions enable row level security;
alter table public.exercise_plans enable row level security;
alter table public.plan_exercises enable row level security;
alter table public.exercise_completions enable row level security;
alter table public.sessions enable row level security;
alter table public.appointments enable row level security;
alter table public.alerts enable row level security;
alter table public.alert_events enable row level security;
alter table public.consents enable row level security;
alter table public.notification_templates enable row level security;
alter table public.notification_outbox enable row level security;

create policy "center_select" on public.centers
  for select using (public.is_same_center(id));

create policy "center_manage" on public.centers
  for insert with check (public.has_role('superadmin'));

create policy "center_update" on public.centers
  for update using (public.has_role('superadmin'));

create policy "users_select" on public.users
  for select using (public.is_same_center(center_id));

create policy "users_insert_self" on public.users
  for insert with check (id = auth.uid());

create policy "user_roles_select" on public.user_roles
  for select using (public.is_same_center(center_id));

create policy "user_roles_insert" on public.user_roles
  for insert with check (user_id = auth.uid() or public.has_role('superadmin'));

create policy "patients_select" on public.patients
  for select using (
    public.is_same_center(center_id)
    and (
      public.has_role('superadmin')
      or public.has_role('admin')
      or public.is_assigned_patient(id)
      or user_id = auth.uid()
    )
  );

create policy "patients_insert" on public.patients
  for insert with check (public.has_role('superadmin') or public.has_role('admin'));

create policy "patients_update" on public.patients
  for update using (
    public.is_same_center(center_id)
    and (
      public.has_role('superadmin')
      or public.has_role('admin')
      or public.is_assigned_patient(id)
    )
  );

create policy "assignments_select" on public.patient_assignments
  for select using (public.is_same_center((select center_id from public.patients where id = patient_id)));

create policy "assignments_insert" on public.patient_assignments
  for insert with check (public.has_role('superadmin') or public.has_role('admin'));

create policy "pain_select" on public.pain_events
  for select using (
    public.is_same_center(center_id)
    and (
      public.has_role('superadmin')
      or public.has_role('admin')
      or public.is_assigned_patient(patient_id)
      or exists (select 1 from public.patients p where p.id = patient_id and p.user_id = auth.uid())
    )
  );

create policy "pain_insert" on public.pain_events
  for insert with check (
    public.is_same_center(center_id)
    and (
      public.has_role('superadmin')
      or public.has_role('admin')
      or public.is_assigned_patient(patient_id)
      or exists (select 1 from public.patients p where p.id = patient_id and p.user_id = auth.uid())
    )
  );

create policy "exercise_library_select" on public.exercise_library
  for select using (public.is_same_center(center_id));

create policy "exercise_library_insert" on public.exercise_library
  for insert with check (public.is_same_center(center_id));

create policy "exercise_library_update" on public.exercise_library
  for update using (public.is_same_center(center_id));

create policy "exercise_plans_select" on public.exercise_plans
  for select using (public.is_same_center(center_id));

create policy "exercise_plans_insert" on public.exercise_plans
  for insert with check (public.is_same_center(center_id));

create policy "plan_exercises_select" on public.plan_exercises
  for select using (public.is_same_center(center_id));

create policy "plan_exercises_insert" on public.plan_exercises
  for insert with check (public.is_same_center(center_id));

create policy "sessions_select" on public.sessions
  for select using (public.is_same_center(center_id));

create policy "sessions_insert" on public.sessions
  for insert with check (public.is_same_center(center_id));

create policy "appointments_select" on public.appointments
  for select using (public.is_same_center(center_id));

create policy "appointments_insert" on public.appointments
  for insert with check (public.is_same_center(center_id));

create policy "alerts_select" on public.alerts
  for select using (public.is_same_center(center_id));

create policy "alerts_insert" on public.alerts
  for insert with check (public.is_same_center(center_id));

create policy "alerts_update" on public.alerts
  for update using (public.is_same_center(center_id));

create policy "alert_events_select" on public.alert_events
  for select using (true);

create policy "alert_events_insert" on public.alert_events
  for insert with check (true);

create policy "consents_select" on public.consents
  for select using (public.is_same_center(center_id));

create policy "consents_insert" on public.consents
  for insert with check (public.is_same_center(center_id));

create policy "notification_templates_select" on public.notification_templates
  for select using (public.is_same_center(center_id));

create policy "notification_templates_insert" on public.notification_templates
  for insert with check (public.is_same_center(center_id));

create policy "notification_outbox_select" on public.notification_outbox
  for select using (public.is_same_center(center_id));

create policy "notification_outbox_insert" on public.notification_outbox
  for insert with check (public.is_same_center(center_id));

create policy "exercise_versions_select" on public.exercise_versions
  for select using (true);

create policy "exercise_versions_insert" on public.exercise_versions
  for insert with check (true);

create policy "exercise_completions_select" on public.exercise_completions
  for select using (public.is_same_center(center_id));

create policy "exercise_completions_insert" on public.exercise_completions
  for insert with check (public.is_same_center(center_id));

create policy "notification_outbox_update" on public.notification_outbox
  for update using (public.is_same_center(center_id));
