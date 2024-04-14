// components/QuizApp.js
import React, { useState, useEffect } from 'react';
import questions from '../data/questions.json';
import './QuizApp.css';

const QuizApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [tabViolations, setTabViolations] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  useEffect(() => {
    // Check if the app is in full-screen mode
    const handleFullScreenChange = () => {
      setIsFullScreen(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    // Check if the user has switched tabs
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setTabViolations(tabViolations + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [tabViolations]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    if (currentQuestion === questions.length - 1) {
      setIsQuizFinished(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleFullScreen = () => {
    if (!isFullScreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setTabViolations(0);
    setIsQuizFinished(false);
  };

  return (
    <div className="quiz-app">
      {!isFullScreen && (
        <div className="fullscreen-blocker">
          <p>Please enter full-screen mode to take the quiz.</p>
          <button onClick={handleFullScreen}>Enter Full Screen</button>
        </div>
      )}
      {isFullScreen && currentQuestion < questions.length && (
        <div className="quiz-container">
          <h2 className="question-title">Question {currentQuestion + 1}</h2>
          <p className="question">{questions[currentQuestion].question}</p>
          <div className="answers">
            {questions[currentQuestion].answers.map((answer, index) => (
              <button
                key={index}
                className="answer-button"
                onClick={() => handleAnswer(answer.isCorrect)}
              >
                {answer.text}
              </button>
            ))}
          </div>
          <p className="tab-violations">Tab Violations: {tabViolations}</p>
        </div>
      )}
      {isFullScreen && isQuizFinished && (
        <div className="quiz-complete">
          <h2 className="score-title">Quiz Complete</h2>
          <p className="score">Your score: {score}/{questions.length}</p>
          <button className="restart-button" onClick={handleRestart}>
            Restart Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizApp;