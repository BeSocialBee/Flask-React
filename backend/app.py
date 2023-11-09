from flask import Flask,jsonify,request
from datetime import datetime
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# MySQL database configuration
db_config = {
    'host': 'database-3.ciqpxqolslw4.eu-north-1.rds.amazonaws.com',
    'user': 'master',
    'password': 'masterpassword',
    'database': 'beedatabase',
    'port': 3306,
}

# Create a MySQL connection
db_connection = mysql.connector.connect(**db_config)
cursor = db_connection.cursor()

# Generate MySQL table if not exists
create_table_query = """
CREATE TABLE IF NOT EXISTS Articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    body TEXT NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
);
"""

cursor.execute(create_table_query)

"""
# single article serialize
class Articles:
    def __init__(self,title,body):
        self.title = title
        self.body = body
"""

@app.route("/get", methods=["GET"])
def get_articles():
    select_query = 'SELECT * FROM Articles'
    cursor.execute(select_query)
    articles = cursor.fetchall()
    
    result = []
    for article in articles:
        result.append({
            'id': article[0],
            'title': article[1],
            'body': article[2],
            'date': article[3].isoformat() if article[3] else None,
        })

    return jsonify(result)
 


@app.route("/add", methods=["POST"])
def add_article():
    title = request.json.get('title')
    body = request.json.get('body')

    if title is None or body is None:
        return jsonify({'message': 'Invalid request. Title and body are required.'}), 400

    insert_query = 'INSERT INTO Articles (title, body) VALUES (%s, %s)'
    data = (title, body)
    cursor.execute(insert_query, data)
    db_connection.commit()

    # Fetch the newly added article
    select_query = 'SELECT * FROM Articles WHERE id = %s'
    cursor.execute(select_query, (cursor.lastrowid,))
    new_article = cursor.fetchone()

    if new_article:
        new_article_dict = {
            'id': new_article[0],
            'title': new_article[1],
            'body': new_article[2],
            'date': new_article[3].isoformat()  # Assuming date is the 4th column
        }
        return jsonify(new_article_dict)

    return jsonify({'message': 'Failed to fetch the newly added article.'}), 500


# Fetch article details by ID
@app.route("/get/<id>", methods=["GET"])
def get_article_details(id):
    select_query = 'SELECT * FROM Articles WHERE id = %s'
    cursor.execute(select_query, (id,))
    article = cursor.fetchone()
    
    if article:
        result = {
            'id': article[0],
            'title': article[1],
            'body': article[2],
            'date': article[3].isoformat() if article[3] else None,
        }
        return jsonify(result)
    else:
        return jsonify({'message': 'Article not found'}), 404

# Update article by ID
@app.route("/update/<id>", methods=["PUT"])
def update_article(id):
    title = request.json['title']
    body = request.json['body']
    
    
    update_query = 'UPDATE Articles SET title = %s, body = %s WHERE id = %s'
    data = (title, body, id)
    cursor.execute(update_query, data)
    db_connection.commit()
    
    # Fetch the updated article
    select_query = 'SELECT * FROM Articles WHERE id = %s'
    cursor.execute(select_query, (id,))
    updated_article = cursor.fetchone()

    if updated_article:
        # Convert the article to a dictionary (or use your ArticleSchema)
        updated_article_dict = {
            'id': updated_article[0],
            'title': updated_article[1],
            'body': updated_article[2],
            'date': updated_article[3].isoformat()  # Assuming date is the 4th column
        }

        # Return the updated article data
        return jsonify(updated_article_dict)

    # If article not found, you may return an appropriate response
    return jsonify({'message': 'Article not found'})


# Delete article by ID
@app.route("/delete/<id>", methods=["DELETE"])
def delete_article(id):
    # Fetch the article to be deleted
    select_query = 'SELECT * FROM Articles WHERE id = %s'
    cursor.execute(select_query, (id,))
    deleted_article = cursor.fetchone()

    if not deleted_article:
        return jsonify({'message': 'Article not found'})

    # Delete the article from the database
    delete_query = 'DELETE FROM Articles WHERE id = %s'
    cursor.execute(delete_query, (id,))
    db_connection.commit()

    # Convert the deleted article to a dictionary (or use your ArticleSchema)
    deleted_article_dict = {
        'id': deleted_article[0],
        'title': deleted_article[1],
        'body': deleted_article[2],
        'date': deleted_article[3].isoformat()  # Assuming date is the 4th column
    }

    # Return information about the deleted article
    return jsonify({'message': 'Article deleted successfully', 'deleted_article': deleted_article_dict})




if __name__ == "__main__":
    app.run(debug=True)  