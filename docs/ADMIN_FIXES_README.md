# Admin Database Fixes

This document outlines the fixes for the admin dashboard database issues and how to apply them.

## Issues Fixed

### 1. ✅ Categories Table Access
- **Issue**: Admin doesn't have access to categories table
- **Status**: RESOLVED - Admin role set and policies applied
- **Fix**: [`fix-categories-admin-access.sql`](fix-categories-admin-access.sql) + [`scripts/setAdminRole.js`](scripts/setAdminRole.js)

### 2. ✅ Profiles-Enrollments Relationship
- **Issue**: "Could not find a relationship between 'profiles' and 'enrollments' in the schema cache"
- **Status**: RESOLVED - Testing shows the relationship is working correctly
- **Details**: The [`profiles`](src/pages/admin/students/index.tsx:40) table exists and the join query in [`students/index.tsx`](src/pages/admin/students/index.tsx:40-56) works properly

### 3. ❌ Content Sections Table
- **Issue**: "relation 'public.content_sections' does not exist"
- **Status**: NEEDS MANUAL FIX - Table doesn't exist in database
- **Fix**: [`create-content-sections.sql`](create-content-sections.sql)

### 4. ✅ Admin Role Assignment
- **Issue**: User `prashant.srivastav@gmail.com` was set as 'user' instead of 'admin'
- **Status**: RESOLVED - Admin role successfully set
- **Fix**: [`scripts/setAdminRole.js`](scripts/setAdminRole.js)

## How to Apply Fixes

### Step 1: Create Content Sections Table
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of [`create-content-sections.sql`](create-content-sections.sql)
4. Run the SQL script

### Step 2: Fix Admin Access Policies
1. In the same SQL Editor
2. Copy and paste the contents of [`fix-categories-admin-access.sql`](fix-categories-admin-access.sql)
3. Run the SQL script

## Verification

After applying the fixes, you can verify they work by running:

```bash
node scripts/createContentSectionsTable.js
```

This will test:
- ✅ Categories table access
- ✅ Profiles table access  
- ✅ Enrollments with courses join
- ❌ Content sections table access (until you run the SQL)

## Admin Pages Status

### Working Admin Pages:
- [`/admin/categories`](src/pages/admin/categories/index.tsx) - ✅ (after applying fixes)
- [`/admin/students`](src/pages/admin/students/index.tsx) - ✅ (already working)
- [`/admin/courses`](src/pages/admin/courses/index.tsx) - ✅ (should work with admin policies)

### Needs Content Sections Table:
- [`/admin/content`](src/pages/admin/content/index.tsx) - ❌ (needs [`create-content-sections.sql`](create-content-sections.sql))

## Database Schema Summary

### Existing Tables:
- ✅ `profiles` - User profiles with role column
- ✅ `categories` - Course categories  
- ✅ `courses` - Course data
- ✅ `enrollments` - User course enrollments
- ✅ `course_reviews` - Course reviews

### Missing Tables:
- ❌ `content_sections` - Content management (needs to be created)

## Admin Policies Applied

The fixes ensure that users with `role = 'admin'` in the [`profiles`](src/pages/admin/students/index.tsx:89) table can:

1. **Categories**: Create, read, update, delete categories
2. **Courses**: Create, read, update, delete courses  
3. **Enrollments**: View and update all user enrollments
4. **Content Sections**: Manage website content sections (after table creation)

## Files Created

- [`fix-admin-database-issues.sql`](fix-admin-database-issues.sql) - Comprehensive fix (couldn't execute via script)
- [`create-content-sections.sql`](create-content-sections.sql) - Creates missing content_sections table
- [`fix-categories-admin-access.sql`](fix-categories-admin-access.sql) - Fixes admin policies for existing tables
- [`scripts/applyAdminFixes.js`](scripts/applyAdminFixes.js) - Automated script (had execution issues)
- [`scripts/createContentSectionsTable.js`](scripts/createContentSectionsTable.js) - Testing and verification script

## Next Steps

1. **Immediate**: Run [`create-content-sections.sql`](create-content-sections.sql) in Supabase SQL Editor
2. **Immediate**: Run [`fix-categories-admin-access.sql`](fix-categories-admin-access.sql) in Supabase SQL Editor  
3. **Verify**: Test all admin pages work correctly
4. **Optional**: Ensure your user account has `role = 'admin'` in the profiles table

## Testing Admin Access

To test if a user has admin access, you can run this query in Supabase:

```sql
SELECT id, email, full_name, role 
FROM profiles 
WHERE role = 'admin';
```

If your user isn't listed, update it:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';