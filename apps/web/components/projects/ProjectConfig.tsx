'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { YamlEditor } from '../yaml/YamlEditor';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { ProjectConfig as ProjectConfigType } from '@docshot/shared';

interface Project {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
}

interface ProjectConfigProps {
  projectId: string;
  userId: string;
}

export function ProjectConfig({ projectId, userId }: ProjectConfigProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentConfig, setCurrentConfig] = useState<string>('');

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch project details
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', userId)
        .single();

      if (projectError) {
        if (projectError.code === 'PGRST116') {
          setError('Project not found or access denied.');
        } else {
          throw projectError;
        }
        return;
      }

      setProject(projectData);

      // Load existing configuration (from project metadata or generate template)
      // For now, we'll start with a template. In a real app, you'd store this in the database
      const existingConfig = generateConfigFromProject(projectData);
      setCurrentConfig(existingConfig);
    } catch (err) {
      console.error('Error loading project:', err);
      setError('Failed to load project details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateConfigFromProject = (project: Project): string => {
    // Generate a basic YAML template based on the project
    return `version: "1.0"
project:
  name: "${project.name}"
  description: "${project.description || 'Automated screenshot monitoring'}"
  defaultViewport:
    width: 1920
    height: 1080
  retryAttempts: 3
  retryDelay: 5000

screenshots:
  - name: "Homepage"
    url: "https://example.com"
    fullPage: true
    enabled: true
    diffThreshold: 0.1
    
  - name: "Navigation Menu"
    url: "https://example.com"
    selector: ".navbar"
    viewport:
      width: 1280
      height: 720

integrations:
  github:
    repo: "owner/repository"
    path: "docs/screenshots"
    branch: "main"
    autoCommit: false
    
settings:
  concurrency: 3
  timeout: 30000
  defaultDiffThreshold: 0.1`;
  };

  const handleSaveConfig = async (config: ProjectConfigType) => {
    try {
      // Save the YAML configuration to the database
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          config: config,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId);

      if (updateError) {
        throw updateError;
      }

      // Create screenshots from the configuration
      await createScreenshotsFromConfig(config);

      // Redirect back to project detail
      router.push(`/projects/${projectId}`);
    } catch (error) {
      console.error('Error saving configuration:', error);
      throw error;
    }
  };

  const createScreenshotsFromConfig = async (config: ProjectConfigType) => {
    try {
      // Delete existing screenshots (optional - or you could merge/update)
      const { error: deleteError } = await supabase
        .from('screenshots')
        .delete()
        .eq('project_id', projectId);

      if (deleteError) {
        console.warn('Warning: Could not delete existing screenshots:', deleteError);
      }

      // Create new screenshots from config
      const screenshotsToInsert = config.screenshots.map((screenshot) => ({
        project_id: projectId,
        name: screenshot.name,
        url: screenshot.url,
        selector: screenshot.selector || null,
        status: 'pending' as const,
      }));

      if (screenshotsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('screenshots')
          .insert(screenshotsToInsert);

        if (insertError) {
          throw insertError;
        }
      }

      // Screenshot jobs will be queued via API endpoints
      // This is handled by the server-side API routes
    } catch (error) {
      console.error('Error creating screenshots from config:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <Link href="/dashboard">
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Link href="/dashboard" className="hover:text-gray-700">
            Dashboard
          </Link>
          <span>/</span>
          <Link href={`/projects/${project.id}`} className="hover:text-gray-700">
            {project.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">Configuration</span>
        </nav>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configure {project.name}</h1>
            <p className="text-gray-600 mt-2">
              Define screenshot monitoring rules and integrations using YAML configuration.
            </p>
          </div>
        </div>
      </div>

      {/* YAML Editor */}
      <YamlEditor
        initialConfig={currentConfig}
        onSave={handleSaveConfig}
        onCancel={() => router.push(`/projects/${projectId}`)}
        projectName={project.name}
        className="mb-8"
      />

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Configuration Help</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>Screenshots:</strong> Define the pages you want to monitor. Each screenshot can
            target a full page or specific element.
          </p>
          <p>
            <strong>Integrations:</strong> Connect with GitHub, Slack, or other services to
            automatically update documentation and send notifications.
          </p>
          <p>
            <strong>Settings:</strong> Configure global settings like concurrency limits, timeouts,
            and default diff thresholds.
          </p>
        </div>
      </div>
    </div>
  );
}
