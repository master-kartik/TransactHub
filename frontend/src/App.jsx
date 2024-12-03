import { BrowserRouter, Routes } from "react-router-dom"
import {Signin} from "./pages/Signin"
import { Route } from "react-router-dom"

import  Dashboard  from "./pages/Dashboard"
import { Signup } from "./pages/Signup"
import { SendMoney } from "./pages/SendMoney"


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<Signin/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/send" element={<SendMoney />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
