// Home Page - Main landing screen
import { getGentleGreeting } from '../utils/dateHelpers';
import DailyFocus from '../components/DailyFocus';
import TaskList from '../components/TaskList';
import './Home.css';

const Home = () => {
    const greeting = getGentleGreeting();

    return (
        <div className="home-page fade-in">
            <header className="home-header">
                <h1 className="app-title">Bloomroom</h1>
                <p className="app-tagline">A soft space to plan, breathe, and grow</p>
            </header>

            <div className="home-greeting">
                <p className="greeting-text">{greeting}</p>
            </div>

            <div className="home-content">
                <section className="home-section">
                    <DailyFocus />
                </section>

                <section className="home-section">
                    <TaskList />
                </section>
            </div>

            <footer className="home-footer">
                <p className="footer-reminder">You're not late. You're growing. 🌸</p>
            </footer>
        </div>
    );
};

export default Home;
