import './App.css';
import SoundCloud from './soundcloud.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/nav/navbar.js'
function App() {
  return (
    <>
      <div className="App">
        <Header />
        <h1>SoundCloud Downloader</h1>
        <p>Enter the URL of the SoundCloud track you want to download</p>
        <SoundCloud />
      </div>
    </>
  );
}

export default App;
