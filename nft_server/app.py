import os
import sys
import json
import sqlite3
import requests
import base64
import urllib.request

from PIL import Image
from os.path import join, dirname
from dotenv import load_dotenv, find_dotenv
from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename

from helpers import generateHash, getUnixTimestamp

load_dotenv(find_dotenv())

app = Flask(__name__)
CORS(app)

url = os.getenv("SITE_URL")

#
#
def db_connection():
  conn = None
  try:
    # conn = sqlite3.connect('nfts.sqlite')
    conn = sqlite3.connect('db.sqlite')
  except sqlite3.error as e:
    print(e)
  return conn

#
#
@app.route('/')
def index():
  return render_template('index.html', title="NFT Storage Facility")

#
# Get Metadata based on TokenId
#
@app.route('/nft/<int:tid>', methods=['GET'])
def nft(tid):
  conn = db_connection()
  cursor = conn.cursor()
  record = None

  cursor.execute("SELECT * FROM nfts WHERE tid=?", (tid,))
  record = cursor.fetchone()

  if record is not None:
    return jsonify(
      id=record[0],
      tid=record[1],
      name=record[2],
      description=record[3],
      image=record[4], 
      attributes={"hacker":record[5], "artist":record[6], "hustler":record[7]}
      ), 200

  else:
    return "Something went wrong", 404

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
    new_image = url + '/nft/image/' + new_tid
    att_hacker = request.form['hacker']
    att_artist = request.form['artist']
    att_hustler = request.form['hustler']
    new_artwork = request.form['artwork']

    sql = """INSERT INTO nfts (tid, name, description, image, hacker, artist, hustler, artwork)
            VALUES (?,?,?,?,?,?,?,?)"""
    cursor = cursor.execute(sql, (new_tid, new_name, new_description, new_image, att_hacker, att_artist, att_hustler, new_artwork))
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

  return render_template("image.html", image=record[8])


#
#
if __name__ == '__main__':
  # run debugger
  app.run(debug=True)