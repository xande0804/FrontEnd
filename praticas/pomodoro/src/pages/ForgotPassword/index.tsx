import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { CopyIcon } from 'lucide-react';

import { Container } from '../../components/Container';
import { DefaultInput } from '../../components/DefaultInput';
import { Logo } from '../../components/Logo';

import {
  forgotPassword,
  resetPassword,
} from '../../services/api';

import styles from './styles.module.css';

export function ForgotPassword() {
  const navigate = useNavigate();

  const [recoverEmail, setRecoverEmail] =
    useState('');

  const [resetToken, setResetToken] =
    useState('');

  const [newPassword, setNewPassword] =
    useState('');

  const [generatedToken, setGeneratedToken] =
    useState('');

  useEffect(() => {
    document.title =
      'Recuperar Senha - Kratos Pomodoro';
  }, []);

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

      navigate('/');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro ao redefinir senha';

      toast.error(message);
    }
  }

  async function handleCopyToken() {
    try {
      await navigator.clipboard.writeText(
        generatedToken,
      );

      toast.success('Token copiado!');
    } catch {
      toast.error('Erro ao copiar token');
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
            <h1>Recuperar senha</h1>

            <p>
              Informe seu e-mail para gerar um
              token de recuperação.
            </p>
          </header>

          <form
            onSubmit={
              handleForgotPasswordSubmit
            }
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
              <div
                className={
                  styles.tokenContainer
                }
              >
                <span
                  className={
                    styles.tokenValue
                  }
                >
                  {generatedToken}
                </span>

                <button
                  type='button'
                  className={
                    styles.copyButton
                  }
                  onClick={
                    handleCopyToken
                  }
                  title='Copiar token'
                  aria-label='Copiar token'
                >
                  <CopyIcon size={18} />
                </button>
              </div>

              <form
                onSubmit={
                  handleResetPasswordSubmit
                }
                className={styles.form}
              >
                <div
                  className={styles.inputGroup}
                >
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

                <div
                  className={styles.inputGroup}
                >
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
              onClick={() => navigate('/')}
            >
              Voltar para login
            </button>
          </div>
        </section>
      </Container>
    </main>
  );
}