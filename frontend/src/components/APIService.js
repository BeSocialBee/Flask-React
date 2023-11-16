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

    static InsertCard(body){
    return fetch(`http://localhost:5000/add`,{
            'method':'POST',
                headers : {
            'Content-Type':'application/json'
        },
        body:JSON.stringify(body)
    })
    .then(response => response.json())
    .catch(error => console.log(error))
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