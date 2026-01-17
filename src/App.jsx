import { useState } from 'react';
import axios from 'axios';
import DataGridDemo from './Components/DataGridDemo'
import InputData from './Components/InputData'

function App() {
  
  const [token,setToken] = useState("")
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTokenSubmit = async (token) => {
    setToken(token);
    
    try {
      const response = await axios.post('http://localhost:8000/repos', { token });
      console.log('Token sent successfully:', response.data);
      // Trigger a refresh in DataGridDemo after successful token submission
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error sending token:', error);
    }
  }

  return (
    <>
        <div>
          <InputData onTokenSubmit={handleTokenSubmit}/>
          <DataGridDemo token={token} refreshTrigger={refreshTrigger}/>
        </div>
    </>
  )
}

export default App