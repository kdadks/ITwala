# Course Enrollment Authentication Workflow

This document describes the implementation of the authentication workflow for course enrollment and automatic student role assignment.

## Overview

When a user attempts to enroll in a course, the system now requires authentication and automatically assigns the "student" role upon successful enrollment.

## Features Implemented

### 1. Database Changes
- **Added "student" role** to the `user_role` enum in Supabase
- **Created database trigger** to automatically assign "student" role when a user enrolls in a course
- **Added enrollment policies** for students to access their own enrollments

### 2. Authentication Workflow
- **Pre-enrollment authentication check**: Users must be logged in to enroll
- **Enrollment intent storage**: If not authenticated, user details are stored in localStorage
- **Post-authentication enrollment**: After login/registration, enrollment is automatically completed
- **Seamless user experience**: Users are redirected appropriately throughout the flow

### 3. API Endpoints
- **New enrollment API** (`/api/enrollment/enroll`) with authentication checks
- **Enhanced notification system** that works with the new workflow
- **Proper error handling** for authentication and enrollment failures

### 4. Frontend Updates
- **Updated EnrollmentModal** to handle authentication workflow
- **Enhanced login page** to complete enrollment after authentication
- **Updated registration page** to handle enrollment intent
- **Updated useAuth hook** to include "student" role type

## Implementation Details

### Database Setup

Execute the following SQL in your Supabase SQL editor:

```sql
-- Add 'student' to the user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'student';

-- Create function to automatically assign student role on enrollment
CREATE OR REPLACE FUNCTION assign_student_role_on_enrollment()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles 
  SET role = 'student'::user_role,
      updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.user_id 
    AND role = 'user'::user_role;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER trigger_assign_student_role
  AFTER INSERT ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION assign_student_role_on_enrollment();
```

### Workflow Steps

1. **User clicks "Enroll" on a course**
2. **System checks authentication status**
   - If authenticated: Proceed to step 5
   - If not authenticated: Continue to step 3
3. **Store enrollment intent in localStorage**
4. **Redirect to login/registration page**
   - Login: `/auth/login?redirect=enrollment`
   - Registration: User can create account, then redirected to login
5. **After successful authentication, complete enrollment**
6. **Automatically assign "student" role via database trigger**
7. **Send confirmation emails**
8. **Redirect to dashboard with success message**

### Files Modified

#### Database
- `add-student-role.sql` - SQL script to add student role and triggers

#### API Endpoints
- `src/pages/api/enrollment/enroll.ts` - New enrollment API with authentication
- `src/pages/api/enrollment/notify.ts` - Existing notification API (unchanged)

#### Frontend Components
- `src/components/courses/EnrollmentModal.tsx` - Updated enrollment flow
- `src/pages/auth/login.tsx` - Added enrollment completion after login
- `src/pages/auth/register.tsx` - Added enrollment intent handling
- `src/hooks/useAuth.ts` - Added "student" role type

### User Roles

The system now supports four user roles:
- **user**: Default role for new users
- **student**: Automatically assigned when user enrolls in any course
- **instructor**: Manually assigned for course instructors
- **admin**: Manually assigned for system administrators

### Security Features

- **Authentication required**: Users must be logged in to enroll
- **Session validation**: Server-side session validation for enrollment API
- **Role-based access**: Students can only view their own enrollments
- **Automatic role assignment**: Prevents manual role manipulation
- **Enrollment deduplication**: Prevents duplicate enrollments

### Error Handling

- **Authentication errors**: Proper redirects to login page
- **Enrollment errors**: Clear error messages for users
- **Email failures**: Enrollment succeeds even if email notifications fail
- **Database errors**: Proper error logging and user feedback

## Testing the Implementation

### Test Scenarios

1. **Unauthenticated User Enrollment**
   - Visit a course page while logged out
   - Click "Enroll Now"
   - Fill out enrollment form
   - Submit form
   - Should redirect to login page
   - Login with existing account
   - Should automatically complete enrollment and assign "student" role

2. **New User Enrollment**
   - Visit a course page while logged out
   - Click "Enroll Now"
   - Fill out enrollment form
   - Submit form
   - Click "Create new account" on login page
   - Register new account
   - Confirm email
   - Login
   - Should automatically complete enrollment and assign "student" role

3. **Authenticated User Enrollment**
   - Login to existing account
   - Visit a course page
   - Click "Enroll Now"
   - Fill out enrollment form
   - Submit form
   - Should immediately enroll and assign "student" role

### Verification Steps

1. **Check user role in database**:
   ```sql
   SELECT id, email, role FROM profiles WHERE email = 'user@example.com';
   ```

2. **Check enrollment record**:
   ```sql
   SELECT * FROM enrollments WHERE user_id = 'user-uuid';
   ```

3. **Verify email notifications** are sent to both admin and student

## Troubleshooting

### Common Issues

1. **Role not assigned**: Check if database trigger is created properly
2. **Authentication errors**: Verify Supabase configuration
3. **Email failures**: Check SMTP configuration in environment variables
4. **Enrollment intent not working**: Check browser localStorage

### Debug Information

- Check browser console for JavaScript errors
- Check Supabase logs for database errors
- Check server logs for API errors
- Verify environment variables are set correctly

## Future Enhancements

- **Payment integration**: Add payment processing before enrollment
- **Course prerequisites**: Check if user meets course requirements
- **Enrollment limits**: Limit number of students per course
- **Waitlist functionality**: Allow users to join waitlist when course is full
- **Bulk enrollment**: Allow admins to enroll multiple users
- **Role transitions**: Allow users to have multiple roles (student + instructor)