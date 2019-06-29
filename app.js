const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(index, timestamp, data, previousHash = ''){
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.perviousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash () {
    return SHA256(this.index + this.perviousHash + this.timestamp + JSON.stringify(this.data) ).toString()
  }
}


