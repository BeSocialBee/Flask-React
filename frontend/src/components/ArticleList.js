import React from 'react'
import APIService from './APIService'
import '../css/card.css';

function ArticleList(props) {

  const editCard = (card) =>{
    props.editCard(card)
  }

  const deleteCard = (card) =>{
    APIService.DeleteCard(card.id)
    .then(()=>props.deleteCard(card))
  }
//
  return (
    <div>
    {props.cards && props.cards.map(card =>{
      return (
        <div className="card" key={card.id}>
          <img width={100} height={100} src={`data:image/png;base64,${card.image}`} alt=''className="card__img"  />
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