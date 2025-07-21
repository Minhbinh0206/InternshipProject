import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import CreatePart from './pages/CreatePart/CreatePart';
import ModifyPart from './pages/ModifyPart/ModifyPart';
import PartList from './pages/PartsList/PartsListPage';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql', // đúng endpoint GraphQL
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PartList />} />
          <Route path="/parts" element={<PartList />} />
          <Route path="/parts/create" element={<CreatePart />} />
          <Route path="/parts/modify/:id" element={<ModifyPart />} />
          <Route path="/parts/modify/:id/:revisionId" element={<ModifyPart />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
