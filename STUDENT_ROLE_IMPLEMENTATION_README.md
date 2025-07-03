# Student Role Implementation Guide

## Overview

This document outlines the implementation of the student role system in the ITwala Academy application, ensuring proper role assignment and data access. It also includes a fix for missing profiles where users exist in auth.users but not in the profiles table.

## 🚨 Critical Issue Fixed: Missing Profiles

**Problem**: Some users exist in `auth.users` table but don't have corresponding entries in `profiles` table.

**Solution**: Created comprehensive sync scripts and database triggers to ensure all users have profiles.

## Changes Made

### 1. User Role Assignment (src/hooks/useAuth.ts)
- **Before**: New users were assigned 'user' role by default
- **After**: New users are assigned 'student' role by default
- **Impact**: All new signups will automatically get the 'student' role

### 2. Admin Students Query (src/pages/admin/students/index.tsx)
- **Before**: Admin panel queried for users with 'user' role
- **After**: Admin panel queries for users with 'student' role
- **Impact**: Students will now appear in the admin panel

### 3. Enrolled Courses Display (src/components/dashboard/EnrolledCourses.tsx)
- **Before**: Component was not fetching actual enrollment data
- **After**: Component fetches real enrollment data from Supabase
- **Impact**: Students can now see their enrolled courses on the dashboard

### 4. Enrollment API Enhancement (src/pages/api/enrollment/enroll.ts)
- **Before**: Relied only on database triggers for role assignment
- **After**: Manually ensures student role assignment during enrollment
- **Impact**: Guarantees role assignment even if database triggers fail

## Database Migration

### Step 1: Fix Missing Profiles

**Required SQL Script: `sync-missing-profiles.sql`**

This script handles:
- Creating missing profiles for users without them
- Setting proper default roles ('student' for regular users, 'admin' for admin@itwala.com)
- Creating database triggers for automatic profile creation
- Updating existing profiles with invalid roles

### Step 2: Student Role Implementation

**Required SQL Script: `setup-student-role-migration.sql`**

This script handles:
- Adding 'student' to enum or text role columns
- Creating automatic role assignment triggers
- Updating existing user roles
- Creating proper RLS policies

### Key Database Changes:

1. **Role Assignment Trigger**
   ```sql
   CREATE OR REPLACE FUNCTION assign_student_role_on_enrollment()
   RETURNS TRIGGER AS $$
   BEGIN
       UPDATE profiles 
       SET role = 'student',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = NEW.user_id 
         AND role IN ('user', 'student');
       RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

2. **Automatic Trigger Creation**
   ```sql
   CREATE TRIGGER trigger_assign_student_role
       AFTER INSERT ON enrollments
       FOR EACH ROW
       EXECUTE FUNCTION assign_student_role_on_enrollment();
   ```

3. **Data Migration**
   ```sql
   -- Update existing users with 'user' role to 'student'
   UPDATE profiles 
   SET role = 'student',
       updated_at = CURRENT_TIMESTAMP
   WHERE role = 'user' 
     AND id IN (
       SELECT DISTINCT user_id 
       FROM enrollments
       WHERE status = 'active'
     );
   ```

## Implementation Steps

### Step 1: Fix Missing Profiles
**Option A: Using SQL Script (Recommended)**
1. Run the `sync-missing-profiles.sql` script in your Supabase SQL editor
2. This will create missing profiles and set up automatic profile creation triggers

**Option B: Using Node.js Script**
1. Run: `node scripts/fixMissingProfiles.js`
2. This will programmatically sync all missing profiles

### Step 2: Apply Student Role Migration
1. Run the `setup-student-role-migration.sql` script in your Supabase SQL editor
2. Verify the changes using the verification queries in the script

### Step 3: Deploy Application Changes
1. The code changes are already implemented in the following files:
   - `src/hooks/useAuth.ts` - Enhanced profile creation and role assignment
   - `src/pages/admin/students/index.tsx` - Fixed to query 'student' role
   - `src/components/dashboard/EnrolledCourses.tsx` - Real enrollment data fetching
   - `src/pages/api/enrollment/enroll.ts` - Manual role assignment fallback

### Step 4: Test the Implementation
1. **Test Profile Sync**: Verify all users now have profiles
2. **Test New User Signup**: Verify new users get 'student' role
3. **Test Enrollment**: Verify users get 'student' role after enrollment
4. **Test Admin Panel**: Verify students appear in admin/students page
5. **Test Dashboard**: Verify enrolled courses appear on user dashboard

## User Flow

### New User Signup Flow:
1. User signs up → Gets 'student' role by default
2. User enrolls in course → Role remains 'student' (or gets upgraded if was something else)
3. User appears in admin/students page
4. User sees enrolled courses on dashboard

### Existing User Flow:
1. Database migration updates existing 'user' roles to 'student'
2. Next enrollment triggers role update (if needed)
3. Users appear in admin panel
4. Users see enrolled courses on dashboard

## Database Schema

### Profiles Table
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    role TEXT DEFAULT 'student', -- or user_role enum
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Enrollments Table
```sql
CREATE TABLE enrollments (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    course_id UUID REFERENCES courses(id),
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active',
    progress INTEGER DEFAULT 0
);
```

## Role Hierarchy

1. **admin**: Full system access
2. **instructor**: Course management access
3. **student**: Student dashboard and enrolled course access

## Security Considerations

### Row Level Security (RLS) Policies:
- Students can only view their own enrollments
- Admins can view all enrollments
- Students can view courses they're enrolled in
- Proper role checks in all API endpoints

## Testing Checklist

- [ ] New user signup assigns 'student' role
- [ ] User enrollment triggers 'student' role assignment
- [ ] Students appear in admin/students page
- [ ] Enrolled courses display on user dashboard
- [ ] Admin can manage student enrollments
- [ ] Role-based access control works correctly

## Troubleshooting

### Common Issues:

1. **Students not appearing in admin panel**
   - Check if users have 'student' role in profiles table
   - Verify admin query is looking for 'student' not 'user'

2. **Enrolled courses not showing**
   - Check if enrollments exist in database
   - Verify RLS policies allow student access
   - Check if course data is properly joined

3. **Role assignment not working**
   - Verify database trigger exists and is enabled
   - Check if trigger function has proper permissions
   - Verify API endpoint is handling role assignment

## Verification Queries

```sql
-- Check if all users have profiles
SELECT
    'Users without profiles' as check_type,
    COUNT(*) as count
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL
    AND au.email_confirmed_at IS NOT NULL;

-- Check role distribution
SELECT role, COUNT(*) as count FROM profiles GROUP BY role;

-- Check enrolled students
SELECT p.full_name, p.email, p.role, COUNT(e.id) as enrollments
FROM profiles p
LEFT JOIN enrollments e ON p.id = e.user_id
WHERE p.role = 'student'
GROUP BY p.id, p.full_name, p.email, p.role;

-- Check trigger exists
SELECT tgname FROM pg_trigger WHERE tgname = 'trigger_assign_student_role';

-- Compare user counts
SELECT
    'Total confirmed users' as type,
    COUNT(*) as count
FROM auth.users
WHERE email_confirmed_at IS NOT NULL
UNION ALL
SELECT
    'Total profiles' as type,
    COUNT(*) as count
FROM profiles;
```

## Notes

- The system is designed to be backwards compatible
- Existing 'user' roles are automatically migrated to 'student'
- Database triggers ensure automatic role assignment
- Manual role assignment in API provides fallback
- All changes maintain existing admin and instructor functionality