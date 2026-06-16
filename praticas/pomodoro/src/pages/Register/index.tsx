import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { Container } from '../../components/Container';
import { DefaultInput } from '../../components/DefaultInput';
import { Logo } from '../../components/Logo';

import { registerUser } from '../../services/api';

import styles from '../Login/styles.module.css';

export function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] =
    useState('');

  useEffect(() => {
    document.title =
      'Cadastro - Kratos Pomodoro';
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      await registerUser({
        name,
        email,
        password,
      });

      toast.success(
        'Conta criada com sucesso.',
      );

      navigate('/');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao criar conta';

      toast.error(message);
    }
  }

  return (
    <main className={styles.loginPage}>
      <Container>
        <div className={styles.logoWrapper}>
          <Logo />
        </div>

        <section className={styles.loginCard}>
          <header className={styles.header}>
            <h1>Criar conta</h1>

            <p>
              Preencha os dados para se
              cadastrar.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className={styles.form}
          >
            <div className={styles.inputGroup}>
              <DefaultInput
                id='register-name'
                labelText='Nome'
                type='text'
                value={name}
                onChange={event =>
                  setName(event.target.value)
                }
                placeholder='Digite seu nome'
              />
            </div>

            <div className={styles.inputGroup}>
              <DefaultInput
                id='register-email'
                labelText='E-mail'
                type='email'
                value={email}
                onChange={event =>
                  setEmail(event.target.value)
                }
                placeholder='Digite seu e-mail'
              />
            </div>

            <div className={styles.inputGroup}>
              <DefaultInput
                id='register-password'
                labelText='Senha'
                type='password'
                value={password}
                onChange={event =>
                  setPassword(
                    event.target.value,
                  )
                }
                placeholder='Digite sua senha'
              />
            </div>

            <button
              type='submit'
              className={styles.submitButton}
            >
              Criar conta
            </button>
          </form>

          <div className={styles.actions}>
            <button
              type='button'
              onClick={() => navigate('/')}
            >
              Voltar para o login
            </button>
          </div>
        </section>
      </Container>
    </main>
  );
}