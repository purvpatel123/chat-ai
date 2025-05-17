// import React, { useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [question, setQuestion] = useState('');
//   const [answer, setAnswer] = useState('');

//   async function generateAnswer() {
//     setAnswer("Generating answer...");
//     try {
//       const response = await axios({
//         url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_API_KEY}`,
//         method: "POST",
//         data: {
//           contents: [{
//             parts: [{ text: question }]
//           }]
//         }
//       });
//       setAnswer(response.data.candidates[0].content.parts[0].text);
//     } catch (error) {
//       setAnswer("Error generating answer. Please check the console.");
//       console.error(error);
//     }
//   }

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
//       <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
//         <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Chat AI</h1>
//         <textarea
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           placeholder="Ask me anything..."
//           className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
//           rows={8}
//         />
//         <button
//           onClick={generateAnswer}
//           className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
//         >
//           Generate
//         </button>
//         <div className="mt-6 p-4 bg-gray-100 rounded-lg min-h-[100px] whitespace-pre-wrap text-gray-800">
//           {answer}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;



import React, { useState, useEffect } from 'react';
import { Send, RefreshCw, Loader2 } from 'lucide-react';
import axios from 'axios';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Apply dark mode to body
    document.body.className = darkMode ? 'bg-gray-900' : 'bg-gray-50'; 
  }, [darkMode]);

  async function generateAnswer() {
    if (!question.trim()) return;  // Prevent empty questions
    
    setLoading(true);
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_API_KEY}`,
        method: "POST",
        data: {
          contents: [{
            parts: [{ text: question }]
          }]
        }
      });
      
      const newAnswer = response.data.candidates[0].content.parts[0].text;
      setAnswer(newAnswer);
      
      // Add to conversation history
      setConversations([
        ...conversations,
        { question, answer: newAnswer }
      ]);
      
      // Clear input
      setQuestion('');
    } catch (error) {
      setAnswer("Error generating answer. Please check the console.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Check if Enter is pressed without Shift
      e.preventDefault();
      generateAnswer();
    }
  };

  const clearConversation = () => {
    setConversations([]);  // Clear conversation history
    setAnswer(''); // Clear answer
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-blue-200 text-gray-800'}`}>
      {/* Header */}
      <header className={`py-4 px-6 flex justify-between items-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="flex items-center space-x-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white font-bold text-xl`}>
            AI
          </div>
          <h1 className="text-2xl font-bold">ChatAI Assistant</h1>
        </div>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`px-3 py-1 rounded-md ${darkMode ? 'bg-gray-700 text-blue-300' : 'bg-gray-200 text-blue-700'}`}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Chat history sidebar */}
        <div className={`w-full md:w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md p-4 overflow-y-auto`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Conversation History</h2>
            {conversations.length > 0 && (
              <button 
                onClick={clearConversation}
                className="flex items-center text-sm text-blue-500 hover:text-blue-700"
              >
                <RefreshCw size={14} className="mr-1" />
                Clear
              </button>
            )}
          </div>
          
          {conversations.length === 0 ? (
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No conversations yet</p>
          ) : (
            <div className="space-y-3">
              {conversations.map((conv, idx) => (
                <div 
                  key={idx} 
                  className={`p-2 rounded-lg text-sm cursor-pointer hover:bg-opacity-80 ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <p className="font-medium truncate">{conv.question}</p>
                  <p className={`truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {conv.answer.substring(0, 60)}...
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col p-4">
          <div className={`flex-1 overflow-y-auto p-4 mb-4 rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-md`}>
            {answer ? (
              <div className="space-y-4">
                {conversations.map((conv, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className={`p-3 rounded-lg max-w-3xl ml-auto ${
                      darkMode ? 'bg-blue-900 text-white' : 'bg-blue-100 text-gray-800'
                    }`}>
                      <p>{conv.question}</p>
                    </div>
                    <div className={`p-3 rounded-lg max-w-3xl ${
                      darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="whitespace-pre-wrap">{conv.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-gray-700' : 'bg-blue-100'
                } mb-4`}>
                  <Send size={24} className={darkMode ? 'text-blue-400' : 'text-blue-500'} />
                </div>
                <h2 className="text-xl font-semibold mb-2">How can I help you today?</h2>
                <p className={`text-center max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Ask me anything! I can answer questions, provide information, or just chat about topics you're interested in.
                </p>
              </div>
            )}
          </div>

          <div className={`flex space-x-2 p-4 rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-md`}>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className={`flex-1 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 ${
                darkMode 
                  ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-600' 
                  : 'bg-gray-100 border-gray-300 focus:ring-blue-500'
              }`}
              rows={3}
            />
            <button
              onClick={generateAnswer}
              disabled={loading || !question.trim()}
              className={`px-4 rounded-lg flex items-center justify-center ${
                loading || !question.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors`}
            >
              {loading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <Send size={24} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;