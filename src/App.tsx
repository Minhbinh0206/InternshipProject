import { Routes, Route } from 'react-router-dom'
import './App.css'
import CreatePart from './pages/CreatePart/CreatePart'
import ModifyPart from './pages/ModifyPart/ModifyPart'
import PartList from './pages/PartsList/PartsListPage'
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PartList />} />
        <Route path="/parts" element={<PartList />} />
        <Route path="/parts/create" element={<CreatePart />} />
        <Route path="/parts/modify/:partId/:revisionId/:version" element={<ModifyPart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;