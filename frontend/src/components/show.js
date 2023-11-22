import React from "react";
import ArticleList from './ArticleList'

function Show(props) {

    const allCards = async () => {
        props.fetchData();
    };

    return (
    <div className='wrapper'>
    <div className="card" key={props.searchedCard.id}>
        <h2>Search Result</h2>
        <img src={props.searchedCard.fileURL} alt=''className="card__img" style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }} />
        <div className="card__body">
        <h2 className="card__title">{props.searchedCard.title}</h2>
        <p className="card__description">{props.searchedCard.description}</p>
        <h3 className="card__price">$ {props.searchedCard.price}</h3>
        <h3 className="card__date">{props.searchedCard.date}</h3>
        <button className="btn btn-primary" onClick={()=>ArticleList.editCard(props.searchedCard)}>Update</button>
        <button className="btn btn-danger" onClick={()=>ArticleList.deleteCard(props.searchedCard)}>Delete</button>
        </div>
        <button className="btn btn-success" onClick={allCards}>All Cards</button>          
    </div>
    </div>
    )
}

export default Show