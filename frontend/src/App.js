import './App.css';
import React,{useState,useEffect} from 'react';
import ArticleList from './components/ArticleList'
import Form from './components/Form'

function App() {

  const [cards, setCards] = useState([]);
  const [editedCard, seteditedCard] = useState(null);
  /*
  useEffect(()=>{
    fetch(`http://localhost:5000/get`,{ // ` olmalı not "
      'method':'GET',
      headers : {
        'Content-Type':'application/json'
      }
    })
    .then(response => response.json())
    .then(response => {console.log(response); setCards(response)})
    .catch(error => console.log(error))

  },[])*/

  const editCard = (card) =>{
    seteditedCard(card)
  }

  const updatedData = (card) =>{
    const new_card = cards.map(my_card => {
      if(my_card.id === card.id){
        return card
      } else{
        return my_card
      }
    })
    setCards(new_card)
  } 

  const openForm = (card) =>{
    seteditedCard({image:"",title:"",description:"",price:""})
  } 

  const insertCard = (card) =>{
    const new_cards = [...cards,card] //here first I copied previous cards then added new card
    setCards(new_cards)
  } 

  const deleteCard = (card) =>{
    const new_cards = cards.filter(mycard=>{
      if(mycard.id === card.id){
        return false
      } else{
        return true
      }
    })
    setCards(new_cards)
  }

  return (
    <div className="App">
      <div className="row">
        <div className="col">
        <h1>Collectify</h1>
        </div>
        <div className="col">        
        <button className="btn btn-success" onClick={openForm}>Insert Card</button>
        </div>
      </div>

      <br/>
      <br/>
        <ArticleList cards={cards} editCard={editCard} deleteCard={deleteCard}/>
        {editedCard ? <Form card={editedCard} updatedData={updatedData}  insertedCard={insertCard}/> : null} 
    </div>
  );
}

export default App;
