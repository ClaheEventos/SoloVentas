import EventForm from './components/EventForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <header>
        <h1>Solo Ventas</h1>
      </header>

      <main>
        <EventForm />
      </main>
    </div>
  );
}

export default App;