import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    
    const [count, setCount] = React.useState(0)

    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    const incrementCount = () => {
        setCount(count + 1)
        if (tenzies === true) {
            setCount(0)
        }
    }
    
    // Clock
    
    const [seconds, setSeconds] = React.useState(0)
    const [minute, setMinute] = React.useState(0)
    
    var timer;
    React.useEffect(() => {
        
    timer = setInterval(() => {
        setSeconds(seconds+1)
            
            if (seconds === 59) {
                setMinute(minute+1)
                setSeconds(0)
            }
    }, 1000)
    
    return () => clearInterval(timer)
    
    })
    
    function restart() {
    
        setSeconds(0)
        setMinute(0)

    }
    
    function stop() {
        clearInterval(timer)
    }
    
    const minuteText = minute < 10 ? "0" + minute: minute
    const secondText = seconds < 10 ? "0" + seconds: seconds
    
    const textCom = `${minuteText} : ${secondText}`
    
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={() => {
                    rollDice();
                    incrementCount();
                }}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <h2>
                Number of Rolls: {count}
            </h2>
            <h3>
                {textCom}
            </h3>
            <button onClick={restart}> Restart </button>
            <button onClick={stop}> Pause  </button>
        </main>
    )
}