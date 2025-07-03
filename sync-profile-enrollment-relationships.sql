-- Comprehensive Profile-Enrollment Synchronization & Relationship Setup
-- This script creates automatic triggers and relationships to keep profile and enrollment tables in sync

-- STEP 1: Ensure enrollment table has correct structure and foreign keys
-- Drop existing foreign key constraints if they exist
ALTER TABLE enrollments 
DROP CONSTRAINT IF EXISTS enrollments_user_id_fkey;

-- Add the correct foreign key constraint to profiles table
ALTER TABLE enrollments 
ADD CONSTRAINT enrollments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);

-- STEP 2: Create function to auto-enroll new students
CREATE OR REPLACE FUNCTION auto_enroll_new_student()
RETURNS TRIGGER AS $$
DECLARE
    default_course_id UUID;
BEGIN
    -- Only auto-enroll if this is a new student profile
    IF NEW.role = 'student' AND (OLD IS NULL OR OLD.role != 'student') THEN
        -- Find the first free course or the first course available
        SELECT id INTO default_course_id
        FROM courses 
        WHERE status = 'published' 
        ORDER BY 
            CASE WHEN price = 0 THEN 0 ELSE 1 END,
            created_at ASC
        LIMIT 1;
        
        -- If we found a default course, enroll the student
        IF default_course_id IS NOT NULL THEN
            INSERT INTO enrollments (user_id, course_id, enrolled_at, status, progress)
            VALUES (NEW.id, default_course_id, NOW(), 'active', 0)
            ON CONFLICT (user_id, course_id) DO NOTHING;
            
            RAISE NOTICE 'Auto-enrolled student % in default course %', NEW.email, default_course_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 3: Create trigger for auto-enrolling new students
DROP TRIGGER IF EXISTS trigger_auto_enroll_new_student ON profiles;
CREATE TRIGGER trigger_auto_enroll_new_student
    AFTER INSERT OR UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION auto_enroll_new_student();

-- STEP 4: Create function to update course enrollment counts
CREATE OR REPLACE FUNCTION update_course_enrollment_count()
RETURNS TRIGGER AS $$
DECLARE
    target_course_id UUID;
BEGIN
    -- Determine which course to update
    IF TG_OP = 'DELETE' THEN
        target_course_id := OLD.course_id;
    ELSE
        target_course_id := NEW.course_id;
    END IF;
    
    -- Update the course enrollment count
    UPDATE courses 
    SET 
        enrollments = (
            SELECT COUNT(*) 
            FROM enrollments 
            WHERE course_id = target_course_id
            AND status = 'active'
        ),
        students = (
            SELECT COUNT(*) 
            FROM enrollments 
            WHERE course_id = target_course_id
            AND status = 'active'
        ),
        updated_at = NOW()
    WHERE id = target_course_id;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 5: Create triggers for enrollment count updates
DROP TRIGGER IF EXISTS trigger_update_enrollment_count_insert ON enrollments;
DROP TRIGGER IF EXISTS trigger_update_enrollment_count_update ON enrollments;
DROP TRIGGER IF EXISTS trigger_update_enrollment_count_delete ON enrollments;

CREATE TRIGGER trigger_update_enrollment_count_insert
    AFTER INSERT ON enrollments
    FOR EACH ROW EXECUTE FUNCTION update_course_enrollment_count();

CREATE TRIGGER trigger_update_enrollment_count_update
    AFTER UPDATE ON enrollments
    FOR EACH ROW EXECUTE FUNCTION update_course_enrollment_count();

CREATE TRIGGER trigger_update_enrollment_count_delete
    AFTER DELETE ON enrollments
    FOR EACH ROW EXECUTE FUNCTION update_course_enrollment_count();

-- STEP 6: Create function to prevent enrollment orphaning
CREATE OR REPLACE FUNCTION prevent_profile_deletion_with_enrollments()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the profile has active enrollments
    IF EXISTS (
        SELECT 1 FROM enrollments 
        WHERE user_id = OLD.id 
        AND status = 'active'
    ) THEN
        RAISE EXCEPTION 'Cannot delete profile with active enrollments. Please deactivate enrollments first.';
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 7: Create trigger to prevent profile deletion with active enrollments
DROP TRIGGER IF EXISTS trigger_prevent_profile_deletion_with_enrollments ON profiles;
CREATE TRIGGER trigger_prevent_profile_deletion_with_enrollments
    BEFORE DELETE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION prevent_profile_deletion_with_enrollments();

-- STEP 8: Create function to sync enrollment status with profile status
CREATE OR REPLACE FUNCTION sync_enrollment_with_profile_status()
RETURNS TRIGGER AS $$
BEGIN
    -- If profile is being disabled/deleted, mark enrollments as inactive
    IF NEW.role IS NULL OR NEW.role = '' THEN
        UPDATE enrollments 
        SET status = 'inactive',
            updated_at = NOW()
        WHERE user_id = NEW.id 
        AND status = 'active';
        
        RAISE NOTICE 'Deactivated enrollments for profile %', NEW.email;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 9: Create trigger for profile status sync
