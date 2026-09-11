import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CategorySection from '@/components/checklist/CategorySection';

describe('category presentation', () => {
  it('shows the category title, progress, and explicit question states', () => {
    render(<CategorySection title="Electrical Autonomy" noteName="notes_electrical" values={{}} fields={[{ name: 'battery_type', label: 'Battery', options: ['LiFePO4', 'AGM'] }, { name: 'has_mppt', label: 'MPPT controller', inputType: 'checkbox' }]} />);
    expect(screen.getByRole('heading', { name: 'Electrical Autonomy' })).toBeTruthy();
    expect(screen.getByText('Not started')).toBeTruthy();
    expect(screen.getByLabelText('Battery')).toBeTruthy();
    expect(screen.getByLabelText('MPPT controller: No')).toBeTruthy();
  });
});