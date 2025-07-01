import { HomeOutlined } from '@ant-design/icons'
import './App.css'
import PageHeader from './components/PageHeader/PageHeader'

function App() {

  const title = 'Create new Part'

  return (
    <>
      <PageHeader
        title={title}
        breadcrumbs={[
          { title: '', href: '/', icon: <HomeOutlined /> },
          { title: 'Parts', href: '/parts' },
          { title: 'Modify', href: '/modify' },
        ]}
      />
    </>
  )
}

export default App
