# Student ID Auto-Assignment Feature

## Overview

This feature automatically generates and assigns a unique Student ID to every successful enrollment. The Student ID follows a structured format that includes geographic and temporal information.

## Student ID Format

```
{Country ISO}-{State ISO}-{YYYY}-{MM}-{NNNN}
```

**Examples:**
- `IN-MH-2026-02-0001` - India, Maharashtra, February 2026, 1st enrollment
- `US-CA-2026-03-0015` - United States, California, March 2026, 15th enrollment
- `GB-ENG-2026-01-0003` - United Kingdom, England, January 2026, 3rd enrollment

### Components

| Component | Description | Example |
|-----------|-------------|---------|
| Country ISO | ISO 3166-1 alpha-2 country code | IN, US, GB |
| State ISO | ISO 3166-2 state/region code | MH, CA, ENG |
| YYYY | 4-digit enrollment year | 2026 |
| MM | 2-digit enrollment month | 02 |
| NNNN | 4-digit sequential number (per prefix) | 0001 |

## Features

### 1. Automatic Generation
- Student IDs are automatically generated during enrollment
- Sequential numbering is maintained per country-state-year-month combination
- No manual intervention required

### 2. Country Selection in Enrollment Modal
- **Default Country**: India (pre-selected)
- Users can change their country from a dropdown of 50+ countries
- State/Province options dynamically update based on selected country
- City options:
  - **India**: Dropdown selection with comprehensive city lists
  - **Other countries**: Free-text input

### 3. Cascading Dropdowns
- Changing country resets state and city selections
- Changing state resets city selection
- Dynamic label updates (Pincode vs ZIP Code)

## Supported Countries

The system includes detailed state/region data for:
- **India** - All 28 states and 8 union territories
- **United States** - All 50 states
- **United Kingdom** - England, Scotland, Wales, Northern Ireland
- **Canada** - All 13 provinces and territories
- **Australia** - All 8 states and territories
- **UAE** - All 7 emirates

Other countries default to a generic "Other" state option.

## Database Changes

### New Column: `student_id`
```sql
ALTER TABLE enrollments 
ADD COLUMN student_id TEXT UNIQUE;
```

### New Table: `student_id_sequences`
Tracks sequential numbering for each prefix combination:
```sql
CREATE TABLE student_id_sequences (
  id UUID PRIMARY KEY,
  prefix TEXT NOT NULL UNIQUE,  -- e.g., "IN-MH-2026-02"
  last_number INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### Database Function: `generate_student_id`
Generates unique student IDs with atomic sequence updates to prevent duplicates.

## Files Modified

### Core Components
- `src/components/courses/EnrollmentModal.tsx` - Country/State/City selection
- `src/pages/api/enrollment/enroll.ts` - Student ID generation logic

### New Files
- `src/utils/locationData.ts` - Country/State/City data with ISO codes
- `supabase/migrations/20260221000000_add_student_id.sql` - Database migration
- `scripts/apply-student-id-migration.js` - Migration helper script

## Email Notifications

Both admin and student emails now include the Student ID:

**Admin Email:**
- Shows Student ID prominently
- Includes country and state information

**Student Confirmation Email:**
- Displays Student ID with instruction to save for future reference

## API Response

The enrollment API response now includes:
```json
{
  "message": "Successfully enrolled in the course",
  "enrollment": { ... },
  "studentId": "IN-MH-2026-02-0001",
  "userRole": "student",
  "course": { ... }
}
```

## Usage

### Applying the Migration

1. Ensure environment variables are set:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   SUPABASE_SERVICE_ROLE_KEY=your_key
   ```

2. Run the migration via Supabase Dashboard SQL Editor, or use:
   ```bash
   node scripts/apply-student-id-migration.js
   ```

### Testing

1. Navigate to a course page
2. Click "Enroll Now"
3. In the enrollment modal:
   - Verify India is pre-selected as country
   - Change country and verify states update
   - For India, verify city dropdown appears
   - For other countries, verify city is a text input
4. Complete enrollment
5. Verify:
   - Toast shows Student ID
   - Email contains Student ID
   - Database record has student_id

## Fallback Handling

If the database function fails to generate a Student ID:
- A fallback ID is generated using random numbers
- Format: `{CountryCode}-{StateCode}-{YYYY}-{MM}-{Random4Digits}`
- The enrollment still succeeds

## Future Enhancements

Potential improvements:
1. Display Student ID in student dashboard
2. Add Student ID to course certificates
3. Allow admin to search enrollments by Student ID
4. Add Student ID to profile page
