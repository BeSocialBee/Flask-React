import React,{useState,useEffect} from 'react'
import APIService from './APIService'

function Form(props) {

  const [title, setTitle] = useState(props.card.title);
  const [description, setDescription] = useState(props.card.description);
  const [image, setImage] = useState(props.card.image); //binary data of the file
  const [previewUrl , setPreviewUrl ] = useState(props.card.previewUrl); //base64-encoded string representation of the file
  const [base64Encoded , setbase64Encoded ] = useState(props.card.base64Encoded);
  const [price, setPrice] = useState(props.card.price);
  const [binary_file, setbinary_file] = useState(props.card.binary_file);
  const [payload, setPayload] = useState({ filename: '', content: '' });

  useEffect(()=>{
    setTitle(props.card.title)
    setDescription(props.card.description)
    setImage(props.card.image)
    setPreviewUrl(props.card.previewUrl)
    setPrice(props.card.price)
  },[props.card])


  const updateCard = (card) =>{
    APIService.UpdateCard(props.card.id,{image,title,description,price})
    .then(resp => props.updatedData(resp)) //data guncellendiginde anlık olarak sayfaya yansıması icin
    .catch(error => console.log(error))
  }

  const insertCard = async (card) =>{
    //console.log(payload.user_file.filename)
    APIService.InsertCard({image,title,description,price,base64Encoded,previewUrl,binary_file,payload})
    .then(resp => props.insertedCard(resp)) 
    .catch(error => console.log(error))
  }

  /*
  const handleChange = (e) =>{
   // e.preventDefault();
    //console.log(e.target.files)
    const inFile = e.target.files[0];
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64Encoded = reader.result.split(',')[1]; // Extract the base64-encoded part
      setbase64Encoded(base64Encoded);
      setImage(inFile) //infile is binary data of file
      setPreviewUrl(reader.result) // 'reader.result' is the base64-encoded string representation of the file
    
    };
    reader.readAsDataURL(inFile) //Reads the binary content of the file and converts it to a base64-encoded string
    //reader.readAsArrayBuffer(inFile) //reads bnary data directly   
  }
  */
  const uploadFile = (fileee) => {
    const reader = new FileReader();
    // Read the file as a Data URL (Base64)
    reader.readAsDataURL(fileee);
    reader.onloadend = () => {
      const base64File = reader.result.split(",")[1]; // Extract Base64 content
      const payload = {
        user_file: {
          filename: fileee.name,
          content: base64File,
        },
      };
    setImage(fileee);  // Set the file directly, not its base64 representation
    setPreviewUrl(reader.result); // 'reader.result' is the base64-encoded string representation of the file 

    setPayload(payload);
  };
};

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

// {previewUrl===""||previewUrl==null?"":<img width={100} height={100} src={previewUrl} alt=''/>}
  return (
    <div>
        {props.card ? (
            <div className="mb-3">
                <label htmlFor = "image" className='form-label'>Image</label>
                <input type="file" className="form-control" 
                placeholder ="Choose a file"
                onChange={handleFileChange}
                required
                accept="image/*"
                />

              
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