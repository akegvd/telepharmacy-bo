import { render, screen } from '@testing-library/react';

import { ChatMessage } from './ChatMessage';

describe('ChatMessage', () => {
  it('renders a user message', () => {
    render(<ChatMessage message={{ id: '1', role: 'user', content: 'How many tasks are pending?' }} />);

    expect(screen.getByText('How many tasks are pending?')).toBeInTheDocument();
  });

  it('renders an assistant message', () => {
    render(<ChatMessage message={{ id: '2', role: 'assistant', content: 'There are 3 pending tasks.' }} />);

    expect(screen.getByText('There are 3 pending tasks.')).toBeInTheDocument();
  });
});
