import './Home.css';
import Hero from './Hero/Hero';
import Programs from './Programs/Programs';
import Reasons from './Reasons/Reasons';

function Home() {
  return (
    <div className="App">
          <Hero/>
          <Programs/>
          <Reasons/>
    </div>
  );
}

export default Home;