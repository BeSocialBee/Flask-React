from flask import Flask,jsonify,request
from datetime import datetime
import mysql.connector
from flask_cors import CORS
from werkzeug.utils import secure_filename
import boto3
import uuid
import boto3, botocore
import os

app = Flask(__name__)
CORS(app)


app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
#ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png'}
#configure_uploads(app, images) 

 
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

 
 
# MySQL database configuration
db_config = {
    'host': 'database-3.ciqpxqolslw4.eu-north-1.rds.amazonaws.com',
    'user': 'master',
    'password': 'masterpassword',
    'database': 'beedatabase',
    'port': 3306,
}

app.config['S3_BUCKET'] = "collectifybucket3"
app.config['S3_KEY'] = "AKIA6NTYCBG4H4RCIFXS"
app.config['S3_SECRET'] = "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"
app.config['S3_LOCATION'] = 'http://{}.s3.amazonaws.com/'.format(app.config['S3_BUCKET'])

s3 = boto3.client('s3',
                    aws_access_key_id=app.config['S3_KEY'],
                    aws_secret_access_key= app.config['S3_SECRET']
                    )

# Create a MySQL connection
db_connection = mysql.connector.connect(**db_config)
cursor = db_connection.cursor()

# Generate MySQL table if not exists
create_table_query = """
CREATE TABLE IF NOT EXISTS Cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price FLOAT NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    filename VARCHAR(200) NOT NULL,
    fileURL VARCHAR(200) NOT NULL,
    filepath VARCHAR(200) NOT NULL
);
"""
cursor.execute(create_table_query)
db_connection.commit()


@app.route("/get", methods=["GET"])
def get_cards():
    select_query = 'SELECT * FROM Cards'
    cursor.execute(select_query)
    cards = cursor.fetchall()
    
    result = []
    for card in cards:
        result.append({
            'id': card[0],
            'title': card[1], 
            'description': card[2],
            'price': card[3],
            'date': card[4].isoformat(),
            'filename': card[5],  
            'fileURL': card[6],
            'filepath': card[7]  if card[0] else None,
        })

    return jsonify(result)
 

@app.route("/add", methods=["POST"])
def add_card():
    
    try:
        # Retrieve form data
        title = request.form.get('title')
        description = request.form.get('description')
        price = request.form.get('price')

        # Retrieve file data
        image = request.files.get('image')
        
        # Generate a unique filename to avoid overwriting existing files
        filename = secure_filename(image.filename)
        unique_filename = f"{str(uuid.uuid4())}_{filename}"
        
        # Save the file to a temporary location
        temp_filepath = os.path.join('temp', unique_filename)
        image.save(temp_filepath)
        
        # Upload the file to S3
        s3.upload_file(
            temp_filepath,
            app.config['S3_BUCKET'],
            unique_filename
        )
        # Construct the S3 image URL
        s3_image_url = f"http://{app.config['S3_BUCKET']}.s3.amazonaws.com/{unique_filename}"

        insert_query = 'INSERT INTO Cards (title,description,price,filename,fileURL,filepath) VALUES (%s, %s,%s, %s, %s, %s)'
        data = (title,description,price,unique_filename,s3_image_url,temp_filepath)
        cursor.execute(insert_query, data)
        db_connection.commit()
        # Remove the temporary file
        os.remove(temp_filepath)
    
        # Return a response (modify as needed)
        # Fetch the newly added card
        select_query = 'SELECT * FROM Cards WHERE id = %s'
        cursor.execute(select_query, (cursor.lastrowid,))
        new_card = cursor.fetchone()

        
        if new_card:
            new_card_dict = {
                'id': new_card[0],
                'title': new_card[1], 
                'description': new_card[2],
                'price': new_card[3],
                'date': new_card[4].isoformat(),
                'filename': new_card[5],  
                'fileURL': new_card[6],
                'filepath': new_card[7]
            }
            return jsonify(new_card_dict)
        return jsonify({'message': 'Failed to fetch the newly added card.'}), 500

    except Exception as e:
        # Handle exceptions appropriately
        print(f"Error: {str(e)}")
        return jsonify({'message': 'Error processing the request'}), 500
    
 
    

