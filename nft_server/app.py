import os
import sys
import json
import sqlite3
import requests
import base64
import urllib.request

from os.path import join, dirname
from dotenv import load_dotenv, find_dotenv
from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS, cross_origin


load_dotenv(find_dotenv())

app = Flask(__name__)
CORS(app)

url = os.getenv("SITE_URL")
db = os.getenv("DB")

#
#
def db_connection():
  conn = None
  try:
    conn = sqlite3.connect(db)
  except sqlite3.error as e:
    print(e)
  return conn

#
#
@app.route('/')
def index():
  return render_template(
    'index.html', 
    title='NFT Storage Facility', 
    subtitle='A simple Flask app for managing NFT metadata')

#
# Get Metadata based on TokenId
#
@app.route('/nft/<int:tid>', methods=['GET'])
def nft(tid):
  conn = db_connection()
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
# Record a newly minted NFT sent via POST
#
@app.route("/nft/create", methods=["POST"])
@cross_origin()
def create():

  conn = db_connection()
  cursor = conn.cursor()

  if request.method == 'POST':
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

    sql = """INSERT INTO nfts (tid, name, description, image, hacker, artist, hustler, success, artwork)
            VALUES (?,?,?,?,?,?,?,?,?)"""
    cursor = cursor.execute(sql, (new_tid, new_name, new_description, new_image, att_hacker, att_artist, att_hustler, att_success, new_artwork))
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

  conn = db_connection()
  cursor = conn.cursor()

  if request.method == 'POST':
    new_tid = request.form['tid']
    new_name = request.form['name']
    new_description = request.form['description']
    new_image = request.form['image']
    att_hacker = request.form['hacker']
    att_artist = request.form['artist']
    att_hustler = request.form['hustler']
    att_success = request.form['success']
    new_artwork = request.form['artwork']

    sql = """INSERT INTO nfts (tid, name, description, image, hacker, artist, hustler, success, artwork)
            VALUES (?,?,?,?,?,?,?,?,?)"""
    cursor = cursor.execute(sql, (new_tid, new_name, new_description, new_image, att_hacker, att_artist, att_hustler, att_success, new_artwork))
    conn.commit()

    return  f"NFT with the id: {cursor.lastrowid} created successfully", 201

#
#
@app.route('/nft/image/<int:tid>', methods=['GET'])
def showNft(tid):
  conn = db_connection()
  cursor = conn.cursor()
  record = None

  cursor.execute("SELECT * FROM nfts WHERE tid=?", (tid,))
  record = cursor.fetchone()

  return render_template("image.html", image=record[9])

#
#
@app.route('/images/<str>', methods=['GET'])
def showImage(str):
  img = "images/" + str
  return send_file(img)

  


#
#
if __name__ == '__main__':
  # run debugger
  app.run(debug=True)