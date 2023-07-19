import { styled } from 'styled-components';

export const SuccessContainer = styled.div`
  min-height: calc(100vh - 7rem);
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  > header {
    margin-bottom: 2.5rem;

    > h1 {
      font-size: 2rem;
      color: ${({ theme }) => theme.colors['primary-700']};
    }

    > p {
      font-size: 1.25rem;
      color: ${({ theme }) => theme.colors['gray-800']};
    }
  }
`;
