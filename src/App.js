import { useCallback, useEffect,useRef,useState } from 'react';
import styles from './App.module.css';
import Content from './components/Content';
import Timer from './components/Timer';


function App() {

  const [paragraph, setParagraph] = useState('');
  const [word, setWord] = useState('')
  const [charIndex, setCharIndex] = useState(0);
  const [time, setTime] = useState(60)
  const [mistakes, setMistakes] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [acc, setAcc] = useState(0)
  const [error, setError] = useState(null)

  const totalChars=useRef(0)
  const totalCorrectChars=useRef(0)
  const timer= useRef()

  const handleReset=()=>{
    setWord('')
    setCharIndex(0)
    setTime(60)
    setMistakes(0)
    setWpm(0)
    setAcc(0)
    setError(null)
    clearTimeout(timer.current)

    totalChars.current=0;
    totalCorrectChars.current=0
    timer.current=undefined
  }

  useEffect(()=>{
    handleReset()
    let randIndx;
    const getParagraphs=async function(){
      try{const res = await fetch('https://baconipsum.com/api/?type=meat-and-filler')
      const data = await res.json();
      randIndx=Math.floor(Math.random()*data.length)
      console.log(randIndx);
      setParagraph(data[randIndx].toLowerCase().trim())}
      catch(err){
        setError(err.message)
      }
    }
    getParagraphs()
  },[error])


  const testCalculator=(originalValue,typedValue)=>{
    const mistakes=typedValue.split('').reduce((acc, typedChar,i)=>{
      return typedChar!==originalValue[i] ? acc+1 : acc
    },0)
    const cpm=typedValue.length-mistakes
    const wpm = cpm/5

    if(typedValue.length>charIndex)
      totalChars.current++
    if(typedValue[charIndex]===originalValue[charIndex])
      totalCorrectChars.current++
    const accuracy=(totalCorrectChars.current / totalChars.current)*100

    return {wpm, mistakes, accuracy}
  }

  const handleInput=(e)=>{
    const {value}=e.target;

    if(time <=0 || value.length > paragraph.length)
      return

    setWord(value)
    setCharIndex(value.length)

    const {wpm, mistakes, accuracy}=testCalculator(paragraph,value)
    setMistakes(mistakes)
    setWpm(wpm)
    setAcc(accuracy)

    if(!timer.current)
      timer.current=setTimeout(()=>setTime(prevState=>prevState-1),1000)
  }

  

  const callbackRef=useCallback(input=>{
    if(input)
      document.addEventListener('keydown', ()=>input.focus())
  },[])
  
  return (
    <div className={styles.app}>
    <h1 className={styles['header--primary']}>Typing Speed Test</h1>
    <h2 className={styles['header--secondary']}>Test you typing skills!</h2>

    <div className={styles.tab}>
       <Timer time={time} setTime={setTime} timer={timer} handleReset={handleReset}/>
      <div className={styles.square}>
      <p>{Math.floor(wpm)}</p>
      <span>words per minute</span>
    </div>
    <div className={styles.square}>
      <p>{mistakes}</p>
      <span>mistakes</span>
    </div>
    <div className={styles.square}>
      <p>{Math.round(acc)}</p>
      <span>% accuracy</span>
    </div>
    </div>
    
   
    

    <input type='text' value={word} className={styles.glass} ref={callbackRef} autoFocus onChange={handleInput}/>
    {error && <p>{`${error} :(`}</p>}
   {!error && <Content paragraph={paragraph} word={word} charIndex={charIndex}/>}

    {/* <span className={styles.restart}
    onClick={handleRestart}>&#x27F3;</span> */}
        

    </div>
  );
}

export default App;
