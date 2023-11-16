import React from 'react'
import '../css/card.css';
import axios from 'axios';

function ArticleList(props) {

  const editCard = (card) =>{
    props.editCard(card)
  }

  const deleteCard = async (card) =>{
    try {
      const response = await axios.delete(`http://localhost:5000/delete/${card.id}`);
  
      // Assuming the response contains the inserted card data
      const deletedCard = response.data;
      // Call the callback function with the inserted card data
      props.deleteCard(deletedCard);
      console.log(response.data);
      
    } catch (error) {
      console.error("Error deleting card:", error);
    }
    };

  return (
    <div>
    {props.cards && props.cards.map(card =>{
      return (
        <div className="card" key={card.id}>
          <img src={card.fileURL} alt=''className="card__img" style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }} />
          <div className="card__body">
            <h2 className="card__title">{card.title}</h2>
            <p className="card__description">{card.description}</p>
            <h3 className="card__price">{card.price}</h3>
            <h3 className="card__date">{card.date}</h3>
            <button className="btn btn-primary" onClick={()=>editCard(card)}>Update</button>
            <button className="btn btn-danger" onClick={()=>deleteCard(card)}>Delete</button>
          </div>           
        </div>
      )
    })}</div>
  )
}

export default ArticleList