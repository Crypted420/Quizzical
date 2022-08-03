import './styles/main.css'
import Start from './components/Start';
import Quiz from './components/Quiz';
import { useState } from 'react';

function App() {
    const [starter, setStarter] = useState(true);

    const setter = () => {
        setStarter(prev => !prev);
    }

    return (
        <div>
            {starter && <Start setter={() => setter()} />}
            {!starter && <Quiz setter={() => setter()} />}
        </div>
    )
}

export default App;