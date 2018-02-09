const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')


//const Web3 = require('web3');
//var web3 = new Web3();
//const fs = require('fs');
//web3.setProvider(new Web3.providers.IpcProvider("/home/altairmn/.ethereum/testnet/geth.ipc", net));
//
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

//const _pm_addr = "0x4d28F4e8982d89B86675724CEd3aD420c3f9b05b"
//const _gasPrice = '35000000000'
//const _gas = 1500000
//
//
///* Unlock account */
//web3.eth.personal.unlockAccount("0x4d28F4e8982d89B86675724CEd3aD420c3f9b05b", "superfly", 1000).then(console.log)
//
///* Lease Contract */
//let _leaseContract 
//fs.readFile('./assets/contracts/Lease.json', 'utf8', function(err, content) {
//  _leaseContract = JSON.parse(content)
//});
//
//let leaseContract

function getContract() {
  leaseContract = new web3.eth.Contract(_leaseContract.abi)
  toastr.info("Got Contract!")
}

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
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
