import './App.css'
import B2D from './b2d'
import Count from './count'
import Database from './database'
import Status from './status'

function App() {

  return (
    <div className='container'>
      <B2D />
      <Count/>
      <Database />
      <Status />
    </div>
  )
}

export default App
