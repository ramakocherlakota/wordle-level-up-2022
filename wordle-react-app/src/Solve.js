import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Results from './Results';
import StartWith from './StartWith';
import Select from 'react-select';
import HardModeRow from './HardModeRow';

import {answerOptions} from './Data';

export default function Solve({hardMode, setHardMode}) {
    const [ target, setTarget ] = useState("");
    const [ startWith, setStartWith ] = useState(["raise"]);
    const [ showQueryButton, setShowQueryButton ] = useState(false);
    const [ showResults, setShowResults ] = useState(false);
    const [ request, setRequest ] = useState(undefined);

    const headers = ["turn", "guess", "score", "uncertainty_before_guess", "expected_uncertainty_after_guess", "compatible"] 
    const headerLabels = {
        "turn": "Turn",
        "guess": "Guess",
        "score": "Score",
        "uncertainty_before_guess": "H-Prior",
        "expected_uncertainty_after_guess": "Expected H-post",
        "compatible": "Compatible?"
    };

    useEffect(() => {
        setShowResults(false);
        if (target && target.length > 0) {
            setRequest({
                operation: "solve",
                target,
                hard_mode: hardMode,
                start_with: startWith
            });
            
            setShowQueryButton(true);
        } else {
            setShowQueryButton(false);
        }
    }, [target, startWith]);

    function callQuery() {
        setShowResults(true);
        setShowQueryButton(false);
    }

    const setTargetHandler = (a) => {
        setTarget(a.value);
    }

    return (
      <>
        <div className="row" >
          <div className="col">
            Target Word
          </div>
          <div className="col">
            <Select options={answerOptions} onChange={setTargetHandler} value={answerOptions.filter(option=>option.label === target)} /> 
          </div>
        </div>
        <div className="row" >
          <div className="col">
            Start With
          </div>
          <div className="col">
            <StartWith startWith={startWith} setStartWith={setStartWith} />
          </div>
        </div>
        <HardModeRow hardMode={hardMode} setHardMode={setHardMode} />
        <hr/>
        {showQueryButton && <Button onClick={callQuery} >Go!</Button>}
        {showResults && <Results request={request} headerLabels={headerLabels} headers={headers} />}
      </>
    )
}
