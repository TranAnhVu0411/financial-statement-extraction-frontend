import './App.scss';

import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import { useSelector } from 'react-redux';

import { Spin } from 'antd';

import Navbar from './components/Navbar/index';
import Home from './pages/Home/index';
import Footer from './components/Footer';
import OCRResult from './pages/OCRResult';
import OCREdit from './pages/OCREdit';
import DocumentList from './pages/DocumentList';

function App() {
  const user = useSelector((state) => ({ ...state.auth }));
  const document = useSelector((state) => ({ ...state.document }));
  const tipChange = () => {
    if (user.loading) {
      return user.tip;
    }
    if (document.loading) {
      return document.tip;
    }
    return 'loading';
  }
  return (
    <Router>
      <div className='app'>
        <div className='container'>
          <Spin tip={tipChange()} spinning={user.loading || document.loading} style={{ positon: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/result" element={<OCRResult />} />
              <Route path="/edit" element={<OCREdit />} />
              <Route path="/index" element={<DocumentList />} />
            </Routes>
            <Footer />
          </Spin>
        </div>
      </div>
    </Router>
  );
}

export default App;
