import React from 'react'
import styles from './Content.module.css'

const Content = React.memo(({paragraph,word,charIndex}) => {
  return (
    <p className={styles.content}>
    {/* {paragraph} */}
    {paragraph.split('').map((char,i)=>
      <span className={`${styles.char} 
      ${i===charIndex ?
        styles.active: 
        ''}
      ${word[i]===char ? 
        styles.correct :
        i<charIndex?styles.incorrect : ''}
      `} key={i}>{char}</span>
    )}
  </p>
  )
})

export default Content
