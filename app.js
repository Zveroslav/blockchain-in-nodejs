const SHA256 = require('crypto-js/sha256');

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = ''){
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.perviousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash () {
    return SHA256(this.perviousHash + this.timestamp + JSON.stringify(this.transaction) + this.nonce).toString()
  }

  mineBlock(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')){
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}


class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block(0, [])
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1]
  }

  minigPendingTransaction(minigRegardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(null, minigRegardAddress, this.miningReward)
    ]
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalance(address) {
    let balance = 0;

    for (const block of this.chain){
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
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
savejeeCoin.createTransaction(new Transaction('a1', 'a2', 100));
savejeeCoin.createTransaction(new Transaction('a2', 'a1', 50));

console.log('Start minig');

savejeeCoin.minigPendingTransaction('minerAddress');
console.log('Miner balance is: ' + savejeeCoin.getBalance('a2'));


savejeeCoin.minigPendingTransaction('minerAddress');
console.log('Miner balance is: ' + savejeeCoin.getBalance('minerAddress'));

console.log(savejeeCoin.chain.forEach((transactions) => console.log('transactions -> ',transactions)));
