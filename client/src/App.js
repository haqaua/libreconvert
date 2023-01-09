import {useEffect, useRef, useState} from 'react'

function App() {
  const [serverStatus, setServerStatus] = useState('Connecting...')
  const fileInput = useRef()
  const formData = new FormData()

  useEffect(() => {
    fetch('/api/ping')
    .then(response => response.status === 200 && setServerStatus('Connected.'))
  }, [])

  const convert = () => fetch('/api/convert', {
    method: 'POST',
    body: formData
  }).then(response => response.arrayBuffer())
  .then(data => {
    setServerStatus('Converted.')
    downloadBuffer(data, Date.now()+'.pdf')
    fileInput.current.clear();
    setServerStatus('Ready.')
  })

  function downloadBuffer(arrayBuffer, fileName) {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob(
      [ arrayBuffer ],
      { type: 'application/pdf' }
    ))
    a.download = fileName
    a.click()
  }
  
  const handleFileChange = e => {
    setServerStatus('Processing...')
    formData.append('file', e.target.files[0])
    convert()
  }
  return (
    <div className="App" style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
      <h5>{serverStatus} <br/></h5>
      <div>
        <input type='file' ref={fileInput} onChange={handleFileChange}/>
      </div>
    </div>
  );
}

export default App;
