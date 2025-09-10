import React from 'react';
import { render, screen } from '@testing-library/react';
import CapitalLeafLogo from '@/components/CapitalLeafLogo';

describe('CapitalLeafLogo', () => {
  it('renders with default props', () => {
    render(<CapitalLeafLogo />);
    expect(screen.getByText('Capital')).toBeInTheDocument();
    expect(screen.getByText('Leaf')).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<CapitalLeafLogo variant="light" />);
    expect(screen.getByText('Capital')).toBeInTheDocument();

    rerender(<CapitalLeafLogo variant="dark" />);
    expect(screen.getByText('Capital')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<CapitalLeafLogo size="sm" />);
    expect(screen.getByText('Capital')).toBeInTheDocument();

    rerender(<CapitalLeafLogo size="lg" />);
    expect(screen.getByText('Capital')).toBeInTheDocument();
  });

  it('renders with subtitle when showSubtitle is true', () => {
    render(
      <CapitalLeafLogo 
        showSubtitle={true} 
        subtitle="Test Subtitle" 
      />
    );
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('does not render subtitle when showSubtitle is false', () => {
    render(<CapitalLeafLogo showSubtitle={false} />);
    expect(screen.queryByText('Dynamic Defense with Microservice Isolation')).not.toBeInTheDocument();
  });
});
