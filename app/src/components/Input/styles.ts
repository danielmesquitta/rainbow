import { styled } from 'styled-components';

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  input {
    width: 100%;
    background: ${({ theme }) => theme.colors['gray-300']};
    border: 1px solid ${({ theme }) => theme.colors['gray-400']};
    border-radius: 4px;
    height: 2.625rem;
    padding: 0 0.75rem;

    &:disabled {
      cursor: not-allowed;
    }
  }

  label {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors['gray-700']};
  }

  span {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors['error-300']};
  }
`;
