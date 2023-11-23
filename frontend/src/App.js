import './App.css';
import React,{useState,useEffect} from 'react';
import ArticleList from './components/ArticleList'
import Form from './components/Form'
import Show from './components/show'
import axios from 'axios';
import './css/card.css';
import './css/sidebar.css';
import CollectionForm from './components/CollectionForm'
// Import necessary components
import Sidebar from './components/Sidebar';


function App() {
  
  /* card */
  const [cards, setCards] = useState([]);
  const [editedCard, seteditedCard] = useState(null);
  const [searchedTitle, setsearchedTitle] = useState("");
  const [searchedCard, setSearchedCard] = useState(null);
  const [sortCondition, setSortCondition] = useState(""); // Add state for sorting condition
  const [openFormType, setOpenFormType] = useState("");

  /* collection */
  const [collections, setCollections] = useState([]);
  const [editedCollection, seteditedCollection] = useState(null);
  // State to manage the visibility of the sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchCollections();
   //fetchData(); // Initial data fetch
  }, []);


  const fetchData = async (collectionName) => {
    setSearchedCard(null); // Clear the searched card
    try {
      const formData = new FormData();
      formData.append('collectionName', collectionName);
      const response = await axios.post(`http://localhost:5000/get`, formData);
      const searchedCard = response.data;
      setCards(searchedCard);
    } catch (error) {
      console.error('Error searching for card:', error);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getCollections', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      setCollections(response.data);
    } catch (error) {
      console.error(error);
    }
  };


  const editCard = (card) =>{
    seteditedCard(card);
  }

  const updatedData = (card) =>{
    const new_cards = cards.map(my_card => {
      if(my_card.id === card.id){
        return card
      } else{
        return my_card
      }
    })
    setCards(new_cards)
  } 

  const openForm = (card) =>{
    seteditedCard({fileURL:"",image:"",title:"",description:"",price:"",collectionName:""})
    setOpenFormType("card");
  } 

 

   // Callback function to close the form
   const handleCloseForm = () => {
    seteditedCard(null);
  };

  const insertCard = (card) =>{
    const new_cards = [...cards,card] //here first I copied previous cards then added new card
    setCards(new_cards)
  } 

  const insertCollection = (collection) =>{
    const new_collections = [...collections,collection] //here first I copied previous collections then added new collection
    setCollections(new_collections)
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

  // Handler for changing the sorting condition
  const handleSortChange = async (condition) => {
    if(!condition || condition.trim() === "")
    {
      setSearchedCard(null);
    }
    else{
      try {
        const formData = new FormData();
        formData.append('sortCondition',condition)
        const response = await axios.post(`http://localhost:5000/sort`, formData);
        setCards(response.data);
      } catch (error) {
        console.error('Error sorting for cards:', error);
      }
    }
  };
  

  // -------------------------- COLLECTIONS --------------------------------

  const openCollectionForm = (collection) =>{
    seteditedCollection({collectionName:""})
    setOpenFormType("collection");
  } 
  // Callback function to close the form
  const handleCloseCollectionForm = () => {
    seteditedCollection(null);
  };

  // Function to handle the click on a collection in the sidebar
  const handleCollectionClick = (collection) => {
    console.log(`Clicked on collection: ${collection.collectionName}`);
    fetchData(collection.collectionName);
  };

  function openSidebar() {
    setSidebarOpen(true);
    fetchCollections(); 
  }
  
  function closeSidebar() {
    setSidebarOpen(false);
  }
  // -----------------------------------------------------------------------

  return (
    <div className="App">
       {/* Main Content */}
       <div className="main-content">
        <div className="header">
          <div className="header-search-name">
            <h1>Collectify</h1>
          </div>
          
          <div className="header-search">    
            <input type="text" placeholder=" Search..." className='search-btn' value={searchedTitle} onChange={(e)=>setsearchedTitle(e.target.value)}/>
            <button onClick={handleSearch}>Search</button>
            <button onClick={openForm}>Insert Card</button>
            <button onClick={openCollectionForm}>Add Collection</button>
            {/* Add sorting options here */}
            <select className='sort-select' value={sortCondition} onChange={(e)=>{setSortCondition(e.target.value); handleSortChange(e.target.value);}}>
              <option disabled value="">Sort</option>
              <option value="title-desc">Title    ↓</option>
              <option value="title-asc">Title     ↑</option>
              <option value="price-desc">Price    ↓</option>
              <option value="price-asc">Price     ↑</option>
              {/* Add more options as needed */}
            </select>
          </div>
        </div>

         {/* Sidebar */}
        <div className="sidebar" >
          <div class="icon-container">
            <span class="menu-icon" onMouseOver={openSidebar} >&#9776;</span>  
            <h3 className='title'>Collections</h3>
          </div>
          <div onMouseLeave={closeSidebar}>
          {sidebarOpen && <Sidebar closeSidebar={closeSidebar} collections={collections} handleCollectionClick={handleCollectionClick} />}
          </div>
        </div>

        <br/>
        <br/>
        {!(searchedCard==="" || searchedCard===null) ? <Show searchedCard={searchedCard} fetchData={fetchData}/> : <ArticleList cards={cards} editCard={editCard} deleteCard={deleteCard} />}
        {/* Add more routes as needed */}
        
        {/*<ArticleList cards={cards} editCard={editCard} deleteCard={deleteCard}/>*/}
        {(editedCard && openFormType === "card") ? <Form onClose={handleCloseForm} card={editedCard} updatedData={updatedData}  collections={collections}  insertedCard={insertCard}/> : null} 
        {(editedCollection && openFormType === "collection") ?  <CollectionForm onClose={handleCloseCollectionForm} collection={editedCollection} insertedCollection={insertCollection} /> : null} 
        
        </div>
      </div>
  );
}

/**
 * {openFormType === "card" && (
          <Form onClose={handleCloseForm} card={editedCard} updatedData={updatedData} insertedCard={insertCard} collections={collections} />
        )}

        {openFormType === "collection" && (
          <CollectionForm onClose={handleCloseCollectionForm} collection={editedCollection} insertedCollection={insertCollection} />
        )}
 */
// <Route path="/:title" element={searchedCard && <Show searchedCard={searchedCard} />} />

export default App;
