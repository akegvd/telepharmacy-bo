import { render, screen } from '@testing-library/react';

import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';

import { ServiceTypeIcon } from './ServiceTypeIcon';

describe('ServiceTypeIcon', () => {
  it('renders the video call icon', () => {
    render(<ServiceTypeIcon serviceType={SERVICE_TYPE.VIDEO_CALL} />);

    expect(screen.getByTestId('VideocamOutlinedIcon')).toBeInTheDocument();
  });

  it('renders the voice call icon', () => {
    render(<ServiceTypeIcon serviceType={SERVICE_TYPE.VOICE_CALL} />);

    expect(screen.getByTestId('PhoneOutlinedIcon')).toBeInTheDocument();
  });

  it('renders the chat icon', () => {
    render(<ServiceTypeIcon serviceType={SERVICE_TYPE.CHAT} />);

    expect(screen.getByTestId('ChatOutlinedIcon')).toBeInTheDocument();
  });

  it('falls back to the unknown icon for an unrecognized service type', () => {
    render(<ServiceTypeIcon serviceType="unknown" />);

    expect(screen.getByTestId('HelpOutlineOutlinedIcon')).toBeInTheDocument();
  });
});
