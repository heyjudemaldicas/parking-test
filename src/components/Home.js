import './Home.css';

function HomePrompt({goToPark, goToUnpark}) {
    return (
      <div className="home-prompt">
        <h2>Welcome to XXX Mall.</h2>
        <div>What do you want to do?</div>
        <div className="button-container">
            <button onClick={goToPark}>Park</button>
            <button onClick={goToUnpark}>Unpark</button>
        </div>
      </div>
    );
  }
  
  export default HomePrompt;
  