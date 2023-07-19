import styled from 'styled-components';

export const HomeContainer = styled.div`
  gap: 2rem;
  padding: 2.5rem 0;
  max-width: 40rem;
  margin: 0 auto;

  h2 {
    font-weight: 700;
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }
`;

export const FormContainer = styled.form`
  padding: 2.5rem;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors['gray-200']};
  color: ${({ theme }) => theme.colors['gray-700']};

  header {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
  }
`;

export const FormGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  column-gap: 0.75rem;
  row-gap: 1rem;
`;

export const FormFooter = styled.footer`
  padding-top: 2rem;

  button {
    margin-left: auto;
  }
`;
