import { Dashboard } from "./pages/Dashboard"
import { SharedBrainPage } from "./pages/SharedBrainPage"
import Signin from "./pages/Signin"
import { Signup } from "./pages/Signup"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />}></Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/share/:hash" element={<SharedBrainPage />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  )
}

export default App
