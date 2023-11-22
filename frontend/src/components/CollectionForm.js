import React,{useState,useEffect} from 'react'
import axios from 'axios';
import '../css/form.css';


function CollectionForm(props) {

  const [collectionName, setCollectionName] = useState(props.collection.collectionName);
  
  useEffect(()=>{
    setCollectionName(props.collection.collectionName || '');

    // Get the form element by ID
    const formElement = document.getElementById("CollectionForm");

    // Check if the form element exists
    if (formElement) {
      // Scroll to the form element
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  },[props.collection])

  const insertCollection = async (collection) =>{
  try {
    const formData = new FormData();
    formData.append("collectionName", collectionName);

    const response = await axios.post(`http://localhost:5000/addCollection`, formData);

   
    const insertedCollection = response.data;

    props.insertedCollection(insertedCollection);

    //console.log(insertedCollection);
    
    setCollectionName("");

  } catch (error) {
    console.error("Error inserting collection:", error);
  }
  };

  const handleClose = () => {
    // Call a callback function to notify the parent component about the close event if needed
    // For example, you can define a prop named onClose and pass a callback function from the parent
    if (props.onClose) {
      props.onClose();
    }
  };
  
  return (
    <div id="CollectionForm">
        {props.collection ? (
            <div className="form-container">
              <div className='form'>
              <div className='close-button-div'>
                <button onClick={handleClose} className="close-button"> &#10006; </button>
              </div>
              {/* Close button with a cross sign */}
                <label htmlFor = "collectionName" className='form-label'>Title</label>
                <input type="text" className="form-control" 
                placeholder ="Please Enter Name for Collection"
                value={collectionName}
                onChange={(e)=>setCollectionName(e.target.value)}
                required
                />

                <div className='addcard-div'>
                    <button  onClick={insertCollection} className="btn btn-success mt-3">Add Collection</button>
                </div>
              </div>
              </div>
        ):null}
      </div>
  )
}

export default CollectionForm