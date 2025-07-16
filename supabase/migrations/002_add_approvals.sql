-- Add approval status and history to screenshots table
ALTER TABLE screenshots 
ADD COLUMN approval_status VARCHAR(20) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN approved_by TEXT,
ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN rejection_reason TEXT;

-- Create screenshot_diffs table to track visual differences
CREATE TABLE screenshot_diffs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    screenshot_id UUID NOT NULL REFERENCES screenshots(id) ON DELETE CASCADE,
    previous_image_url TEXT NOT NULL,
    current_image_url TEXT NOT NULL,
    diff_image_url TEXT,
    pixel_diff INTEGER NOT NULL DEFAULT 0,
    percentage_diff NUMERIC(5,2) NOT NULL DEFAULT 0,
    total_pixels INTEGER NOT NULL DEFAULT 0,
    significant BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create approval_history table to track all approval actions
CREATE TABLE approval_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    screenshot_id UUID NOT NULL REFERENCES screenshots(id) ON DELETE CASCADE,
    diff_id UUID REFERENCES screenshot_diffs(id) ON DELETE SET NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('approved', 'rejected', 'pending')),
    user_id TEXT NOT NULL,
    reason TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_screenshots_approval_status ON screenshots(approval_status);
CREATE INDEX idx_screenshot_diffs_screenshot_id ON screenshot_diffs(screenshot_id);
CREATE INDEX idx_screenshot_diffs_significant ON screenshot_diffs(significant);
CREATE INDEX idx_approval_history_screenshot_id ON approval_history(screenshot_id);
CREATE INDEX idx_approval_history_user_id ON approval_history(user_id);
CREATE INDEX idx_approval_history_action ON approval_history(action);

-- Create RLS policies for new tables
ALTER TABLE screenshot_diffs ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_history ENABLE ROW LEVEL SECURITY;

-- Screenshot diffs policies (users can see diffs for their projects)
CREATE POLICY "Users can see screenshot diffs for their projects" ON screenshot_diffs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM screenshots s
            JOIN projects p ON p.id = s.project_id
            WHERE s.id = screenshot_diffs.screenshot_id 
            AND p.user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can insert screenshot diffs for their projects" ON screenshot_diffs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM screenshots s
            JOIN projects p ON p.id = s.project_id
            WHERE s.id = screenshot_diffs.screenshot_id 
            AND p.user_id = auth.uid()::text
        )
    );

-- Approval history policies (users can see/modify approval history for their projects)
CREATE POLICY "Users can see approval history for their projects" ON approval_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM screenshots s
            JOIN projects p ON p.id = s.project_id
            WHERE s.id = approval_history.screenshot_id 
            AND p.user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can insert approval history for their projects" ON approval_history
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM screenshots s
            JOIN projects p ON p.id = s.project_id
            WHERE s.id = approval_history.screenshot_id 
            AND p.user_id = auth.uid()::text
        )
    );

-- Function to update screenshot approval status
CREATE OR REPLACE FUNCTION update_screenshot_approval(
    p_screenshot_id UUID,
    p_action TEXT,
    p_user_id TEXT,
    p_reason TEXT DEFAULT NULL,
    p_diff_id UUID DEFAULT NULL
) RETURNS void AS $$
BEGIN
    -- Update screenshot approval status
    UPDATE screenshots 
    SET 
        approval_status = p_action,
        approved_by = CASE WHEN p_action = 'approved' THEN p_user_id ELSE NULL END,
        approved_at = CASE WHEN p_action = 'approved' THEN NOW() ELSE NULL END,
        rejection_reason = CASE WHEN p_action = 'rejected' THEN p_reason ELSE NULL END,
        updated_at = NOW()
    WHERE id = p_screenshot_id;
    
    -- Insert approval history record
    INSERT INTO approval_history (screenshot_id, diff_id, action, user_id, reason)
    VALUES (p_screenshot_id, p_diff_id, p_action, p_user_id, p_reason);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;