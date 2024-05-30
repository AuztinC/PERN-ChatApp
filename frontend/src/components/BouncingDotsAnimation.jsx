import React, { useState, useEffect } from "react";

export default function BouncingDotsAnimation({typer}) {
  
    const [dotsIdx, setDotsIdx] = useState(0);
    
    
    const dots = [
      "...",
      "˙..",
      ".˙.",
      "..˙"
    ]
    
    useEffect(() => {
      setDotsIdx(dotsIdx + 1)
    }, [])
    
    useEffect(() => {
      console.log(dotsIdx)
      if(typer.length > 0){
        setTimeout(() => {
          
          setDotsIdx(dotsIdx + 1)
          if(dotsIdx === 3){
            setDotsIdx(0);
          }
        }, 250);
      } else {
        setDotsIdx(0)
      }
    }, [dotsIdx])
    
    
    return (<>
      <div className={`w-fit p-2 rounded-xl flex bg-receivedColor}`}><span className='font-bold'>{ typer.username }</span>: {dots[dotsIdx]}</div>
    </>);
  }
  