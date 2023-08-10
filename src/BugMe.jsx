import React, { useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const BugMe = () => {
  const [chatCompletions, setChatCompletions] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an entomologist. Relate every response to bugs. Give out interesting high level bug facts in the format of fact \n would you like to know more ?' },
          { role: 'user', content: userInput },
        ],
        temperature: 0.60,
        max_tokens: 120,
        top_p: 0.3,
        frequency_penalty: 0.05,
        presence_penalty: 0.05,
        stop: ['?'],
      });

      console.log(response); // Log the response object for debugging

      if (response.data.choices && response.data.choices.length > 0) {
        const newCompletion = response.data.choices[0].message.content;
        setChatCompletions((prevCompletions) => [...prevCompletions, newCompletion]);
      }
    } catch (error) {
      console.error('OpenAI API request failed:', error);
      // Handle the error, e.g., display an error message to the user
    }

    setUserInput('');
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  return (
    <div>
      <h1>Bug Me!</h1>
      <p>ask me a question below :) <br/> 
      NOTE: this functionality may become locked behind role based access control (RBAC) in a future update. Reason being, openAi API use is not free, and I can only keep the functionality public for as long as I have the means to pay usage fees. 
      </p>
      <div>
        <ul>
          {chatCompletions.map((completion, index) => (
            <li key={index}>{completion}</li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit}>
        <input type="text" value={userInput} onChange={handleInputChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default BugMe;