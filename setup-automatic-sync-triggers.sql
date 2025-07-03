-- Automatic Profile-Enrollment Synchronization Triggers
-- Apply this SQL in your Supabase SQL Editor to enable automatic synchronization

-- 1. Function to auto-enroll new students in a default course
CREATE OR REPLACE FUNCTION auto_enroll_new_student()
RETURNS TRIGGER AS $$
DECLARE
    default_course_id UUID;
BEGIN
    -- Only process if this is a new student profile or role changed to student
    IF NEW.role = 'student' AND (OLD IS NULL OR OLD.role != 'student') THEN
        -- Find the cheapest course (price = 0) or first available course
        SELECT id INTO default_course_id
        FROM courses 
        WHERE status = 'published' 
        ORDER BY price ASC, created_at ASC
        LIMIT 1;
        
        -- If we found a course, enroll the student
        IF default_course_id IS NOT NULL THEN
            INSERT INTO enrollments (user_id, course_id, enrolled_at, status, progress)
            VALUES (NEW.id, default_course_id, NOW(), 'active', 0)
            ON CONFLICT (user_id, course_id) DO NOTHING;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create trigger for auto-enrolling new students
DROP TRIGGER IF EXISTS trigger_auto_enroll_new_student ON profiles;
CREATE TRIGGER trigger_auto_enroll_new_student
    AFTER INSERT OR UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION auto_enroll_new_student();

-- 3. Function to update course enrollment counts automatically
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
        )
    WHERE id = target_course_id;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create triggers for enrollment count updates
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

-- 5. Create monitoring view for easy status checking
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

-- 6. Create function to get enrollment statistics
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

-- 7. Ensure proper foreign key constraint
ALTER TABLE enrollments 
DROP CONSTRAINT IF EXISTS enrollments_user_id_fkey;

ALTER TABLE enrollments 
ADD CONSTRAINT enrollments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 9. Grant permissions for the view and function
GRANT SELECT ON profile_enrollment_sync_status TO authenticated;
GRANT EXECUTE ON FUNCTION get_enrollment_statistics() TO authenticated;

-- 10. Add helpful comments
COMMENT ON FUNCTION auto_enroll_new_student() IS 'Automatically enrolls new students in a default course';
COMMENT ON FUNCTION update_course_enrollment_count() IS 'Updates course enrollment counts when enrollments change';
COMMENT ON FUNCTION get_enrollment_statistics() IS 'Returns enrollment statistics for monitoring';
COMMENT ON VIEW profile_enrollment_sync_status IS 'View for monitoring profile-enrollment synchronization status';

-- VERIFICATION QUERIES (uncomment to test):
-- SELECT * FROM get_enrollment_statistics();
-- SELECT * FROM profile_enrollment_sync_status WHERE role = 'student';
-- SELECT course_id, COUNT(*) as enrollments FROM enrollments GROUP BY course_id;