const {BlockChain, Transaction} = require('./blockchain')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

let savejeeCoin = new BlockChain();
const keys = ec.keyFromPrivate('debdabc15d8214aa78de73fe28da7ba7853a4f70c084b1bf31d0659ab59cf774');
const myWalletAddress = keys.getPublic('hex');
const tx1 = new Transaction(myWalletAddress, 'toAddress', 10);
tx1.signTransaction(keys);
savejeeCoin.addTransaction(tx1);

console.log('Start mining');

savejeeCoin.minigPendingTransaction(myWalletAddress);
console.log('MyAddress balance is: ' + savejeeCoin.getBalance(myWalletAddress));
console.log('ToAddress balance is: ' + savejeeCoin.getBalance('toAddress'));


savejeeCoin.minigPendingTransaction(myWalletAddress);
console.log('МyAddress balance is: ' + savejeeCoin.getBalance(myWalletAddress));

