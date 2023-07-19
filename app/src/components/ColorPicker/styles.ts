import { TwitterPicker } from 'react-color';
import { styled } from 'styled-components';
import { defaultTheme } from '~/styles/themes/default';

export const ColorPickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  label {
    font-family: ${({ theme }) => theme.fonts.default};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors['gray-700']};
  }
`;

export const StyledColorPicker: typeof TwitterPicker = styled(
  TwitterPicker,
).attrs({
  styles: {
    default: {
      triangle: {
        display: 'none',
      },
      triangleShadow: {
        display: 'none',
      },
      body: {
        width: '100%',
        background: defaultTheme.colors['gray-300'],
      },
      input: {
        background: defaultTheme.colors['gray-300'],
      },
      card: {
        width: '100%',
        boxShadow: 'none',
        borderRadius: '4px',
        borderWidth: `1px`,
        borderStyle: 'solid',
        borderColor: defaultTheme.colors['gray-400'],
      },
    },
  },
})``;
