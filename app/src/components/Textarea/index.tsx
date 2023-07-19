import { forwardRef } from 'react';
import { TextareaContainer } from './styles';
import { TextareaProps } from './types';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ id, label, ...props }, ref) => (
    <TextareaContainer>
      <label htmlFor={id}>{label}</label>

      <textarea ref={ref} id={id} {...props} />
    </TextareaContainer>
  ),
);
