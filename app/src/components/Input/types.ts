export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  mask?: string | (string | RegExp)[];

  label: string;
};
