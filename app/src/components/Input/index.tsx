import { forwardRef } from 'react';
import InputMask from 'react-input-mask';
import { InputContainer } from './styles';
import { InputProps } from './types';

export const Input = forwardRef<HTMLInputElement | InputMask, InputProps>(
  ({ id, mask, label, ...props }, ref) => (
    <InputContainer>
      <label htmlFor={id}>{label}</label>

      {mask ? (
        <InputMask
          ref={ref as React.ForwardedRef<InputMask>}
          id={id}
          mask={mask}
          {...props}
        />
      ) : (
        <input
          ref={ref as React.ForwardedRef<HTMLInputElement>}
          id={id}
          {...props}
        />
      )}
    </InputContainer>
  ),
);
