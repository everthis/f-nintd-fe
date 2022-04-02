import React, { useState } from "react";
import ReactDOM from "react-dom/client";

function App(props) {
  const { name } = props;
  return (
    <>
      <h1>
        Upload {name}
      </h1>
      <Upload />
    </>
  );
}

function Upload() {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [inputVal, setInputVal] = useState('')
  const [img, setImg] = useState(null)
  // On file select (from the pop up) 
  function onFileChange (event) { 
    // Update the state 
    console.log(event.target.files)
    const { files } = event.target
    if (files.length) {
      const newList = [...files, ...selectedFiles]
      console.log(newList)
      setSelectedFiles(newList)
    }
  }; 
    
  // On file upload (click the upload button) 
  function onFileUpload () { 
    // Create an object of formData 
    const formData = new FormData(); 
    
    // Update the formData object 
    formData.append(
      "myFile", 
      selectedFiles, 
      selectedFiles.name 
    )
    
    // Details of the uploaded file 
    console.log(selectedFiles); 
    
    // Request made to the backend api 
    // Send formData object 
    // fetch("api/uploadfile", formData); 
  }; 
    
  // File content to be displayed after 
  // file upload is complete 
  function fileData () { 
    if (selectedFiles) {
      // setImage(URL.createObjectURL(event.target.files[0]));

      return (
        <div> 
          <h2>File Details:</h2> 
          <p>File Name: {selectedFiles.name}</p> 
          <p>File Type: {selectedFiles.type}</p> 
          <p>
          {/* <img src={image} alt="preview image" /> */}
          </p>
          <p> 
            Last Modified:{" "} 
            {selectedFiles.lastModifiedDate.toDateString()} 
          </p> 
        </div> 
      ); 
    } else { 
      return ( 
        <div> 
          <br /> 
          <h4>Choose before Pressing the Upload button</h4> 
        </div> 
      ); 
    } 
  }; 

  function deleteFn(i) {
    const clone = [...selectedFiles]
    clone.splice(i, 1)
    setSelectedFiles(clone)
  }

  return (
    <>
      <input
        type="file"
        multiple
        onChange={onFileChange}
        value={inputVal}
      />
      <button onClick={onFileUpload}> 
        Upload! 
      </button> 
      <div>
        { selectedFiles.map((e,i) => <Img key={i} file={e} deleteFn={() => deleteFn(i)} />) }
      </div>
    </>
  )
}

function Img({file, deleteFn}) {
  const image = URL.createObjectURL(file)
  const delFn = (ev) => {
    ev.preventDefault()
    deleteFn()
  }
  return (
    <>
      <img src={image} alt="preview image" />
      <a href='' onClick={delFn}>delete</a>
    </>
  )
}

const mountNode = document.getElementById("app");
ReactDOM.createRoot(mountNode).render(<App name="Jane" />);