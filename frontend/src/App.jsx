import React from 'react'
import { useState } from 'react'
import axios from 'axios'
function App() {
  const [question, setQuestion] = useState('')
const [answer, setAnswer] = useState('')  
 async function generateAnswer() {
  setAnswer("Generating answer...")
    const response = await axios({
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_API_KEY}`,
      method: "POST",
      data: {
      "contents": [{
        "parts": [{ "text": question }]
      }]
      }
    })
    setAnswer(response['data']['candidates'][0]['content']['parts'][0]['text']);
  }
    return (
      <>
      <div>Chat Ai</div>
      <textarea value={question} onChange={(e)=>setQuestion(e.target.value)} cols={30} rows={20}></textarea>
      <button onClick={generateAnswer}>generate </button>
      <p>{answer}</p>
      </>
    )
  }


  export default App