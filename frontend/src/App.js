import './App.css';
import React,{useState,useEffect} from 'react';
import ArticleList from './components/ArticleList'
import Form from './components/Form'
import Show from './components/show'
import axios from 'axios';
import './css/card.css';


function App() {
  
  const [cards, setCards] = useState([]);
  const [editedCard, seteditedCard] = useState(null);
  const [searchedTitle, setsearchedTitle] = useState("");
  const [searchedCard, setSearchedCard] = useState(null);
  
  useEffect(() => {
    fetchData(); // Initial data fetch
  }, []);

  const fetchData = async () => {
    setSearchedCard(null); // Clear the searched card
    try {
      const response = await axios.get('http://localhost:5000/get', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      setCards(response.data);
    } catch (error) {
      console.error(error);
    }
  };

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

  const handleSearch = async () => {
    if(searchedTitle === ""||searchedTitle === " ")setSearchedCard(null);
    else{
      try {
        const formData = new FormData();
        formData.append('searchedTitle', searchedTitle);
        
        const response = await axios.get(`http://localhost:5000/get/${searchedTitle}`, formData);
  
        const searchedCard = response.data;
        setSearchedCard(searchedCard);
  
      } catch (error) {
        console.error('Error searching for card:', error);
      }
    }
  };

  return (
    
    <div className="App">
      <div className="header">
        <div className="header-search-name">
          <h1>Collectify</h1>
        </div>
        <div className="header-search">    
          <input type="text" placeholder="Search..." className='search-btn' value={searchedTitle} onChange={(e)=>setsearchedTitle(e.target.value)}/>
          <button onClick={handleSearch}>Search</button>
          <button onClick={openForm}>Insert Card</button>
        </div>
      </div>

      <br/>
      <br/>
      {!(searchedCard==="" || searchedCard===null) ? <Show searchedCard={searchedCard} fetchData={fetchData}/> : <ArticleList cards={cards} editCard={editCard} deleteCard={deleteCard} />}
      {/* Add more routes as needed */}
      {editedCard ? <Form card={editedCard} updatedData={updatedData} insertedCard={insertCard} /> : null}
    </div>
  
  );
}
// <Route path="/:title" element={searchedCard && <Show searchedCard={searchedCard} />} />

export default App;
