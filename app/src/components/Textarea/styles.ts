import { styled } from 'styled-components';

export const TextareaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  textarea {
    width: 100%;
    background: ${({ theme }) => theme.colors['gray-300']};
    border: 1px solid ${({ theme }) => theme.colors['gray-400']};
    border-radius: 4px;
    padding: 0.75rem;
    resize: vertical;

    &:disabled {
      cursor: not-allowed;
    }
  }

  label {
    font-family: ${({ theme }) => theme.fonts.default};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors['gray-700']};
  }
`;
