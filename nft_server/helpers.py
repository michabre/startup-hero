import hashlib
from datetime import datetime
import calendar

#
#
#
def generateHash(timestamp, privateKey, publicKey):
  hash_string = timestamp + privateKey + publicKey
  return hashlib.md5(str.encode(hash_string)).hexdigest()


#
#
#
def getUnixTimestamp():
    d = datetime.utcnow()
    unixtime = calendar.timegm(d.utctimetuple())
    return str(unixtime)