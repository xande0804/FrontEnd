import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { Container } from '../../components/Container';
import { DefaultInput } from '../../components/DefaultInput';
import { Logo } from '../../components/Logo';
import { useAuthContext } from '../../contexts/AuthContext';
import styles from './styles.module.css';
import {
  registerUser,
  forgotPassword,
  resetPassword,
} from '../../services/api';

type ViewMode = 'login' | 'register' | 'recover';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [name, setName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] =
    useState('');

  const [viewMode, setViewMode] =
    useState<ViewMode>('login');
  const [feedbackMessage, setFeedbackMessage] =
    useState('');

    const [recoverEmail, setRecoverEmail] =
    useState('');
  
  const [resetToken, setResetToken] =
    useState('');
  
  const [newPassword, setNewPassword] =
    useState('');
  
  const [generatedToken, setGeneratedToken] =
    useState('');

  useEffect(() => {
    document.title = 'Login - Kratos Pomodoro';
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const isValid = await login(email, password);

    if (!isValid) {
      setFeedbackMessage('Usuário ou senha inválidos.');
      toast.error('Usuário ou senha inválidos.');
      return;
    }

    setFeedbackMessage('Login realizado com sucesso.');
    toast.success('Login realizado com sucesso.');

    navigate('/home');
  }

  async function handleRegisterSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      await registerUser({
        name,
        email: registerEmail,
        password: registerPassword,
      });

      toast.success('Conta criada com sucesso.');

      setName('');
      setRegisterEmail('');
      setRegisterPassword('');

      setViewMode('login');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao criar conta';

      toast.error(message);
    }
  }

  async function handleForgotPasswordSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      const data = await forgotPassword(
        recoverEmail,
      );

      setGeneratedToken(data.resetToken);

      toast.success(
        'Token gerado com sucesso.',
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao recuperar senha';

      toast.error(message);
    }
  }

  async function handleResetPasswordSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      await resetPassword({
        token: resetToken,
        password: newPassword,
      });

      toast.success(
        'Senha redefinida com sucesso.',
      );

      setRecoverEmail('');
      setResetToken('');
      setNewPassword('');
      setGeneratedToken('');

      setViewMode('login');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao redefinir senha';

      toast.error(message);
    }
  }

  function handleRegisterClick() {
    setViewMode('register');
    setFeedbackMessage('');
  }

  function handleRecoverClick() {
    setViewMode('recover');
    setFeedbackMessage(
      'Fluxo de recuperação de senha ainda será implementado.',
    );
  }

  function handleBackToLoginClick() {
    setViewMode('login');
    setFeedbackMessage('');
  }

  return (
    <main className={styles.loginPage}>
      <Container>
        <div className={styles.logoWrapper}>
          <Logo />
        </div>

        <section className={styles.loginCard}>
          {viewMode === 'login' && (
            <>
              <header className={styles.header}>
                <h1>Entrar no Pomodoro</h1>
                <p>
                  Informe suas credenciais para acessar o
                  sistema.
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
                      setPassword(event.target.value)
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
            </>
          )}

          {viewMode === 'register' && (
            <>
              <header className={styles.header}>
                <h1>Criar conta</h1>
                <p>
                  Preencha os dados para se cadastrar.
                </p>
              </header>

              <form
                onSubmit={handleRegisterSubmit}
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
                    value={registerEmail}
                    onChange={event =>
                      setRegisterEmail(
                        event.target.value,
                      )
                    }
                    placeholder='Digite seu e-mail'
                  />
                </div>

                <div className={styles.inputGroup}>
                  <DefaultInput
                    id='register-password'
                    labelText='Senha'
                    type='password'
                    value={registerPassword}
                    onChange={event =>
                      setRegisterPassword(
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
                  onClick={handleBackToLoginClick}
                >
                  Voltar para o login
                </button>
              </div>
            </>
          )}

          {viewMode === 'recover' && (
            <>
              <header className={styles.header}>
                <h1>Recuperar senha</h1>
                <p>
                  Informe seu e-mail para gerar um
                  token de recuperação.
                </p>
              </header>

              <form
                onSubmit={handleForgotPasswordSubmit}
                className={styles.form}
              >
                <div className={styles.inputGroup}>
                  <DefaultInput
                    id='recover-email'
                    labelText='E-mail'
                    type='email'
                    value={recoverEmail}
                    onChange={event =>
                      setRecoverEmail(
                        event.target.value,
                      )
                    }
                    placeholder='Digite seu e-mail'
                  />
                </div>

                <button
                  type='submit'
                  className={styles.submitButton}
                >
                  Gerar Token
                </button>
              </form>

              {generatedToken && (
                <>
                  <p>
                    <strong>Token:</strong>{' '}
                    {generatedToken}
                  </p>

                  <form
                    onSubmit={
                      handleResetPasswordSubmit
                    }
                    className={styles.form}
                  >
                    <div className={styles.inputGroup}>
                      <DefaultInput
                        id='reset-token'
                        labelText='Token'
                        type='text'
                        value={resetToken}
                        onChange={event =>
                          setResetToken(
                            event.target.value,
                          )
                        }
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <DefaultInput
                        id='new-password'
                        labelText='Nova senha'
                        type='password'
                        value={newPassword}
                        onChange={event =>
                          setNewPassword(
                            event.target.value,
                          )
                        }
                      />
                    </div>

                    <button
                      type='submit'
                      className={styles.submitButton}
                    >
                      Redefinir senha
                    </button>
                  </form>
                </>
              )}

              <div className={styles.actions}>
                <button
                  type='button'
                  onClick={handleBackToLoginClick}
                >
                  Voltar para o login
                </button>
              </div>
            </>
          )}

          {feedbackMessage && (
            <p className={styles.feedbackMessage}>
              {feedbackMessage}
            </p>
          )}
        </section>
      </Container>
    </main>
  );
}