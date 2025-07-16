import yaml from 'js-yaml';
import { z } from 'zod';
import { ProjectConfigSchema, ScreenshotConfigSchema } from './schemas';

export interface ValidationError {
  path: string;
  message: string;
  code: string;
}

export interface ParseResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
  warnings?: string[];
}

export class YamlParser {
  private static formatZodError(error: z.ZodError): ValidationError[] {
    return error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
      code: err.code,
    }));
  }

  static parseYaml<T>(yamlContent: string, schema: z.ZodSchema<T>): ParseResult<T> {
    try {
      // Parse YAML
      const parsed = yaml.load(yamlContent) as unknown;

      // Validate against schema
      const result = schema.safeParse(parsed);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          warnings: this.generateWarnings(result.data),
        };
      } else {
        return {
          success: false,
          errors: this.formatZodError(result.error),
        };
      }
    } catch (error) {
      return {
        success: false,
        errors: [
          {
            path: 'root',
            message: error instanceof Error ? error.message : 'Failed to parse YAML',
            code: 'yaml_parse_error',
          },
        ],
      };
    }
  }

  static parseProjectConfig(yamlContent: string) {
    return this.parseYaml(yamlContent, ProjectConfigSchema);
  }

  static parseScreenshotConfig(yamlContent: string) {
    return this.parseYaml(yamlContent, ScreenshotConfigSchema);
  }

  static generateYaml<T>(data: T): string {
    return yaml.dump(data, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
      sortKeys: false,
    });
  }

  private static generateWarnings(data: any): string[] {
    const warnings: string[] = [];

    // Check for common issues
    if (data.screenshots) {
      data.screenshots.forEach((screenshot: any, index: number) => {
        // Warn about long wait times
        if (screenshot.waitFor && Array.isArray(screenshot.waitFor)) {
          screenshot.waitFor.forEach((wait: any) => {
            if (wait.type === 'timeout' && wait.value > 10000) {
              warnings.push(
                `Screenshot ${index + 1} (${screenshot.name}): Wait timeout of ${wait.value}ms is quite long`
              );
            }
          });
        }

        // Warn about missing selectors for element screenshots
        if (screenshot.selector && !screenshot.selector.trim()) {
          warnings.push(`Screenshot ${index + 1} (${screenshot.name}): Empty selector provided`);
        }

        // Warn about very low diff thresholds
        if (screenshot.diffThreshold !== undefined && screenshot.diffThreshold < 0.01) {
          warnings.push(
            `Screenshot ${index + 1} (${screenshot.name}): Very low diff threshold (${screenshot.diffThreshold}%) may cause false positives`
          );
        }

        // Warn about potentially slow URLs
        if (screenshot.url.includes('localhost') || screenshot.url.includes('127.0.0.1')) {
          warnings.push(
            `Screenshot ${index + 1} (${screenshot.name}): Using localhost URL may not work in production`
          );
        }
      });
    }

    // Warn about missing integrations
    if (!data.integrations || Object.keys(data.integrations).length === 0) {
      warnings.push('No integrations configured - screenshots will only be stored locally');
    }

    return warnings;
  }

  static validateAndNormalizeConfig(config: any) {
    // Pre-processing to handle common format variations
    const normalized = this.normalizeConfig(config);
    return this.parseProjectConfig(yaml.dump(normalized));
  }

  private static normalizeConfig(config: any): any {
    const normalized = { ...config };

    // Normalize version format
    if (normalized.version && typeof normalized.version === 'number') {
      normalized.version = normalized.version.toString();
    }

    // Ensure screenshots is an array
    if (normalized.screenshots && !Array.isArray(normalized.screenshots)) {
      normalized.screenshots = [normalized.screenshots];
    }

    // Normalize screenshot configurations
    if (normalized.screenshots) {
      normalized.screenshots = normalized.screenshots.map((screenshot: any) => {
        const normalizedScreenshot = { ...screenshot };

        // Handle relative URLs
        if (
          normalized.project?.baseUrl &&
          normalizedScreenshot.url &&
          !normalizedScreenshot.url.startsWith('http')
        ) {
          const baseUrl = normalized.project.baseUrl.replace(/\/$/, '');
          const path = normalizedScreenshot.url.startsWith('/')
            ? normalizedScreenshot.url
            : `/${normalizedScreenshot.url}`;
          normalizedScreenshot.url = `${baseUrl}${path}`;
        }

        // Normalize wait conditions
        if (normalizedScreenshot.waitFor && typeof normalizedScreenshot.waitFor === 'string') {
          normalizedScreenshot.waitFor = {
            type: 'selector',
            value: normalizedScreenshot.waitFor,
          };
        }

        // Normalize viewport
        if (normalizedScreenshot.viewport && Array.isArray(normalizedScreenshot.viewport)) {
          const [width, height] = normalizedScreenshot.viewport;
          normalizedScreenshot.viewport = { width, height };
        }

        return normalizedScreenshot;
      });
    }

    return normalized;
  }

  static createTemplate(): string {
    const template = {
      version: '1.0',
      project: {
        name: 'My Project',
        description: 'Screenshot monitoring for my project',
        baseUrl: 'https://example.com',
        defaultViewport: {
          width: 1920,
          height: 1080,
        },
        retryAttempts: 3,
        retryDelay: 5000,
      },
      screenshots: [
        {
          name: 'Homepage',
          url: '/',
          fullPage: true,
          enabled: true,
          diffThreshold: 0.1,
        },
        {
          name: 'Navigation Menu',
          url: '/',
          selector: '.navbar',
          viewport: {
            width: 1280,
            height: 720,
          },
        },
      ],
      integrations: {
        github: {
          repo: 'owner/repository',
          path: 'docs/screenshots',
          branch: 'main',
          autoCommit: false,
        },
        slack: {
          webhook: 'https://hooks.slack.com/services/...',
          channel: '#screenshots',
        },
      },
      settings: {
        concurrency: 3,
        timeout: 30000,
        defaultDiffThreshold: 0.1,
      },
    };

    return this.generateYaml(template);
  }

  // Utility method to merge configs (useful for overrides)
  static mergeConfigs(baseConfig: any, overrideConfig: any): any {
    const merged = { ...baseConfig };

    // Merge project settings
    if (overrideConfig.project) {
      merged.project = { ...merged.project, ...overrideConfig.project };
    }

    // Merge screenshots (by name)
    if (overrideConfig.screenshots) {
      const baseScreenshots = merged.screenshots || [];
      const overrideScreenshots = overrideConfig.screenshots;

      merged.screenshots = baseScreenshots.map((base: any) => {
        const override = overrideScreenshots.find((o: any) => o.name === base.name);
        return override ? { ...base, ...override } : base;
      });

      // Add new screenshots
      const newScreenshots = overrideScreenshots.filter(
        (o: any) => !baseScreenshots.some((b: any) => b.name === o.name)
      );
      merged.screenshots.push(...newScreenshots);
    }

    // Merge integrations
    if (overrideConfig.integrations) {
      merged.integrations = { ...merged.integrations, ...overrideConfig.integrations };
    }

    // Merge settings
    if (overrideConfig.settings) {
      merged.settings = { ...merged.settings, ...overrideConfig.settings };
    }

    return merged;
  }
}

// Type exports for convenience
export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;
export type ScreenshotConfig = z.infer<typeof ScreenshotConfigSchema>;
export type ValidationResult<T> = ParseResult<T>;
