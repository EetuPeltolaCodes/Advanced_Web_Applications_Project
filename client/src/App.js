import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './components/HomePage';
import Register from './components/Register';
import Login from './components/Login';
import Header from './components/Header'
import PartenerFinder from './components/PartenerFinder';
import Logout from './components/Logout';
import Matches from './components/Matches';
import FirstPage from './components/FirstPage';

function App() {
  return (
    <Router>
      <div className="App">
        {/* All the website routes */}
      <Routes>
        <Route
        path="/"
        element={
          <FirstPage/>
        }
        />
        <Route
          path="/:id"
          element={[
            <Header key="header-key" />,
            <HomePage key="home-page-key" />,
          ]}
        />
        <Route
          path="/:id/browse"
          element={[
            <Header key="header-key" />,
            <PartenerFinder key="partner-finder-key"/>
          ]}
        />
        <Route
          path="/:id/logout"
          element={[
            <Header key="header-key" />,
            <Logout key="logout-key" />,
          ]}
        />
        <Route
          path="/:id/matches"
          element={[
            <Header key="header-key"/>,
            <Matches key="matches-key"/>,
          ]}
        />
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
      </div>
    </Router>
  );
}

export default App;
