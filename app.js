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


class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()]
  }

  createGenesisBlock(){
    return new Block(0, '01/07/2019', 'Genesis Block', '0')
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1]
  }

  addBlock(newBlock) {
    newBlock.perviousHash = this.getLastBlock();
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock)
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[this.chain.length - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()){
        return false;
      }

      if (previousBlock.hash !== previousBlock.hash){
        return false;
      }
    }

    return true;
  }
}

let savejeeCoin = new BlockChain();
savejeeCoin.addBlock(new Block(1, Date.now(), {amount: 4}));
savejeeCoin.addBlock(new Block(2, Date.now(), {amount: 5}));

