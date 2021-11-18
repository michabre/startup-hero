import os
import sys
import json
import sqlite3
import requests
import base64
import urllib.request
import namegenerator

from os.path import join, dirname
from dotenv import load_dotenv, find_dotenv
from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS, cross_origin


load_dotenv(find_dotenv())

app = Flask(__name__)
CORS(app)

url = os.getenv("SITE_URL")
nfts = os.getenv("DB_NFTS")
users = os.getenv("DB_USERS")

#
# Store data in a Sqlite database
#
def db_nfts():
  conn = None
  try:
    conn = sqlite3.connect(nfts)
  except sqlite3.error as e:
    print(e)
  return conn

#
# Setup Users Database
#
def db_users():
  conn = None
  try:
    conn = sqlite3.connect(users)
  except sqlite3.error as e:
    print(e)
  return conn

#
# Get User Collection of Token Ids
#
@app.route('/user/name', methods=["POST"])
@cross_origin()
def getUserCollection():
  conn = db_users()
  cursor = conn.cursor()
  record = None

  if request.method == 'POST':
    user = request.form['stored']
    cursor.execute('SELECT * FROM users WHERE stored=?', (user,))
    record = cursor.fetchone()
    conn.commit()
  
    if record is not None:
      return jsonify(
        collection=record[3]
        ), 200

    else:
      return render_template(
        'index.html', 
        title='404', 
        subtitle='Could not find the user you are looking for.'), 404

#
# Add a User
#
@app.route('/user/add', methods=["POST"])
@cross_origin()
def addUser():
  conn = db_users()
  cursor = conn.cursor()

  if request.method == 'POST':
    new_username = namegenerator.gen()
    new_stored = request.form['stored']
    new_collection = request.form['collection']
    
    sql = """INSERT INTO users (username, stored, collection)
            VALUES (?,?,?)"""
    cursor = cursor.execute(sql, (new_username, new_stored, new_collection))
    conn.commit()

    return  f"User has been added successfully", 201
#
# Landing Page
#
@app.route('/')
def index():
  return render_template(
    'index.html', 
    title='NFT Storage Facility', 
    subtitle='A simple Flask app for managing NFT metadata')

#
# Returns Metadata of JSON based on the TokenId
#
@app.route('/nft/<int:tid>', methods=['GET'])
def nft(tid):
  conn = db_nfts()
  cursor = conn.cursor()
  record = None

  cursor.execute('SELECT * FROM nfts WHERE tid=?', (tid,))
  record = cursor.fetchone()

  if record is not None:
    return jsonify(
      id=record[0],
      tid=record[1],
      name=record[2],
      description=record[3],
      image=record[4], 
      attributes={"hacker":record[5], "artist":record[6], "hustler":record[7], "success":record[8]}
      ), 200

  else:
    return render_template(
      'index.html', 
      title='404', 
      subtitle='Could not find the NFT you are looking for.'), 404

#
# Return a JSON list of all TokenIds
#
@app.route('/nft/collection', methods=['GET'])
def nftCollection():
  conn = db_nfts()
  cursor = conn.cursor()
  sql = """SELECT * FROM nfts WHERE tid IS NOT NULL"""
  cursor.execute(sql)
  records = cursor.fetchall()
  tids = [];

  for row in records:
    tids.append(row[1])
  
  cursor.close()
  conn.commit()

  return jsonify(
    tids=tids
    ), 200
    

#
# Record a newly minted NFT sent via POST
#
@app.route("/nft/create", methods=["POST"])
@cross_origin()
def create():

  conn = db_nfts()
  cursor = conn.cursor()

  if request.method == 'POST':
    new_id = request.form['id']
    new_tid = request.form['tid']
    new_name = request.form['name']
    new_description = request.form['description']
    new_image = url + '/images/' + request.form['image']
    image_name = request.form['image']
    att_hacker = request.form['hacker']
    att_artist = request.form['artist']
    att_hustler = request.form['hustler']
    att_success = request.form['success']
    new_artwork = request.form['artwork']

    sql = """INSERT INTO nfts (id, tid, name, description, image, hacker, artist, hustler, success, artwork)
            VALUES (?,?,?,?,?,?,?,?,?,?)"""
    cursor = cursor.execute(sql, (new_id, new_tid, new_name, new_description, new_image, att_hacker, att_artist, att_hustler, att_success, new_artwork))
    conn.commit()

    base64_img = new_artwork.replace('data:image/png;base64,','')
    base64_img_bytes = base64_img.encode('utf-8')
    base64_img_name = image_name

    with open("./images/" + base64_img_name, 'wb') as file_to_save:
      decoded_image_data = base64.decodebytes(base64_img_bytes)
      file_to_save.write(decoded_image_data)

    return  f"NFT with the id: {cursor.lastrowid} created successfully", 201

#
# Merge NFTs sent via POST
#
@app.route("/nft/merge", methods=["POST"])
@cross_origin()
def merge():

  conn = db_nfts()
  cursor = conn.cursor()

  if request.method == 'POST':
    new_id = request.form['id']
    new_tid = request.form['tid']
    new_name = request.form['name']
    new_description = request.form['description']
    new_image = request.form['image']
    att_hacker = request.form['hacker']
    att_artist = request.form['artist']
    att_hustler = request.form['hustler']
    att_success = request.form['success']
    new_artwork = request.form['artwork']

    sql = """INSERT INTO nfts (id, tid, name, description, image, hacker, artist, hustler, success, artwork)
            VALUES (?,?,?,?,?,?,?,?,?,?)"""
    cursor = cursor.execute(sql, (new_id, new_tid, new_name, new_description, new_image, att_hacker, att_artist, att_hustler, att_success, new_artwork))
    conn.commit()

    return  f"NFT with the id: {cursor.lastrowid} created successfully", 201

#
#
@app.route('/nft/image/<int:tid>', methods=['GET'])
def showNft(tid):
  conn = db_nfts()
  cursor = conn.cursor()
  record = None

  cursor.execute("SELECT * FROM nfts WHERE tid=?", (tid,))
  record = cursor.fetchone()

  return render_template("image.html", image=record[9])

#
# Render an image file
#
@app.route('/images/<str>', methods=['GET'])
def showImage(str):
  img = "images/" + str
  return send_file(img)


#
# Delete an NFT
#
@app.route("/nft/delete", methods=["POST"])
@cross_origin()
def delete():
  conn = db_nfts()
  cursor = conn.cursor()
  if request.method == 'POST':
    burn_tid = request.form['tid']
    sql = """DELETE FROM nfts WHERE tid = ?"""
    cursor.execute(sql, (burn_tid,))
    conn.commit()

    return  f"NFT has been deleted", 201

#
#
if __name__ == '__main__':
  # run debugger
  app.run(debug=True)