from flask import Flask,jsonify,request
from datetime import datetime
import mysql.connector
from flask_cors import CORS
import base64
from io import BytesIO
from PIL import Image
from werkzeug.utils import secure_filename
import boto3
import uuid
import boto3, botocore

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

"""
s3_config = {
    'bucketName': "collectifybucket",
    'albumName' :"images",
    'region' :'us-east-1',
    'accessKeyId': 'AKIA6NTYCBG4H4RCIFXS',
    'secretAccessKey': '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'
}
"""


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
    originalfilename VARCHAR(100) NOT NULL,
    filename VARCHAR(100) NOT NULL,
    bucket VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP
);
"""

cursor.execute(create_table_query)
db_connection.commit()

"""
# single cards serialize
class Cards:
    def __init__(self,title,body):
        self.title = title
        self.body = body
"""
"""
@app.route("/get", methods=["GET"])
def get_cards():
    select_query = 'SELECT * FROM Cards'
    cursor.execute(select_query)
    cards = cursor.fetchall()
    
    result = []
    for card in cards:
        result.append({
            'id': card[0],
            'image': previewUrl,
            'title': card[2],
            'description': card[3],
            'price': card[4],
            'date': card[5].isoformat()  if card[0] else None,
        })

    return jsonify(result)
 
"""
def upload_file_to_s3(filename,content, acl="public-read"):
    """
    Docs: http://boto3.readthedocs.io/en/latest/guide/s3.html
    """
    try:
        s3.upload_fileobj(
            content,
            app.config['S3_BUCKET'],
            filename,
            ExtraArgs={
                "ACL": acl,
                "ContentType": content.content_type   #Set appropriate content type as per the file
            }
        )
    except Exception as e:
        print("Something Happened: ", e)
        return e
    
    print("{}{}".format(app.config["S3_LOCATION"], file.filename))
    return "{}{}".format(app.config["S3_LOCATION"], file.filename)


@app.route("/add", methods=["POST"])
def add_card():
    image = request.json.get('image')
    title = request.json.get('title')
    description = request.json.get('description')
    price = request.json.get('price')
    base64_encoded = request.json.get('base64Encoded')
    previewUrl = request.json.get('previewUrl')
    binary_file = request.json.get('binary_file')
    
    payload = request.json.get('payload')
    filename = payload.get('user_file', {}).get('filename', None)
    content_base64  = payload.get('user_file', {}).get('content', None)
   
   
    
    if image is None or title is None or description is None or price is None:
        return jsonify({'message': 'Invalid request. Title and body are required.'}), 400
    
    # Decode Base64 to binary
    content_bytes  = base64.b64decode(content_base64)
    
    #print("\n\n\n",content_bytes,"\n\n\n")
    output = upload_file_to_s3(filename,content_bytes)
    return 1
    #return jsonify(output)
   
    """
    insert_query = 'INSERT INTO Cards (image,title, description,price) VALUES (%s, %s,%s, %s)'
    data = (image_bytes,title, description,price)
    cursor.execute(insert_query, data)
    db_connection.commit()

    
    # Fetch the newly added card
    select_query = 'SELECT * FROM Cards WHERE id = %s'
    cursor.execute(select_query, (cursor.lastrowid,))
    new_card = cursor.fetchone()
    
    #print("\n\n\n\n ",base64.b64decode(new_card[1]).decode('utf-8'))
    #print("\n\n\n\n ",new_card[1])
    if new_card:
        new_card_dict = {
            'id': new_card[0],
            'image':base64.b64encode(new_card[1]).decode('utf-8'), 
            'title': new_card[2],
            'description': new_card[3],
            'price': new_card[4],
            'date': new_card[5].isoformat()  # Assuming date is the 4th column
        }
        return jsonify(new_card_dict)

    return jsonify({'message': 'Failed to fetch the newly added card.'}), 500


# Fetch card details by ID
@app.route("/get/<id>", methods=["GET"])
def get_card_details(id):
    select_query = 'SELECT * FROM Cards WHERE id = %s'
    cursor.execute(select_query, (id,))
    card = cursor.fetchone()
    
    if card:
        result = {
            'id': card[0],
            'image': previewUrl,
            'title': card[2],
            'description': card[3],
            'price': card[4],
            'date': card[5].isoformat()  if card[0] else None,
        }
        return jsonify(result)
    else:
        return jsonify({'message': 'Card not found'}), 404

# Update card by ID
@app.route("/update/<id>", methods=["PUT"])
def update_card(id):
    title = request.json['title']
    body = request.json['body']
    
    
    update_query = 'UPDATE Cards SET title = %s, body = %s WHERE id = %s'
    data = (title, body, id)
    cursor.execute(update_query, data)
    db_connection.commit()
    
    # Fetch the updated card
    select_query = 'SELECT * FROM Cards WHERE id = %s'
    cursor.execute(select_query, (id,))
    updated_card = cursor.fetchone()

    if updated_card:
        # Convert the card to a dictionary (or use your CardSchema)
        updated_card_dict = {
            'id': updated_card[0],
            'image': base64.b64encode(updated_card[1]).decode('utf-8'),
            'title': updated_card[2],
            'description': updated_card[3],
            'price': updated_card[4],
            'date': updated_card[5].isoformat()  # Assuming date is the 4th column
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
        'image': base64.b64encode(deleted_card[1]).decode('utf-8'),
        'title': deleted_card[2],
        'description': deleted_card[3],
        'price': deleted_card[4],
        'date': deleted_card[5].isoformat()  # Assuming date is the 4th column
    }

    # Return information about the deleted card
    return jsonify({'message': 'Card deleted successfully', 'deleted_card': deleted_card_dict})
"""



if __name__ == "__main__":
    app.run(debug=True)  