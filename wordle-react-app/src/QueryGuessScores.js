import React, { useState, useEffect } from 'react';
import GuessScores from './GuessScores';
import Button from 'react-bootstrap/Button';
import Results from './Results';

export default function QueryGuessScores({ guessScores, setGuessScores, operation, headers, headerLabels }) {
    const [ showQueryButton, setShowQueryButton ] = useState(false);
    const [ showResults, setShowResults ] = useState(false);
    const [ request, setRequest ] = useState(undefined);

    useEffect(() => {
        function getRequest(gs) {
            const guess_scores = gs.map((obj) => [obj.guess, obj.score]);
            return {
                operation: operation,
                guess_scores: guess_scores
            }
        }

        setShowResults(false);
        const completeGuessScores = guessScores.filter((guessScore) => {
            return guessScore['score'] !== '' && guessScore['guess'] !== '';
        });
        if (completeGuessScores.length === guessScores.length) {
            setShowQueryButton(true);
            setRequest(getRequest(completeGuessScores));
        } else {
            setShowQueryButton(false);
        }
    }, [guessScores, operation]);

    function callQuery() {
        setShowResults(true);
        setShowQueryButton(false);
    }

    return (
        <>
            <GuessScores guessScores={guessScores} setGuessScores={setGuessScores}  />
            {showQueryButton && <Button onClick={callQuery} className="query-button">Query</Button>}
            {showResults && <Results request={request} headerLabels={headerLabels} headers={headers} />}
        </>);
}