import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { Container } from '../../components/Container';
import { DefaultInput } from '../../components/DefaultInput';
import { Logo } from '../../components/Logo';

import { useAuthContext } from '../../contexts/AuthContext';

import styles from './styles.module.css';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedbackMessage, setFeedbackMessage] =
    useState('');

  useEffect(() => {
    document.title = 'Login - Kratos Pomodoro';
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const isValid = await login(
      email,
      password,
    );

    if (!isValid) {
      setFeedbackMessage(
        'Usuário ou senha inválidos.',
      );

      toast.error(
        'Usuário ou senha inválidos.',
      );

      return;
    }

    setFeedbackMessage(
      'Login realizado com sucesso.',
    );

    toast.success(
      'Login realizado com sucesso.',
    );

    navigate('/home');
  }

  function handleRegisterClick() {
    navigate('/register');
  }

  function handleRecoverClick() {
    navigate('/forgot-password');
  }

  return (
    <main className={styles.loginPage}>
      <Container>
        <div className={styles.logoWrapper}>
          <Logo />
        </div>

        <section className={styles.loginCard}>
          <header className={styles.header}>
            <h1>Entrar no Pomodoro</h1>

            <p>
              Informe suas credenciais para
              acessar o sistema.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className={styles.form}
          >
            <div className={styles.inputGroup}>
              <DefaultInput
                id='email'
                labelText='E-mail'
                type='email'
                value={email}
                onChange={event =>
                  setEmail(event.target.value)
                }
                placeholder='Digite seu e-mail'
                autoComplete='email'
              />
            </div>

            <div className={styles.inputGroup}>
              <DefaultInput
                id='password'
                labelText='Senha'
                type='password'
                value={password}
                onChange={event =>
                  setPassword(
                    event.target.value,
                  )
                }
                placeholder='Digite sua senha'
                autoComplete='current-password'
              />
            </div>

            <button
              type='submit'
              className={styles.submitButton}
            >
              Entrar
            </button>
          </form>

          <div className={styles.actions}>
            <button
              type='button'
              onClick={handleRegisterClick}
            >
              Não tem conta? Cadastre-se
            </button>

            <button
              type='button'
              onClick={handleRecoverClick}
            >
              Esqueci minha senha
            </button>
          </div>

          {feedbackMessage && (
            <p
              className={
                styles.feedbackMessage
              }
            >
              {feedbackMessage}
            </p>
          )}
        </section>
      </Container>
    </main>
  );
}