import styles from './styles.module.css';
import { useAuthContext } from '../../contexts/AuthContext';

export function Welcome() {
    const { user } = useAuthContext();

    return (
        <div className={styles.container}>
            <h2>
                Olá, {user?.name}!
            </h2>

            <p>
                Bem-vindo ao Kratos Pomodoro.
            </p>
        </div>
    );
}