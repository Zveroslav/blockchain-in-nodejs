const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(index, timestamp, data, previousHash = ''){
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.perviousHash = previousHash;
    this.hash = '';
  }

  calculateHash () {

  }
}