DROP TRIGGER IF EXISTS trigger_sync_enrollment_with_profile_status ON profiles;
CREATE TRIGGER trigger_sync_enrollment_with_profile_status
    AFTER UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION sync_enrollment_with_profile_status();

-- STEP 10: Create function to maintain data integrity
CREATE OR REPLACE FUNCTION maintain_profile_enrollment_integrity()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure enrollment references valid profile
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = NEW.user_id) THEN
        RAISE EXCEPTION 'Cannot create enrollment for non-existent profile: %', NEW.user_id;
    END IF;
    
    -- Ensure enrollment references valid course
    IF NOT EXISTS (SELECT 1 FROM courses WHERE id = NEW.course_id) THEN
        RAISE EXCEPTION 'Cannot create enrollment for non-existent course: %', NEW.course_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 11: Create trigger for data integrity
DROP TRIGGER IF EXISTS trigger_maintain_profile_enrollment_integrity ON enrollments;
CREATE TRIGGER trigger_maintain_profile_enrollment_integrity
    BEFORE INSERT OR UPDATE ON enrollments
    FOR EACH ROW
    EXECUTE FUNCTION maintain_profile_enrollment_integrity();

-- STEP 12: Create helper function to get enrollment statistics
CREATE OR REPLACE FUNCTION get_enrollment_statistics()
RETURNS TABLE (
    total_profiles INTEGER,
    total_students INTEGER,
    total_enrollments INTEGER,
    students_with_enrollments INTEGER,
    students_without_enrollments INTEGER,
    active_enrollments INTEGER,
    inactive_enrollments INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::INTEGER FROM profiles) as total_profiles,
        (SELECT COUNT(*)::INTEGER FROM profiles WHERE role = 'student') as total_students,
        (SELECT COUNT(*)::INTEGER FROM enrollments) as total_enrollments,
        (SELECT COUNT(DISTINCT user_id)::INTEGER FROM enrollments) as students_with_enrollments,
        (SELECT COUNT(*)::INTEGER FROM profiles WHERE role = 'student' 
         AND id NOT IN (SELECT DISTINCT user_id FROM enrollments)) as students_without_enrollments,
        (SELECT COUNT(*)::INTEGER FROM enrollments WHERE status = 'active') as active_enrollments,
        (SELECT COUNT(*)::INTEGER FROM enrollments WHERE status != 'active') as inactive_enrollments;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 13: Create view for easy monitoring
CREATE OR REPLACE VIEW profile_enrollment_sync_status AS
SELECT 
    p.id as profile_id,
    p.email,
    p.role,
    p.created_at as profile_created_at,
    COUNT(e.id) as total_enrollments,
    COUNT(CASE WHEN e.status = 'active' THEN 1 END) as active_enrollments,
    COUNT(CASE WHEN e.status != 'active' THEN 1 END) as inactive_enrollments,
    MAX(e.enrolled_at) as last_enrollment_date,
    CASE 
        WHEN p.role = 'student' AND COUNT(e.id) = 0 THEN 'needs_enrollment'
        WHEN p.role = 'student' AND COUNT(CASE WHEN e.status = 'active' THEN 1 END) = 0 THEN 'no_active_enrollments'
        WHEN p.role = 'student' AND COUNT(CASE WHEN e.status = 'active' THEN 1 END) > 0 THEN 'enrolled'
        ELSE 'not_student'
    END as enrollment_status
FROM profiles p
LEFT JOIN enrollments e ON p.id = e.user_id
GROUP BY p.id, p.email, p.role, p.created_at
ORDER BY p.created_at DESC;

-- STEP 14: Grant necessary permissions
GRANT SELECT ON profile_enrollment_sync_status TO authenticated;
GRANT EXECUTE ON FUNCTION get_enrollment_statistics() TO authenticated;

-- STEP 15: Add helpful comments
COMMENT ON FUNCTION auto_enroll_new_student() IS 'Automatically enrolls new students in a default course';
COMMENT ON FUNCTION update_course_enrollment_count() IS 'Updates course enrollment counts when enrollments change';
COMMENT ON FUNCTION prevent_profile_deletion_with_enrollments() IS 'Prevents deletion of profiles with active enrollments';
COMMENT ON FUNCTION sync_enrollment_with_profile_status() IS 'Syncs enrollment status when profile status changes';
COMMENT ON FUNCTION maintain_profile_enrollment_integrity() IS 'Maintains data integrity between profiles and enrollments';
COMMENT ON FUNCTION get_enrollment_statistics() IS 'Returns enrollment statistics for monitoring';
COMMENT ON VIEW profile_enrollment_sync_status IS 'View for monitoring profile-enrollment synchronization status';

-- VERIFICATION QUERIES (for manual testing)
-- SELECT * FROM get_enrollment_statistics();
-- SELECT * FROM profile_enrollment_sync_status WHERE enrollment_status = 'needs_enrollment';
-- SELECT course_id, COUNT(*) as enrollments FROM enrollments GROUP BY course_id;