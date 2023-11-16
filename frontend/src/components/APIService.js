import axios from 'axios';

export default class APIService{
    // Insert an card
    static UpdateCard(id,body){
    return fetch(`http://localhost:5000/update/${id}`,{
            'method':'PUT',
             headers : {
            'Content-Type':'application/json'
      },
      body:JSON.stringify(body)
    })
    .then(response => response.json())
    .catch(error => console.log(error))
    }

    static InsertCard = async (body) => {

        console.log(body)

        try {
          const response = await axios.post('http://localhost:5000/add', body, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          return response.data;
        } catch (error) {
          console.error(error);
          throw error; // Re-throw the error to handle it in the calling code
        }
      }

    static DeleteCard(id){
        return fetch(`http://localhost:5000/delete/${id}`,{
                'method':'DELETE',
                 headers : {
                'Content-Type':'application/json'
          },
        })
    }
    
}