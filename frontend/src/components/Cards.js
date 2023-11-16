import React from 'react'
import '../css/card.css';


function Cards() {
    return (
      <div className="wrapper">
        <Card
          img="https://images.unsplash.com/photo-1612077330269-788066d5ba58?crop=entropy&cs=srgb&fm=jpg&ixid=MXwxNDU4OXwwfDF8cmFuZG9tfHx8fHx8fHw&ixlib=rb-1.2.1&q=85"
          title="Tie Up Boots"
          description="Fall Favorite • Boots"
          price="45.00"
        />
  
        <Card
          img="https://images.unsplash.com/photo-1581497396202-5645e76a3a8e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
          title="Plush Sweater"
          description="Sweater Season • Cozy"
          price="29.95"
        />
        <Card
          img="https://images.unsplash.com/photo-1475178626620-a4d074967452?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=666&q=80"
          title="Slim-Fit Demin"
          description="Demin • Verstile"
          price="24.99"
        />
        <Card
          img="https://images.unsplash.com/photo-1569235080412-01b4eefa5fbe?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
          title="White Blouse"
          description="Blouse • Lacey"
          price="19.95"
        />
      </div>
    );
  }
  
  function Card(props) {
    return (
      <div className="card">
        <img src={props.img} className="card__img" />
        <div className="card__body">
          <h2 className="card__title">{props.title}</h2>
          <p className="card__description">{props.description}</p>
          <h3 className="card__price">{props.price}</h3>
          <button className="card__btn">Add to Cart</button>
        </div>
      </div>
    );
  }
  
export default Cards