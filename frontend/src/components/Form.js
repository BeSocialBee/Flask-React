import React,{useState,useEffect} from 'react'
import axios from 'axios';

function Form(props) {

  const [title, setTitle] = useState(props.card.title);
  const [description, setDescription] = useState(props.card.description);
  const [image, setImage] = useState(props.card.image); 
  const [price, setPrice] = useState(props.card.price);
  const [previewUrl, setPreviewUrl] = useState(props.card.title);

  useEffect(()=>{
    setTitle(props.card.title || '');
    setDescription(props.card.description || '');
    setImage(props.card.image || '');
    setPrice(props.card.price || '');
    setPreviewUrl(props.card.previewUrl || '');
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

      const response = await axios.put(`http://localhost:5000/update/${props.card.id}`, formData);
  
      // Assuming the response contains the inserted card data
      const updatedCard = response.data;
      // Call the callback function with the inserted card data
      props.updatedData(updatedCard);
      console.log(response.data);
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

    const response = await axios.post(`http://localhost:5000/add`, formData);

    // Assuming the response contains the inserted card data
    const insertedCard = response.data;
    // Call the callback function with the inserted card data
    props.insertedCard(insertedCard);

    console.log(response.data);
    
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

  
  return (
    <div>
        {props.card ? (
            <div className="mb-3">
                <label htmlFor = "image" className='form-label'>Image</label>
                <input type="file" className="form-control" 
                placeholder ="Choose a file"
                onChange={handleImageChange}
                required
                accept="image/*"
                />
               {previewUrl===""||previewUrl==null?"":<img width={100} height={100} src={previewUrl} alt=''/>}
              
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
                    <button  onClick={insertCard} className="btn btn-success mt-3">Add Card</button> //eger ID yoksa bu insert komutudur
                }

                
            </div>
        ):null}

    </div>
  )
}

export default Form