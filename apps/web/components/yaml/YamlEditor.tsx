'use client';

import { useState, useEffect } from 'react';
import { YamlParser, ProjectConfig } from '@docshot/shared';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface YamlEditorProps {
  initialConfig?: string;
  onSave: (config: ProjectConfig, yamlContent: string) => Promise<void>;
  onCancel?: () => void;
  projectName?: string;
  className?: string;
}

export function YamlEditor({ 
  initialConfig = '', 
  onSave, 
  onCancel, 
  projectName,
  className = ''
}: YamlEditorProps) {
  const [yamlContent, setYamlContent] = useState(initialConfig);
  const [parsedConfig, setParsedConfig] = useState<ProjectConfig | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!yamlContent && !initialConfig) {
      // Load default template if no initial config
      const template = YamlParser.createTemplate();
      setYamlContent(template);
      validateYaml(template);
    } else if (yamlContent) {
      validateYaml(yamlContent);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (yamlContent) {
        validateYaml(yamlContent);
      }
    }, 500); // Debounce validation

    return () => clearTimeout(timeoutId);
  }, [yamlContent]);

  const validateYaml = async (content: string) => {
    if (!content.trim()) {
      setParsedConfig(null);
      setErrors([]);
      setWarnings([]);
      return;
    }

    setIsValidating(true);
    
    try {
      const result = YamlParser.parseProjectConfig(content);
      
      if (result.success && result.data) {
        setParsedConfig(result.data);
        setErrors([]);
        setWarnings(result.warnings || []);
      } else {
        setParsedConfig(null);
        setErrors(result.errors?.map(e => `${e.path}: ${e.message}`) || ['Unknown error']);
        setWarnings([]);
      }
    } catch (error) {
      setParsedConfig(null);
      setErrors([`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
      setWarnings([]);
    }
    
    setIsValidating(false);
  };

  const handleSave = async () => {
    if (!parsedConfig) {
      alert('Please fix the configuration errors before saving.');
      return;
    }

    try {
      setIsSaving(true);
      await onSave(parsedConfig, yamlContent);
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Failed to save configuration. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const insertTemplate = (template: string) => {
    const templates = {
      screenshot: `
- name: "New Screenshot"
  url: "https://example.com"
  selector: ".main-content"
  viewport:
    width: 1920
    height: 1080
  enabled: true`,
      integration: `
integrations:
  github:
    repo: "owner/repository"
    path: "docs/screenshots"
    branch: "main"
  slack:
    webhook: "https://hooks.slack.com/services/..."
    channel: "#screenshots"`
    };

    const templateContent = templates[template as keyof typeof templates];
    if (templateContent) {
      const cursorPosition = yamlContent.length;
      const newContent = yamlContent + '\n' + templateContent;
      setYamlContent(newContent);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {projectName ? `Configure ${projectName}` : 'YAML Configuration'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Define your screenshot monitoring configuration using YAML
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="text-gray-600 hover:text-gray-700"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            
            {isValidating && <LoadingSpinner size="sm" />}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Editor Section */}
        <div className="flex-1 p-6">
          {/* Quick Actions */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Quick Actions:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => insertTemplate('screenshot')}
                className="text-xs"
              >
                + Add Screenshot
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => insertTemplate('integration')}
                className="text-xs"
              >
                + Add Integration
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setYamlContent(YamlParser.createTemplate())}
                className="text-xs"
              >
                Reset to Template
              </Button>
            </div>
          </div>

          {/* YAML Editor */}
          <div className="mb-4">
            <label htmlFor="yaml-editor" className="block text-sm font-medium text-gray-700 mb-2">
              YAML Configuration
            </label>
            <textarea
              id="yaml-editor"
              value={yamlContent}
              onChange={(e) => setYamlContent(e.target.value)}
              className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your YAML configuration here..."
              spellCheck={false}
            />
          </div>

          {/* Validation Results */}
          {(errors.length > 0 || warnings.length > 0) && (
            <div className="space-y-2 mb-4">
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Errors:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-1 h-1 bg-red-500 rounded-full mt-2 mr-2"></span>
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {warnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">Warnings:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {warnings.map((warning, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-1 h-1 bg-yellow-500 rounded-full mt-2 mr-2"></span>
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Status */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-4">
              <span>Lines: {yamlContent.split('\n').length}</span>
              <span>Characters: {yamlContent.length}</span>
              {parsedConfig && (
                <span className="text-green-600">
                  ✓ {parsedConfig.screenshots.length} screenshot{parsedConfig.screenshots.length !== 1 ? 's' : ''} configured
                </span>
              )}
            </div>
            
            {errors.length === 0 && parsedConfig && (
              <span className="text-green-600 text-sm">✓ Valid configuration</span>
            )}
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && parsedConfig && (
          <div className="lg:w-80 border-l border-gray-200 p-6 bg-gray-50">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Configuration Preview</h4>
            
            <div className="space-y-4 text-sm">
              {/* Project Info */}
              <div>
                <h5 className="font-medium text-gray-700">Project</h5>
                <p className="text-gray-600">{parsedConfig.project.name}</p>
                {parsedConfig.project.description && (
                  <p className="text-gray-500 text-xs mt-1">{parsedConfig.project.description}</p>
                )}
              </div>

              {/* Screenshots */}
              <div>
                <h5 className="font-medium text-gray-700">Screenshots ({parsedConfig.screenshots.length})</h5>
                <div className="space-y-2 mt-2">
                  {parsedConfig.screenshots.slice(0, 5).map((screenshot, index) => (
                    <div key={index} className="bg-white rounded p-2 text-xs">
                      <p className="font-medium">{screenshot.name}</p>
                      <p className="text-gray-500 truncate">{screenshot.url}</p>
                      {screenshot.selector && (
                        <p className="text-gray-400">Selector: {screenshot.selector}</p>
                      )}
                    </div>
                  ))}
                  {parsedConfig.screenshots.length > 5 && (
                    <p className="text-gray-500 text-xs">
                      +{parsedConfig.screenshots.length - 5} more...
                    </p>
                  )}
                </div>
              </div>

              {/* Integrations */}
              {parsedConfig.integrations && (
                <div>
                  <h5 className="font-medium text-gray-700">Integrations</h5>
                  <div className="mt-2 space-y-1">
                    {parsedConfig.integrations.github && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        GitHub
                      </span>
                    )}
                    {parsedConfig.integrations.slack && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Slack
                      </span>
                    )}
                    {parsedConfig.integrations.notion && (
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                        Notion
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
        )}
        
        <Button
          onClick={handleSave}
          disabled={isSaving || errors.length > 0 || !parsedConfig}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSaving ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Saving...
            </>
          ) : (
            'Save Configuration'
          )}
        </Button>
      </div>
    </div>
  );
}