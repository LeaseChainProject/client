/* Imports */
const toastr = require('toastr')
const ipc = require('electron').ipcRenderer


 /*constants */
const _pm_addr = "0x4d28F4e8982d89B86675724CEd3aD420c3f9b05b"
const _gasPrice = '35000000000'
const _gas = 1500000



/* Unlock account */
web3.eth.personal.unlockAccount("0x4d28F4e8982d89B86675724CEd3aD420c3f9b05b", "superfly", 1000).then(console.log)

/* Lease Contract */
let _leaseContract 
fs.readFile('./assets/contracts/Lease.json', 'utf8', function(err, content) {
  _leaseContract = JSON.parse(content)
});

let leaseContract

const addContractBtn = document.getElementById("create-contract-button")
addContractBtn.addEventListener('click', function (event) {
  leaseContract = new web3.eth.Contract(_leaseContract.abi)
  toastr.info("Got Contract!")
});


var emailAddrText = document.getElementById("exampleInputEmail1").value


function deployContract(_rentalInterval = 30, _rentalAmount = web3.utils.toWei("0.02", "ether")) {
  var lease = leaseContract.deploy({
      data: _leaseContract.bytecode,
      arguments: [_rentalInterval, _rentalAmount]
  }).send({
      from: '0x4d28F4e8982d89B86675724CEd3aD420c3f9b05b',
      gas: 1500000,
      gasPrice: '35000000000'
  }, function(error, transactionHash){ 
    toastr.info("Transaction with TxHash: " + transactionHash + " waiting to be mined.")
    console.log("Transaction with TxHash: " + transactionHash + " waiting to be mined.")}).on('error', 
      function(error) {
        console.log(error)
  }).on('transactionHash',
    function(transactionHash) {
      toastr.info("Transaction hash is: " + transactionHash)
      console.log("Transaction hash is: " + transactionHash)
  }).on('receipt', 
    function(receipt) {
    toastr.success("Contract mined! Available at address: " + receipt.contractAddress) // contains the new contract address
    console.log("Contract mined! Available at address: " + receipt.contractAddress) // contains the new contract address
  }).on('confirmation',
    function(confirmationNumber, receipt) { 
      toastr.info("Confirmation Number : " + confirmationNumber + " with receipt: " + receipt)
      console.log("Confirmation Number : " + confirmationNumber + " with receipt: " + receipt)
  }).then(function(newContractInstance) {
      leaseContract.options.address = newContractInstance.options.address;
      console.log(newContractInstance.options.address) // instance with the new contract address
  });
}

/* Add leaseApplicants */
/*
leaseContract.methods.addApplicant("0x61c31C3B32D2661a0AA853484BD01ba5357CC091").send({
  from: "0x4d28F4e8982d89B86675724CEd3aD420c3f9b05b",
  gas: _gas,
  gasPrice: _gasPrice
}).on("transactionHash", function(transactionHash) {
  console.log("Transaction sent with TxHash: " + transactionHash)
}).on("error",
  console.error
).on("receipt", function(receipt){
  console.log(receipt);
})
*/
