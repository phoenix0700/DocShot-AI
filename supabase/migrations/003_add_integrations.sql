-- Add config field to projects table for storing YAML configuration
ALTER TABLE projects
ADD COLUMN config JSONB;

-- Add GitHub URL field to screenshots table
ALTER TABLE screenshots
ADD COLUMN github_url TEXT;

-- Add integration_status to track integration sync status
ALTER TABLE screenshots
ADD COLUMN integration_status JSONB DEFAULT '{}';

-- Create an index on project config for faster queries
CREATE INDEX idx_projects_config ON projects USING GIN(config);

-- Update RLS policies to include new fields
-- The existing policies should already cover these fields since they use SELECT *