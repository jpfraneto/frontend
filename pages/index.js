import React from 'react'
import WritingGame from "../components/WritingGame"

const LandingPage = () => {
  const gameSettings = {secondsOfLife : 8, totalSessionDuration: 480, waitingTime:8, prompt:"tell us who you are"}
  return (
    <div className='w-screen h-screen'><WritingGame writingGameSettings={gameSettings}/></div>
  )
}

export default LandingPage