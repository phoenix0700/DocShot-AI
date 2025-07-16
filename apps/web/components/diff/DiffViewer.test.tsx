import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DiffViewer } from './DiffViewer';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

describe('DiffViewer', () => {
  const mockOnClose = jest.fn();
  const mockOnApprove = jest.fn();
  const mockOnReject = jest.fn();

  const defaultProps = {
    currentImageUrl: 'https://example.com/current.png',
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with basic props', () => {
    render(<DiffViewer {...defaultProps} />);
    
    expect(screen.getByText('Screenshot Comparison')).toBeInTheDocument();
    expect(screen.getByText('Side by Side')).toBeInTheDocument();
    expect(screen.getByText('Current Screenshot')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<DiffViewer {...defaultProps} title="Custom Title" />);
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('shows diff data when provided', () => {
    const diffData = {
      pixelDiff: 1000,
      percentageDiff: 2.5,
      totalPixels: 40000,
      significant: true,
      dimensions: { width: 200, height: 200 },
    };

    render(
      <DiffViewer 
        {...defaultProps}
        previousImageUrl="https://example.com/previous.png"
        diffImageUrl="https://example.com/diff.png"
        diffData={diffData}
      />
    );

    expect(screen.getByText('2.50% changed')).toBeInTheDocument();
    expect(screen.getByText('1,000 pixels')).toBeInTheDocument();
    expect(screen.getByText('200×200')).toBeInTheDocument();
  });

  it('shows overlay mode when previous image exists', () => {
    render(
      <DiffViewer 
        {...defaultProps}
        previousImageUrl="https://example.com/previous.png"
        diffData={{
          pixelDiff: 100,
          percentageDiff: 1.0,
          totalPixels: 10000,
          significant: true,
        }}
      />
    );

    expect(screen.getByText('Overlay')).toBeInTheDocument();
  });

  it('shows diff-only mode when diff image exists', () => {
    render(
      <DiffViewer 
        {...defaultProps}
        diffImageUrl="https://example.com/diff.png"
        diffData={{
          pixelDiff: 100,
          percentageDiff: 1.0,
          totalPixels: 10000,
          significant: true,
        }}
      />
    );

    expect(screen.getByText('Diff Only')).toBeInTheDocument();
  });

  it('shows approve/reject buttons when handlers provided', () => {
    render(
      <DiffViewer 
        {...defaultProps}
        previousImageUrl="https://example.com/previous.png"
        diffData={{
          pixelDiff: 100,
          percentageDiff: 1.0,
          totalPixels: 10000,
          significant: true,
        }}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    expect(screen.getByText('Approve Changes')).toBeInTheDocument();
    expect(screen.getByText('Reject Changes')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    render(<DiffViewer {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onApprove when approve button clicked', () => {
    render(
      <DiffViewer 
        {...defaultProps}
        previousImageUrl="https://example.com/previous.png"
        diffData={{
          pixelDiff: 100,
          percentageDiff: 1.0,
          totalPixels: 10000,
          significant: true,
        }}
        onApprove={mockOnApprove}
      />
    );

    const approveButton = screen.getByText('Approve Changes');
    fireEvent.click(approveButton);
    
    expect(mockOnApprove).toHaveBeenCalledTimes(1);
  });

  it('shows metadata when provided', () => {
    const screenshotMetadata = {
      url: 'https://example.com/test',
      selector: '.test-selector',
      timestamp: '2023-01-01T00:00:00Z',
      viewport: '1920x1080',
    };

    render(
      <DiffViewer 
        {...defaultProps}
        screenshotMetadata={screenshotMetadata}
      />
    );

    expect(screen.getByText('📍 https://example.com/test')).toBeInTheDocument();
    expect(screen.getByText('.test-selector')).toBeInTheDocument();
  });

  it('shows statistics footer when diff data provided', () => {
    const diffData = {
      pixelDiff: 1000,
      percentageDiff: 2.5,
      totalPixels: 40000,
      significant: true,
    };

    render(
      <DiffViewer 
        {...defaultProps}
        previousImageUrl="https://example.com/previous.png"
        diffData={diffData}
      />
    );

    expect(screen.getByText('Total Pixels')).toBeInTheDocument();
    expect(screen.getByText('40,000')).toBeInTheDocument();
    expect(screen.getByText('Changed Pixels')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('Difference')).toBeInTheDocument();
    expect(screen.getByText('2.50%')).toBeInTheDocument();
  });

  it('changes view mode when tabs clicked', () => {
    render(
      <DiffViewer 
        {...defaultProps}
        previousImageUrl="https://example.com/previous.png"
        diffImageUrl="https://example.com/diff.png"
        diffData={{
          pixelDiff: 100,
          percentageDiff: 1.0,
          totalPixels: 10000,
          significant: true,
        }}
      />
    );

    // Click overlay tab
    const overlayTab = screen.getByText('Overlay');
    fireEvent.click(overlayTab);
    
    expect(screen.getByText('Overlay Comparison')).toBeInTheDocument();

    // Click diff-only tab
    const diffOnlyTab = screen.getByText('Diff Only');
    fireEvent.click(diffOnlyTab);
    
    expect(screen.getByText('Visual Differences')).toBeInTheDocument();
  });

  it('updates zoom level when zoom controls used', () => {
    render(<DiffViewer {...defaultProps} />);
    
    // Find zoom controls
    const zoomInButton = screen.getByRole('button', { name: /zoom in/i });
    const zoomOutButton = screen.getByRole('button', { name: /zoom out/i });
    const resetButton = screen.getByText('Reset');
    
    // Initial zoom should be 100%
    expect(screen.getByText('100%')).toBeInTheDocument();
    
    // Test zoom in
    fireEvent.click(zoomInButton);
    expect(screen.getByText('125%')).toBeInTheDocument();
    
    // Test zoom out
    fireEvent.click(zoomOutButton);
    expect(screen.getByText('100%')).toBeInTheDocument();
    
    // Test reset
    fireEvent.click(zoomInButton);
    fireEvent.click(resetButton);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});