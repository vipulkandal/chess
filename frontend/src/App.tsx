import './App.css'

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from './Screens/Landing';
import Game from './Screens/Game';

function App() {

  return (
    <div className='h-dvh bg-[#312e2b]'>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} /> 
        <Route path="/game" element={<Game />} /> 
      </Routes>
    </BrowserRouter>

    </div>
  )
}

export default App
