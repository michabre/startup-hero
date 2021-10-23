# README

## Notes on NFT Storage Facility

## Getting Started

```bash
# setup virtual environment
py -m virtualenv .

# start it up
source ./Scripts/activate

# install dependencies
pip install Flask
pip install flask-cors
pip install requests
pip install Pillow

# create sqllite database
# make sure nfts.sqlite exists
py db_nft.py

# run app
py app.py

```

## Resources

- https://www.tutorialspoint.com/flask/flask_application.htm
- https://www.tutorialspoint.com/sqlite/sqlite_python.htm
- https://flask-cors.corydolphin.com/en/latest/index.html
- https://flask-cors.readthedocs.io/en/latest/
- https://stackoverflow.com/questions/8637153/how-to-return-images-in-flask-response

- https://stackoverflow.com/questions/43013858/how-to-post-a-file-from-a-form-with-axios

- For MD5 hashing:
  [Python MD5 Hashing](https://mkyong.com/python/python-md5-hashing-example/)
- Requests is an elegant and simple HTTP library for Python, built for human beings.
  [Requests](https://docs.python-requests.org/en/master/)
- [Performing an HTTP Request in Python](https://www.datacamp.com/community/tutorials/making-http-requests-in-python)
- [Python PIL | Image.save() method](https://www.geeksforgeeks.org/python-pil-image-save-method/)
