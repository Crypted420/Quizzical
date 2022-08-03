import { motion, AnimatePresence } from 'framer-motion'
import GitHubBtn from './GitHubBtn'

export default function Start({ setter }) {
    return (
        <AnimatePresence>
            <GitHubBtn />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='wel--page'>
                <h1>Quizzical</h1>
                <p>Take a quick on random topics</p>
                <button onClick={setter}>Start quiz</button>
            </motion.div>
        </AnimatePresence>
    )
}
