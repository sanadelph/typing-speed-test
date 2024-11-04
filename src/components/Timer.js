import React, { useEffect,useRef } from 'react'
import styles from './Timer.module.css'


const Timer = ({timer, time, setTime,handleReset}) => {
    const handleTryAgain=()=>{
        if(time>0) return;
        handleReset()
    }
    useEffect(()=>{
        if(timer.current && time>0)
          timer.current=setTimeout(()=>setTime(prevState=>prevState-1),1000)
        if(time <=0){
          clearTimeout(timer.current)
          return
        }
      },[time])
  return (
    <div className={styles.timer} onClick={handleTryAgain}>
    {time>0?<>
        <p>{time}</p>
        <span>seconds</span>
        </>:<span>TRY AGAIN</span>}
    </div>
  )
}

export default Timer