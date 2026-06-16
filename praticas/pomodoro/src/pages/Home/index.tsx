import { useEffect } from 'react';
import { Container } from '../../components/Container';
import { CountDown } from '../../components/CountDown';
import { MainForm } from '../../components/MainForm';
import { Welcome } from '../../components/Welcome';
import { MainTemplate } from '../../templates/MainTemplate';

export function Home() {
  useEffect(() => {
    document.title = 'Kratos Pomodoro';
  }, []);

  return (
    <MainTemplate>
      <Container>
        <Welcome />
      </Container>

      <Container>
        <CountDown />
      </Container>

      <Container>
        <MainForm />
      </Container>
    </MainTemplate>
  );
}