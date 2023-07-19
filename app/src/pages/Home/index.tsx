import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Button } from '~/components/Button';
import { ColorPicker } from '~/components/ColorPicker';
import { Input } from '~/components/Input';
import { Textarea } from '~/components/Textarea';
import { api } from '~/utils/api';
import { formatError } from '~/utils/formatError';
import { FormContainer, FormFooter, FormGrid, HomeContainer } from './styles';

const colors = {
  RED: '#E81416',
  ORANGE: '#FFA500',
  YELLOW: '#FAEB36',
  GREEN: '#79C314',
  BLUE: '#487DE7',
  INDIGO: '#4B369D',
  VIOLET: '#70369D',
} as const;

const userFormValidationSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  email: z
    .string()
    .email('Formato de e-mail inválido')
    .min(1, 'O e-mail é obrigatório'),
  document: z
    .string()
    .regex(
      /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      'O CPF deve ter o formato XXX.XXX.XXX-XX',
    )
    .min(1, 'O CPF é obrigatório'),
  favoriteColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Cor inválida')
    .min(1, 'A sua cor favorita é obrigatória'),
  observations: z.string(),
});

type UserFormData = z.infer<typeof userFormValidationSchema>;

const Home = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormValidationSchema),
    defaultValues: {
      favoriteColor: colors.RED,
    },
  });

  const favoriteColor = watch('favoriteColor');

  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      toast.error('Falha na validação, verifique os campos e tente novamente');
    }
  }, [errors]);

  const handleFormSubmit: SubmitHandler<UserFormData> = (data) => {
    api
      .post('/users', data)
      .then(() => {
        navigate('/success');
      })
      .catch((err) => {
        toast.error(formatError(err));
      });
  };

  return (
    <HomeContainer>
      <h2>Formulário</h2>

      <FormContainer onSubmit={handleSubmit(handleFormSubmit)}>
        <header>
          <p>Preencha os dados a seguir:</p>
        </header>

        <FormGrid>
          <Input
            label="Nome"
            type="text"
            placeholder="Nome completo"
            required
            {...register('name')}
          />

          <Input
            label="CPF"
            mask="999.999.999-99"
            type="text"
            placeholder="Documento de identidade CPF"
            required
            {...register('document')}
          />

          <Input
            label="E-mail"
            type="email"
            placeholder="Seu melhor e-mail"
            required
            {...register('email')}
          />

          <Textarea
            label="Observações"
            placeholder="Deixe aqui suas observações"
            rows={5}
            {...register('observations')}
          />

          <ColorPicker
            label="Cor favorita"
            color={favoriteColor}
            onChange={({ hex }) => setValue('favoriteColor', hex)}
            colors={Object.values(colors)}
          />
        </FormGrid>

        <FormFooter>
          <Button type="submit">Enviar</Button>
        </FormFooter>
      </FormContainer>
    </HomeContainer>
  );
};

export default Home;
