import React,{useState,useEffect} from 'react'
import APIService from './APIService'

function Form(props) {

  const [title, setTitle] = useState(props.article.title);
  const [body, setbody] = useState(props.article.body);

  useEffect(()=>{
    setTitle(props.article.title)
    setbody(props.article.body)
  },[props.article])


  const updateArticle = (article) =>{
    APIService.UpdateArticle(props.article.id,{title,body})
    .then(resp => props.updatedData(resp)) //data guncellendiginde anlık olarak sayfaya yansıması icin
    .catch(error => console.log(error))
  }

  const insertArticle = (article) =>{
    APIService.InsertArticle({title,body})
    .then(resp => props.insertedArticle(resp)) 
    .catch(error => console.log(error))
  }
  

  return (
    <div>
        {props.article ? (
            <div className="mb-3">
                <label htmlFor = "title" className='form-label'>Title</label>
            
                <input type="text" className="form-control" 
                placeholder ="Please Enter title"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                required
                />

                <label htmlFor="body" className="form-label">Description</label>
                <textarea 
                rows="5"
                className="form-control" 
                placeholder ="Please Enter Description" 
                value={body}
                onChange={(e)=>setbody(e.target.value)}
                required
                />

                {
                    props.article.id ? <button  onClick={updateArticle} className="btn btn-success mt-3">Update</button>
                    :
                    <button  onClick={insertArticle} className="btn btn-success mt-3">Insert</button> //eger ID yoksa bu insert komutudur
                }

                
            </div>
        ):null}

    </div>
  )
}

export default Form