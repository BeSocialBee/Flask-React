import './App.css';
import React,{useState,useEffect} from 'react';
import ArticleList from './components/ArticleList'
import Form from './components/Form'

function App() {

  const [articles, setArticles] = useState([]);
  const [editedArticle, seteditedArticle] = useState(null);

  useEffect(()=>{
    fetch(`http://localhost:5000/get`,{ // ` olmalı not "
      'method':'GET',
      headers : {
        'Content-Type':'application/json'
      }
    })
    .then(response => response.json())
    .then(response => {console.log(response); setArticles(response)})
    .catch(error => console.log(error))

  },[])

  const editArticle = (article) =>{
    seteditedArticle(article)
  }

  const updatedData = (article) =>{
    const new_article = articles.map(my_Article => {
      if(my_Article.id === article.id){
        return article
      } else{
        return my_Article
      }
    })
    setArticles(new_article)
  } 

  const openForm = (article) =>{
    seteditedArticle({title:"", body:""})
  } 

  const insertArticle = (article) =>{
    const new_articles = [...articles,article] //here first I copied previous articles then added new article
    setArticles(new_articles)
  } 

  const deleteArticle = (article) =>{
    const new_articles = articles.filter(myarticle=>{
      if(myarticle.id === article.id){
        return false
      } else{
        return true
      }
    })
    setArticles(new_articles)
  }

  return (
    <div className="App">
      <div className="row">
        <div className="col">
        <h1>Flask and ReactJS course</h1>
        </div>
        <div className="col">        
        <button className="btn btn-success" onClick={openForm}>Insert Article</button>
        </div>
      </div>

      <br/>
      <br/>
        <ArticleList articles={articles} editArticle={editArticle} deleteArticle={deleteArticle}/>
        {editedArticle ? <Form article={editedArticle} updatedData={updatedData}  insertedArticle={insertArticle}/> : null} 
    </div>
  );
}

export default App;
