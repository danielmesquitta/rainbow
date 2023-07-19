import { ColorPickerContainer, StyledColorPicker } from './styles';
import { ColorPickerProps } from './types';

export const ColorPicker = ({ label, ...props }: ColorPickerProps) => {
  return (
    <ColorPickerContainer>
      <label>{label}</label>
      <StyledColorPicker {...props} />
    </ColorPickerContainer>
  );
};
