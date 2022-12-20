import './App.css';
import {BrowserRouter as Router , Routes , Route} from "react-router-dom"
import Header from './components/Header';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Offers from './pages/Offers';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      
  <Router>
  <Header />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/offers' element={<Offers />} />
      <Route path='/sign-in' element={<SignIn />} />
      <Route path='/sign-up' element={<SignUp />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
    </Routes>
  </Router>
    </div>
  );
}

export default App;
