import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { motion } from 'framer-motion';
import GitHubBtn from './GitHubBtn';
import MyConfetti from './Confetti';

export default function Quiz(props) {
    const [data, setData] = useState(localStorage.getItem('trivia') ? JSON.parse(localStorage.getItem('trivia')) : []);
    const [wrong_answers, setWrong_answers] = useState([])
    const [correct_answers, setCorrect_answers] = useState([])
    const [choices, setChoices] = useState([]);
    const [score, setScore] = useState(0);
    const [submit, setSubmit] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false)
    const [error, setError] = useState(false)
    useEffect(() => {
        apiCall();
    }, [])

    const apiCall = async () => {
        if (localStorage.getItem('trivia')) {
            const data = JSON.parse(localStorage.getItem('trivia'))
            const holder = [];
            const answers = [];
            data.forEach(item => {
                //Creating arrays of objects of user selected choices with options property set to an empty string and updating its state
                const options = {};
                options.id = item.id;
                options.option = " ";
                holder.push(options);
                setChoices(holder);

                //Creating arrays of objects of right answers and updating its state
                const answerObj = {};
                answerObj.id = item.id;
                answerObj.answer = item.correct_answer.replace(/(&#039;)/g, "\"").replace(/(&quot;)/g, "\"");
                answers.push(answerObj);
            })
            setCorrect_answers(answers)


            //Creating array of wrong answers and updating its state
            let originalData = JSON.parse(localStorage.getItem('original'))
            let wrongAnswers = [];

            originalData.forEach(item => {
                item.incorrect_answers.forEach(opt => {
                    wrongAnswers.push(opt.replace(/(&#039;)/g, "\"").replace(/(&quot;)/g, "\""));
                })
                setWrong_answers(wrongAnswers)
            })

        }
        else {
            try {
                const req = await fetch('https://opentdb.com/api.php?amount=10');
                const res = await req.json();

                let arrangeAPI = [];
                let holder = [];
                let answers = []

                //Restructuring api data
                res.results.forEach((item) => {
                    let newObj = {};

                    //Putting all options into one array
                    let options = [];
                    item.incorrect_answers.forEach((option) => {
                        options.push(option.replace(/(&#039;)/g, "\"").replace(/(&quot;)/g, "\""));
                    })

                    //Adding correct_answer into random position to options array
                    options.splice(
                        Math.ceil(Math.random() * item.incorrect_answers.length - 1), 0,
                        item.correct_answer.replace(/(&#039;)/g, "\"").replace(/(&quot;)/g, "\"")
                    );

                    //Pushing all the options into the new object
                    newObj.id = nanoid();
                    newObj.question = item.question.replace(/(&#039;)/g, "\"").replace(/(&quot;)/g, "\"").replace(/(&ldquo;)/g, "\"").replace(/(&rdquo;)/g, "\"").replace(/(&eacute;)/g, "\"").replace(/(&ecirc;)/g, "\"").replace(/(&amp;)/g, "\"");
                    newObj.options = options;

                    newObj.correct_answer = item.correct_answer.replace(/(&#039;)/g, "\"").replace(/(&quot;)/g, "\"").replace(/( &ntilde;)/g, "\"").replace(/(&amp;)/g, "\"");

                    arrangeAPI.push(newObj);

                    //Creating arrays of objects of user choices and updating its state
                    const choicesOptions = {};
                    choicesOptions.id = newObj.id;
                    choicesOptions.option = " ";
                    holder.push(choicesOptions);
                    setChoices(holder)

                    //Creating arrays of objects of right answers and updating its state
                    const answersObj = {};
                    answersObj.id = newObj.id;
                    answersObj.answer = newObj.correct_answer;
                    answers.push(answersObj);
                })

                setCorrect_answers(answers)

                let originalData = res.results;
                let wrongAnswers = [];
                originalData.forEach(item => {
                    item.incorrect_answers.forEach(opt => {
                        wrongAnswers.push(opt.replace(/(&#039;)/g, "\"").replace(/(&quot;)/g, "\""));
                    })
                    setWrong_answers(wrongAnswers)
                })

                //Adding to localStorage
                localStorage.setItem('trivia', JSON.stringify(arrangeAPI));
                localStorage.setItem('original', JSON.stringify(res.results));
                setData(arrangeAPI);

                //Set error status
                setError(false)

            }
            catch {
                alert('Error fetching data from API, please try refreshing the page');
                setError(true);
            }
        }
    }

    //Function for handling user selected answers
    const handleChoices = (e) => {
        const { id, value } = e.target;
        setChoices(prev => {
            return prev.map(obj => {
                return obj.id === id ? { ...obj, option: value } : obj;
            })
        })
    }

    //Making scheme!
    useEffect(() => {
        const labels = document.querySelectorAll('.label');
        const answers = correct_answers;
        const wrongAnswers = wrong_answers
        const userChoices = choices;

        for (let i = 0; i < labels.length; i++) {
            for (let x = 0; x < wrongAnswers.length; x++) {
                for (let y = 0; y < answers.length; y++) {
                    if (labels[i].id === answers[y].id && labels[i].innerText === answers[y].answer) {
                        labels[i].style.background = '#94D7A2'
                        labels[i].style.opacity = '1'
                        labels[i].style.borderWidth = '0'

                    }
                    if (userChoices[y].option === wrongAnswers[x]) {
                        if (labels[i].textContent === userChoices[y].option && labels[i].id === userChoices[y].id) {
                            labels[i].style.background = '#F8BCBC';
                            labels[i].style.borderWidth = '0'
                            labels[i].style.opacity = '1'
                        }
                    }
                }
            }
        }

        countScore()


    }, [submit]);

    //Function for scoring user
    const countScore = () => {
        let holder = [];
        for (let i = 0; i < choices.length; i++) {
            if (choices[i].option === correct_answers[i].answer) {
                holder.push(true)
            }
            else {
                holder.push(false)
            }

        }
        setScore(holder.filter(item => item === true));
    }

    //Checking for handling submit
    const handleSubmit = () => {
        const allChoosen = choices.every(item => item.option !== ' ');
        if (allChoosen) {
            setSubmit(true);
            const labels = document.querySelectorAll('.label');
            for (let i = 0; i < labels.length; i++) {
                labels[i].style.opacity = '0.27'
                labels[i].style.borderWidth = '1'
            }
            setShowResult(true)
        }
        else {
            alert('All questions not answered!');
            setSubmit(false)
        }
    }

    //Function for reset quiz!
    const resetTrivia = () => {
        localStorage.removeItem('trivia');
        localStorage.removeItem('original');
        setChoices([]);
    }

    return (
        <>
            <GitHubBtn />
            {
                score.length > 5 ? <MyConfetti /> : null
            }
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='quiz--container'>
                {
                    data.map(el => {
                        return (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='questions' key={el.id}>
                                <h3>{el.question}</h3>
                                <div className='options--container'>
                                    <form className='options'>
                                        {
                                            el.options.map((opt) => {
                                                return (
                                                    <div className='opt'>
                                                        <input type="radio" name="opt" id={el.id} onClick={(e) => handleChoices(e)} value={opt} className="radio" />
                                                        <label htmlFor="radio" className='label' id={el.id}>{opt}</label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </form>
                                </div>
                            </motion.div>
                        )
                    })
                }
                {!showResult && <button disabled={error && true} onClick={() => handleSubmit()}>Check answers</button>}
                {showResult && <div className='game--ender'>
                    <h3>You scored {score.length}/{correct_answers.length} correct answers</h3>
                    <button onClick={props.setter} onMouseDown={() => resetTrivia()}>Play again</button>
                </div>}
            </motion.section>

        </>
    )
}
/*****************************************************************************
DONE!!!
*******************************************************************************/
