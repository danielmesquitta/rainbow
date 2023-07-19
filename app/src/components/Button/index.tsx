import { ButtonContainer } from './styles';
import { ButtonProps } from './types';

export const Button = ({ children, ...props }: ButtonProps) => (
  <ButtonContainer {...props}>{children}</ButtonContainer>
);
