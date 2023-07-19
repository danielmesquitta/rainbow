import { AxiosError } from 'axios';

export const formatError = (
  err: AxiosError<{ message?: string | string[] }>,
) => {
  const { message } = err?.response?.data || {};

  if (Array.isArray(message)) {
    return message.join('\n');
  }

  if (typeof message === 'string') {
    return message;
  }

  return 'Falha ao realizar a operação.';
};
