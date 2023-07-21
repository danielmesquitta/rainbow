export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  mask?: string | (string | RegExp)[];
  error?: string;
  label: string;
};
