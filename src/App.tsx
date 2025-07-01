import './App.css'
import CustomButton from './components/CustomButton/CustomButton'
import { PlusOutlined } from '@ant-design/icons';


function App() {

  return (
    <>
      <div style={{ padding: 40 }}>
        <CustomButton
          variant="blue"
          layout="iconFirst"
          icon={<PlusOutlined />}
          text="Add part"
        />

        <CustomButton
          variant="white"
          layout="textFirst"
          icon={<PlusOutlined />}
          text="Create"
        />

        <CustomButton variant="black" text="Delete" />

        <CustomButton variant="red" text="Remove" disabled />
      </div>
    </>
  )
}

export default App
