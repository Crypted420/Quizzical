import React, { useEffect, useState } from 'react'

export default function Quiz() {
    const [questions, setQuestions] = useState([])

    useEffect(() => {
        const fetchTrivia = async () => {
            const api = await fetch('https://opentdb.com/api.php?amount=10');
            const res = await api.json();
            setQuestions(res.results);
        }
        fetchTrivia()
    }, []);
    const createElement = questions.map((q) => {
        const optArr = q.incorrect_answers;
        optArr.splice(Math.ceil(Math.random() * optArr.length - 1), 0, q.correct_answer)
        const createOptions = optArr.map((el, index) => {
            return (
                <p key={index}>{el}</p>
            )
        })
        return (
            <div className='questions' key={q.question}>
                <h3>{q.question}</h3>
                <div className='options--container'>
                    {
                        createOptions
                    }
                </div>
            </div>
        )
    })
    console.log(questions);
    return (
        <section className='quiz--container'>
            {createElement}
        </section>
    )
}
