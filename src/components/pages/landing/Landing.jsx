import Header from '../../header/header';
import './Landing.css';

export default function Landing() {
  return (
    <div className="page-container">
      <div className="landing-container">
        <div className="landing-content">
          <Header />
        </div>
      </div>
      <h1 className="landing-title">sushi zen</h1>
    </div>
  );
}