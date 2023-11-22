import React,{useState,useEffect} from 'react'
import axios from 'axios';
import '../css/form.css';


function Form(props) {

  const [title, setTitle] = useState(props.card.title);
  const [description, setDescription] = useState(props.card.description);
  const [image, setImage] = useState(props.card.image); 
  const [price, setPrice] = useState(props.card.price);
  const [previewUrl, setPreviewUrl] = useState(props.card.previewUrl);
  const [fileURL,setFileURL] = useState(props.card.fileURL);
  const [collectionName, setCollectionName] = useState(props.card.collectionName);
  
  useEffect(()=>{
    setTitle(props.card.title || '');
    setDescription(props.card.description || '');
    setImage(props.card.image || '');
    setPrice(props.card.price || '');
    setPreviewUrl(props.card.previewUrl || '');
    setFileURL(props.card.fileURL || '');
    setCollectionName(props.card.collectionName || '');

    // Get the form element by ID
    const formElement = document.getElementById("cardForm");

    // Check if the form element exists
    if (formElement) {
      // Scroll to the form element
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  },[props.card])

  const updateCard = async (card) =>{
    try {
      const formData = new FormData();
      formData.append("card_id", props.card.id);
      formData.append("image", image);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("previewUrl", previewUrl);
      formData.append("collectionName", collectionName);

      const response = await axios.put(`http://localhost:5000/update/${props.card.id}`, formData);
  
      // Assuming the response contains the inserted card data
      const updatedCard = response.data;
      // Call the callback function with the inserted card data
      props.updatedData(updatedCard);
      console.log(response.data);

      // Clear the form fields after inserting the card
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);
      setPreviewUrl(""); 
      setCollectionName(""); 

      // Reset the file input value to clear it
      document.getElementById("fileInput").value = "";
    } catch (error) {
      console.error("Error inserting card:", error);
    }
  };

  const insertCard = async (card) =>{
  try {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("previewUrl", previewUrl);
      formData.append("collectionName", collectionName);

    const response = await axios.post(`http://localhost:5000/add`, formData);

    // Assuming the response contains the inserted card data
    const insertedCard = response.data;
    // Call the callback function with the inserted card data
    props.insertedCard(insertedCard);
    console.log(response.data);
    // Clear the form fields after inserting the card
    setTitle("");
    setDescription("");
    setPrice("");
    setImage(null);
    setPreviewUrl(""); 
    setCollectionName("");

    // Reset the file input value to clear it
    document.getElementById("fileInput").value = "";

  } catch (error) {
    console.error("Error inserting card:", error);
  }
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setImage(selectedFile);
    // If you want to preview the image, you can create a URL for the selected file
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleClose = () => {
    // Call a callback function to notify the parent component about the close event if needed
    // For example, you can define a prop named onClose and pass a callback function from the parent
    if (props.onClose) {
      props.onClose();
    }
  };
  
  //id="fileInput"  // Add this line  /////value={image}   style={{ maxWidth: '100%', height: 'auto' }}
  
  return (
    <div id="cardForm">
        {props.card ? (
            <div className="form-container">
              <div className='form'>
              <div className='close-button-div'>
                <button onClick={handleClose} className="close-button"> &#10006; </button>
              </div>
              {/* Close button with a cross sign */}
               <label htmlFor = "image" className='form-label'>Image</label>
                <input type="file" className="form-control" 
                placeholder ="Choose a file"
                onChange={(e) => {handleImageChange(e);}}
                required
                accept="image/*"
                />   
  
                <label htmlFor = "collectionName" className='form-label'>Collection Name</label>
                <select className="form-coll-select" id="selectedCollection" value={collectionName} onChange={(e)=>setCollectionName(e.target.value)}>
                  <option value="" disabled> Select a collection </option>
                  {props.collections.map((collection) => (
                    <option key={collection.id} value={collection.collectionName}>
                      {collection.collectionName}
                    </option>
                  ))}
                </select>

                <label htmlFor = "title" className='form-label'>Title</label>
                <input type="text" className="form-control" 
                placeholder ="Please Enter title"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                required
                />

                <label htmlFor="description" className="form-label">Description</label>
                <textarea 
                rows="2"
                className="form-control" 
                placeholder ="Please Enter Description" 
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                required
                />

                <label htmlFor = "price" className='form-label'>Price</label>
                <input type="text" className="form-control" 
                placeholder ="Please Enter price"
                value={price}
                onChange={(e)=>setPrice(e.target.value)}
                required
                />
                {
                    props.card.id ? <button  onClick={updateCard} className="btn btn-success mt-3">Update Card</button>
                    :
                    <div className='addcard-div'>
                      <button  onClick={insertCard} className="btn btn-success mt-3">Add Card</button>
                    </div>
                }  
              </div>
              
              <div className='show-prewiewUrl'>
                {previewUrl===""||previewUrl==null?"":<img src={previewUrl} alt='' className="card_show" style={{ width: '200px', height: '200px', objectFit: 'cover' }}/>}
              </div>

              </div>
        ):null}
      </div>
  )
}

export default Form