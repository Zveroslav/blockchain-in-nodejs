const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  calculateHash() {
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
  }

  signTransaction(signKey) {
    if (signKey.getPublic('hex') !== this.fromAddress){
      throw Error('You can not sign anthers transaction')
    }

    const hashTx = this.calculateHash();
    const sig = signKey.sign(hashTx, 'base64')
    this.signature = sig.toDER('hex');
  }

  isValid() {
    if (this.fromAddress == null) {
      return true
    }

    if (!this.signature || this.signature.length === 0) {
      return false;
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
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

  hasValdTransaction() {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false
      }
    }

    return true
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

  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw Error('For transaction need to and from address')
    }

    if (!transaction.isValid()){
      throw Error('Invalid transaction')
    }
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

      if (!currentBlock.hasValdTransaction()) {
        return false;
      }

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

module.exports.BlockChain = BlockChain;
module.exports.Transaction = Transaction;
