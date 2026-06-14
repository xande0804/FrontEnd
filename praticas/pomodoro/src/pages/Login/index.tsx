import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { Container } from '../../components/Container';
import { DefaultInput } from '../../components/DefaultInput';
import { Logo } from '../../components/Logo';
import { useAuthContext } from '../../contexts/AuthContext';
import styles from './styles.module.css';

type ViewMode = 'login' | 'register' | 'recover';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    document.title = 'Login - Kratos Pomodoro';
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const isValid = login(username, password);

    if (!isValid) {
      setFeedbackMessage('Usuário ou senha inválidos.');
      toast.error('Usuário ou senha inválidos.');
      return;
    }

    setFeedbackMessage('Login realizado com sucesso.');
    toast.success('Login realizado com sucesso.');
    navigate('/home');
  }

  function handleRegisterClick() {
    setViewMode('register');
    setFeedbackMessage('Fluxo de cadastro ainda será implementado.');
    toast.info('Fluxo de cadastro ainda será implementado.');
  }

  function handleRecoverClick() {
    setViewMode('recover');
    setFeedbackMessage('Fluxo de recuperação de senha ainda será implementado.');
    toast.info('Fluxo de recuperação de senha ainda será implementado.');
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
                <p>Informe suas credenciais para acessar o sistema.</p>
              </header>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <DefaultInput
                    id='username'
                    labelText='Usuário'
                    type='text'
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                    placeholder='Digite seu usuário'
                    autoComplete='username'
                  />
                </div>

                <div className={styles.inputGroup}>
                  <DefaultInput
                    id='password'
                    labelText='Senha'
                    type='password'
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    placeholder='Digite sua senha'
                    autoComplete='current-password'
                  />
                </div>

                <button type='submit' className={styles.submitButton}>
                  Entrar
                </button>
              </form>

              <div className={styles.actions}>
                <button type='button' onClick={handleRegisterClick}>
                  Não tem conta? Cadastre-se
                </button>

                <button type='button' onClick={handleRecoverClick}>
                  Esqueci minha senha
                </button>
              </div>
            </>
          )}

          {viewMode === 'register' && (
            <div className={styles.simulationBox}>
              <h1>Tela de cadastro</h1>
              <p>Fluxo de cadastro ainda será implementado.</p>

              <button type='button' onClick={handleBackToLoginClick}>
                Voltar para o login
              </button>
            </div>
          )}

          {viewMode === 'recover' && (
            <div className={styles.simulationBox}>
              <h1>Recuperar senha</h1>
              <p>Fluxo de recuperação de senha ainda será implementado.</p>

              <button type='button' onClick={handleBackToLoginClick}>
                Voltar para o login
              </button>
            </div>
          )}

          {feedbackMessage && (
            <p className={styles.feedbackMessage}>{feedbackMessage}</p>
          )}
        </section>
      </Container>
    </main>
  );
}