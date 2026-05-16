import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import UploadScreen from './UploadScreen';

const mockSettings = {
  carBrand: 'Polestar',
  carModel: '2',
  elecCost: 0.28,
  petrolCost: 1.43,
  gridCO2: 212,
  petrolCO2: 404,
};

describe('UploadScreen', () => {
  it('renders the title', () => {
    render(
      <UploadScreen
        settings={mockSettings}
        onSettingsChange={() => {}}
        onUpload={() => {}}
        onDemo={() => {}}
        loading={false}
        error={null}
      />
    );
    expect(screen.getByText('EV Journey Analyzer')).toBeInTheDocument();
  });

  it('renders the upload drop zone', () => {
    render(
      <UploadScreen
        settings={mockSettings}
        onSettingsChange={() => {}}
        onUpload={() => {}}
        onDemo={() => {}}
        loading={false}
        error={null}
      />
    );
    expect(screen.getByText(/Drop your CSV file here or click to browse/)).toBeInTheDocument();
  });

  it('renders the demo data button', () => {
    render(
      <UploadScreen
        settings={mockSettings}
        onSettingsChange={() => {}}
        onUpload={() => {}}
        onDemo={() => {}}
        loading={false}
        error={null}
      />
    );
    expect(screen.getByText(/Try with demo data/)).toBeInTheDocument();
  });

  it('renders the settings toggle', () => {
    render(
      <UploadScreen
        settings={mockSettings}
        onSettingsChange={() => {}}
        onUpload={() => {}}
        onDemo={() => {}}
        loading={false}
        error={null}
      />
    );
    expect(screen.getByText(/Your Vehicle & Costs/)).toBeInTheDocument();
  });

  it('renders feature badges', () => {
    render(
      <UploadScreen
        settings={mockSettings}
        onSettingsChange={() => {}}
        onUpload={() => {}}
        onDemo={() => {}}
        loading={false}
        error={null}
      />
    );
    expect(screen.getByText('Detailed Statistics')).toBeInTheDocument();
    expect(screen.getByText('Interactive Map')).toBeInTheDocument();
    expect(screen.getByText('Trend Analysis')).toBeInTheDocument();
    expect(screen.getByText('Battery Insights')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <UploadScreen
        settings={mockSettings}
        onSettingsChange={() => {}}
        onUpload={() => {}}
        onDemo={() => {}}
        loading={true}
        error={null}
      />
    );
    expect(screen.getByText(/Analyzing your journeys/)).toBeInTheDocument();
  });

  it('shows error message when provided', () => {
    render(
      <UploadScreen
        settings={mockSettings}
        onSettingsChange={() => {}}
        onUpload={() => {}}
        onDemo={() => {}}
        loading={false}
        error="Something went wrong"
      />
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('calls onDemo when demo button is clicked', async () => {
    const onDemo = vi.fn();
    render(
      <UploadScreen
        settings={mockSettings}
        onSettingsChange={() => {}}
        onUpload={() => {}}
        onDemo={onDemo}
        loading={false}
        error={null}
      />
    );
    const demoBtn = screen.getByText(/Try with demo data/);
    demoBtn.click();
    expect(onDemo).toHaveBeenCalled();
  });

  it('demo button is disabled when loading', () => {
    render(
      <UploadScreen
        settings={mockSettings}
        onSettingsChange={() => {}}
        onUpload={() => {}}
        onDemo={() => {}}
        loading={true}
        error={null}
      />
    );
    expect(screen.getByText(/Try with demo data/).closest('button')).toBeDisabled();
  });

  it('renders the car illustration SVG', () => {
    render(
      <UploadScreen
        settings={mockSettings}
        onSettingsChange={() => {}}
        onUpload={() => {}}
        onDemo={() => {}}
        loading={false}
        error={null}
      />
    );
    const svg = document.querySelector('.car-illustration svg');
    expect(svg).toBeInTheDocument();
  });
});