# Fetch card details by ID
@app.route("/get/<id>", methods=["GET"])
def get_card_details(id):
    select_query = 'SELECT * FROM Cards WHERE id = %s'
    cursor.execute(select_query, (id,))
    card = cursor.fetchone()
    
    if card:
        result = {
            'id': card[0],
            'title': card[1], 
            'description': card[2],
            'price': card[3],
            'date': card[4].isoformat(),
            'filename': card[5],  
            'fileURL': card[6],
            'filepath': card[7] if card[0] else None,
        }
        return jsonify(result)
    else:
        return jsonify({'message': 'Card not found'}), 404

# Update card by ID
@app.route("/update/<id>", methods=["PUT"])
def update_card(id):
    # Retrieve form data
    title = request.form.get('title')
    description = request.form.get('description')
    price = request.form.get('price')

    # Retrieve file data
    image = request.files.get('image')
    # Generate a unique filename to avoid overwriting existing files
    filename = secure_filename(image.filename)
    unique_filename = f"{str(uuid.uuid4())}_{filename}"
    s3_image_url = f"http://{app.config['S3_BUCKET']}.s3.amazonaws.com/{unique_filename}"
    # Save the file to a temporary location
    temp_filepath = os.path.join('temp', unique_filename)
    image.save(temp_filepath)
    
    # Upload the file to S3
    s3.upload_file(
        temp_filepath,
        app.config['S3_BUCKET'],
        unique_filename
    )
    
    update_query = 'UPDATE Cards SET title = %s, description = %s, price = %s,filename = %s,fileURL = %s,filepath = %s WHERE id = %s'
    data = (title,description,price,unique_filename,s3_image_url,temp_filepath,id)
    cursor.execute(update_query, data)
    db_connection.commit()
    # Remove the temporary file
    os.remove(temp_filepath)
    
    
    # Fetch the updated card
    select_query = 'SELECT * FROM Cards WHERE id = %s'
    cursor.execute(select_query, (id,))
    updated_card = cursor.fetchone()

    if updated_card:
        # Convert the card to a dictionary (or use your CardSchema)
        updated_card_dict = {
            'id': updated_card[0],
            'title': updated_card[1], 
            'description': updated_card[2],
            'price': updated_card[3],
            'date': updated_card[4].isoformat(),
            'filename': updated_card[5],  
            'fileURL': updated_card[6],
            'filepath': updated_card[7] if updated_card[0] else None,
        }

        # Return the updated card data
        return jsonify(updated_card_dict)

    # If card not found, you may return an appropriate response
    return jsonify({'message': 'Card not found'})


# Delete card by ID
@app.route("/delete/<id>", methods=["DELETE"])
def delete_card(id):
    # Fetch the card to be deleted
    select_query = 'SELECT * FROM Cards WHERE id = %s'
    cursor.execute(select_query, (id,))
    deleted_card = cursor.fetchone()

    if not deleted_card:
        return jsonify({'message': 'Card not found'})

    # Delete the card from the database
    delete_query = 'DELETE FROM Cards WHERE id = %s'
    cursor.execute(delete_query, (id,))
    db_connection.commit()

    # Convert the deleted card to a dictionary (or use your CardSchema)
    deleted_card_dict = {
        'id': deleted_card[0],
        'title': deleted_card[1], 
        'description': deleted_card[2],
        'price': deleted_card[3],
        'date': deleted_card[4].isoformat(),
        'filename': deleted_card[5],  
        'fileURL': deleted_card[6],
        'filepath': deleted_card[7] if deleted_card[0] else None,  # Assuming date is the 4th column
    }

    # Return information about the deleted card
    return jsonify(deleted_card_dict)


if __name__ == "__main__":
    app.run(debug=True)  