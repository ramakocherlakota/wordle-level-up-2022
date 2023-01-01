import React, {useState, useEffect} from 'react';

import Spinner from "react-bootstrap/Spinner";

export default function Results({ headers, headerLabels, request }) {
  const [ loading, setLoading ] = useState(false);
  const [ output, setOutput ] = useState([]);

  const url = process.env.REACT_APP_API_URI;
  
  useEffect(() => {
    async function callService() {
      try {
        setOutput([])
        setLoading(true);
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(request)
        })
        if (response.ok) {
          const json = await response.json();
          setOutput(json);
        } else {
          console.log(`Response failed with status code ${response.status}`);
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (request) {
      callService();
    }
  }, [request, url]);

  const headerRow = (headers && headers.map((x) => <div className='col'>{headerLabels[x]}</div>));

  function formatEntry(x) {
    if (typeof x === 'number' && x !== 0) {
      return x.toFixed(4);
    } else {
      return x;
    }
  }

  function dataRow(row) {
    return headers.map((x) => <div className='col'>{formatEntry(row[x])}</div>)
  }

  function wordList(list) {
    if (list.length > 0) {
      return (
        list.map((it) => {
          return (
            <>
              {it}<br/>
            </>
          );
        })
      ); 
    } else {
      return <em>No matches</em>
    }
  }

  function formatRemaining(rows) {
    return (
      <div className='row'>
        {rows.map((lst, idx) => {
          return (
            <div key={idx} className="col">{wordList(lst)}</div>
          );
        })}
      </div>
    );
  }

  function dataRows(rows) {
    if (request.operation === "qremaining_answers") {
      return formatRemaining(rows);
    } else {
      return rows.map((row, idx) => <div className='row' key={idx}>{dataRow(row)}</div>);
    }
  }

  return (
    <>
      {loading && <Spinner animation='border' />}
      {headerRow && <div className='row' key={-1}>{headerRow}</div>}
      {dataRows(output)}
    </>
  );
}
