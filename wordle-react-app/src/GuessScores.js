import React from 'react';
import GuessScorePair from './GuessScorePair';
import { ReactComponent as PlusIcon } from './plus-circle.svg';
import { deleteAt, replaceInList } from './Util';
import './link-button.scss';

export default function GuessScores({allGuesses, guesses, setGuesses, setGuessCount, scoreLists, setScoreLists, targetCount}) {
  const setGuess = function(index) {
    return function(guess) {
      setGuesses((gs) => replaceInList(gs, guess, index));
    }
  }

  const setScores = function(guessNum) {
    return function(newScores) {
      setScoreLists((sls) => sls.map((scoreList, i) => {
        return replaceInList(scoreList, newScores[i], guessNum);
      }));
    }
  }

  const deleter = function(index) {
    return function() {
      setGuesses((gs) => deleteAt(gs, index));
      setScoreLists((sls) => sls.map((sl) => deleteAt(sl, index)));
      setGuessCount((gs) => gs - 1);
    }
  };

  const adder = function() {
    setGuessCount((gs) => gs + 1);
  };

  return (
    <>
      {guesses && scoreLists && guesses.map((guess, index) => {
        const scores = scoreLists.map((sl) => sl[index]);
        return <GuessScorePair allGuesses={allGuesses} key={index} scores={scores} guess={guess} setScores={setScores(index)} setGuess={setGuess(index)} deleter={deleter(index)} adder={(index === guesses.length -1 ) && adder} />
      }
      )}
      {(!guesses || guesses.length === 0) && (
       <div className='row'>
           <div className='col' align='center'><button className='link-button add-delete-button' onClick={adder} ><PlusIcon className='icon' /></button></div>    
       </div>
      )   
      }
    </>
  );
}
