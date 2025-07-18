-- Add missing config column to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}';

-- Create index for config searches
CREATE INDEX IF NOT EXISTS idx_projects_config ON projects USING gin(config);

-- Add missing columns to screenshots table if they don't exist
ALTER TABLE screenshots 
ADD COLUMN IF NOT EXISTS viewport JSONB,
ADD COLUMN IF NOT EXISTS timestamp TEXT,
ADD COLUMN IF NOT EXISTS diff_data JSONB,
ADD COLUMN IF NOT EXISTS diff_image_url TEXT;

-- Create screenshot_history table for tracking changes
CREATE TABLE IF NOT EXISTS screenshot_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    screenshot_id UUID NOT NULL REFERENCES screenshots(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    diff_image_url TEXT,
    pixel_diff INTEGER DEFAULT 0,
    percentage_diff NUMERIC(5,2) DEFAULT 0,
    total_pixels INTEGER DEFAULT 0,
    significant BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for screenshot_history
CREATE INDEX IF NOT EXISTS idx_screenshot_history_screenshot_id ON screenshot_history(screenshot_id);
CREATE INDEX IF NOT EXISTS idx_screenshot_history_created_at ON screenshot_history(created_at);

-- Enable RLS on screenshot_history
ALTER TABLE screenshot_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for screenshot_history
CREATE POLICY "Users can see screenshot history for their projects" ON screenshot_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM screenshots s
            JOIN projects p ON p.id = s.project_id
            WHERE s.id = screenshot_history.screenshot_id 
            AND p.user_id = current_setting('app.current_user_id', true)
        )
    );

CREATE POLICY "Users can insert screenshot history for their projects" ON screenshot_history
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM screenshots s
            JOIN projects p ON p.id = s.project_id
            WHERE s.id = screenshot_history.screenshot_id 
            AND p.user_id = current_setting('app.current_user_id', true)
        )
    );

-- Service role can access everything
CREATE POLICY "Service role has full access to screenshot_history" ON screenshot_history
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Add notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_project_id ON notifications(project_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Enable RLS on notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notifications
CREATE POLICY "Users can see their own notifications" ON notifications
    FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (user_id = current_setting('app.current_user_id', true));

-- Service role can access everything
CREATE POLICY "Service role has full access to notifications" ON notifications
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Add api_keys table if it doesn't exist
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,
    key_prefix TEXT NOT NULL,
    permissions JSONB DEFAULT '{}',
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for api_keys
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_prefix ON api_keys(key_prefix);

-- Enable RLS on api_keys
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for api_keys
CREATE POLICY "Users can see their own api keys" ON api_keys
    FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert their own api keys" ON api_keys
    FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update their own api keys" ON api_keys
    FOR UPDATE USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete their own api keys" ON api_keys
    FOR DELETE USING (user_id = current_setting('app.current_user_id', true));

-- Service role can access everything
CREATE POLICY "Service role has full access to api_keys" ON api_keys
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);