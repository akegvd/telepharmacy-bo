import { screen, within } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event';

/**
 * MUI's DatePicker renders an accessible field — a `group` of editable date sections plus a
 * hidden input — instead of a single text input, so `getByLabelText` matches more than one
 * element. Tests address the field by its `group` role and type digits into its sections,
 * which auto-advance from month to day to year.
 */
export const getDateField = (label: string): HTMLElement => screen.getByRole('group', { name: label });

export const typeDateField = async (user: UserEvent, label: string, digits: string): Promise<void> => {
  const monthSection = within(getDateField(label)).getByRole('spinbutton', { name: 'Month' });

  await user.click(monthSection);
  await user.keyboard(digits);
};
