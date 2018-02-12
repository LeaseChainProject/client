/* Imports */
const toastr = require('toastr')
const ipc = require('electron').ipcRenderer



/* Create-lease-contract */
const createLeaseContract = document.getElementById("create-lease-contract")

createLeaseContract.addEventListener('click', function() {
  ipc.send('create-lease-contract')
})

ipc.on('created-lease-contract', function(event) {
  const message = "Lease contract created"
  toastr.info(message)
})


/* add lease contract */
const addLeaseContract = document.getElementById("add-lease-contract")

addLeaseContract.addEventListener('click', function() {
  const leaseUnit = document.getElementById("unit-input").value
  const leaseRent = document.getElementById("rent-input").value
  ipc.send('add-lease-contract', leaseUnit, leaseRent)
})

ipc.on('lease-broadcasted', function(event, transactionHash) {
  toastr.info("Lease Broadcasted: " + transactionHash)
})
ipc.on('error', function(event, error) {
  toastr.error(error)
})
ipc.on('lease-receipt', function(event, leaseAddress) {
  toastr.info("Lease on Blockchain with address: " + leaseAddress)
})



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
