import React from "react"
import { useState } from "react"
import { languages } from "./languages.js"
import { getFarewellText, getRandomWord } from "./utils.js"
import Confetti from "react-confetti"

import clsx from "clsx"

export default function App() {

  const [currentWord, setCurrentWord] = useState(() => getRandomWord())
  const [guessedLetters, setGuessedLetters] = useState([])

  const numGuessesLeft = languages.length - 1
  const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length
  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessCount >= numGuessesLeft
  const isGameOver = isGameWon || isGameLost
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)



  const alphabet = "abcdefghijklmnopqrstuvwxyz"


  function addGuessedLetters(letter) {
    setGuessedLetters(prevLetters => prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter])
  }




  const languageChips = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessCount
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color
    }
    const className = clsx("chip", isLanguageLost && "lost")
    return (
      <span key={lang.name} style={styles} className={className}>{lang.name}</span>
    )
  })

  const wordElement = currentWord.split("").map((letter,index) => {
      const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
      const letterClassName = clsx(isGameLost && !guessedLetters.includes(letter) && "missed-letter")
      return (
      <span key={index} className={letterClassName}>{shouldRevealLetter ? letter.toUpperCase() : ""}</span>
      )
 
  })

  const keyBoard = alphabet.split("").map(letter => {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const className = clsx({
        correct: isCorrect,
        wrong: isWrong
    })
    return (
      <button disabled={isGameOver}
              aria-disabled={guessedLetters.includes(letter)} 
              aria-label={`Letter ${letter}`} 
              className={className} 
              onClick={()=> addGuessedLetters(letter)} 
              key={letter} 
              id={letter}>{letter.toUpperCase()}
      </button>
    )
  })

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
        return (
          <p className="farewell-message">{getFarewellText(languages[wrongGuessCount -1].name)}</p>
            )
    }
    if (isGameWon) {
        return (
            <>
                <h2>You win!</h2>
                <p>Well done! 🎉</p>
            </>
        )
    } if(isGameLost) {
        return (
            <>
                <h2>Game over!</h2>
                <p>You lose! Better start learning Assembly 😭</p>
            </>
        )
    }
}

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect
  })

  function newGame() {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }

  return (
    <main>
      {isGameWon && <Confetti />}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
      </header>
      <section aria-live="polite" role="status" className={gameStatusClass}>
        {renderGameStatus()}
      </section>
      <section className="language-container">
        {languageChips}
      </section>
      <section className="word">
        {wordElement}
      </section>
      <section className="keyboard">
        {keyBoard}
      </section>
      {isGameOver && <button onClick={newGame} className="new-game">New Game</button>}
    </main>
  )
}