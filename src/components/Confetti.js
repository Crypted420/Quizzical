import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti';

function MyConfetti() {
    const { width, height } = useWindowSize()
    return (
        <div className='confetti'>
            <Confetti
                width={width}
                height={height}
            />
        </div>
    )
}

export default MyConfetti