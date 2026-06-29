-- Payments Table
-- Stores payment transactions for course enrollments

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- References
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE SET NULL,
  
  -- Payment Details
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'INR',
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
  
  -- Payment Method
  payment_method VARCHAR(50), -- e.g., 'stripe', 'razorpay', 'bank_transfer', 'cash'
  payment_gateway_id TEXT, -- External payment gateway transaction ID
  
  -- Transaction Details
  transaction_id TEXT UNIQUE,
  receipt_number TEXT,
  
  -- Additional Information
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  paid_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Audit
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create indexes for performance
CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_payments_course_id ON payments(course_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_payments_enrollment_id ON payments(enrollment_id);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id) WHERE transaction_id IS NOT NULL;

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Students can view their own payments
CREATE POLICY "Students can view their own payments"
  ON payments
  FOR SELECT
  USING (auth.uid() = student_id);

-- Admins can do everything
CREATE POLICY "Admins can do everything with payments"
  ON payments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_payments_updated_at();

-- Auto-populate paid_at when status changes to completed
CREATE OR REPLACE FUNCTION set_payment_paid_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.paid_at = NOW();
  END IF;
  
  IF NEW.status = 'refunded' AND OLD.status != 'refunded' THEN
    NEW.refunded_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payment_status_timestamps
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION set_payment_paid_at();

-- Create a view for payment statistics
CREATE OR REPLACE VIEW payment_stats AS
SELECT
  COUNT(*) FILTER (WHERE status = 'completed') as total_completed_payments,
  COUNT(*) FILTER (WHERE status = 'pending') as total_pending_payments,
  COALESCE(SUM(amount) FILTER (WHERE status = 'completed'), 0) as total_revenue,
  COALESCE(AVG(amount) FILTER (WHERE status = 'completed'), 0) as average_payment,
  COUNT(DISTINCT student_id) FILTER (WHERE status = 'completed') as unique_paying_students,
  COUNT(DISTINCT course_id) FILTER (WHERE status = 'completed') as courses_with_payments
FROM payments;

COMMENT ON TABLE payments IS 'Payment transactions for course enrollments';
COMMENT ON VIEW payment_stats IS 'Aggregated payment statistics for dashboards';
