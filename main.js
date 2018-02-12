const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const ipc = require('electron').ipcMain

/* Web3/Eth setup */
const Web3 = require('web3');
const fs = require('fs');
const net = require('net');
/* constants */
const _pm_addr = '0x4d28F4e8982d89B86675724CEd3aD420c3f9b05b'
const _pm_pass = 'superfly'
const _gas_price = '35000000000'
const _gas = 1500000


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Keep a global reference to the web3 object for retaining connection
let web3
let _leaseContract

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
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // setup web3 and unlock account
  web3 = new Web3()
  web3.setProvider(new Web3.providers.IpcProvider("/home/altairmn/.ethereum/testnet/geth.ipc", net));
  web3.eth.personal.unlockAccount(_pm_addr, _pm_pass, 1000).then(console.log)
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


/* ipc calls */
ipc.on('create-lease-contract', function(event) {
  fs.readFile('./assets/contracts/Lease.json', 'utf8', function(err, content) {
    _leaseContract = JSON.parse(content)
  });

  event.sender.send('created-lease-contract')
})

ipc.on('add-lease-contract', function(event, leaseUnit, leaseRent) {

  var leaseContract = new web3.eth.Contract(_leaseContract.abi)
  var _rentalAmount = web3.utils.toWei(leaseRent, 'ether')

  var lease = leaseContract.deploy({
      data: _leaseContract.bytecode,
      arguments: [leaseUnit, _rentalAmount]
  }).send({
      from: _pm_addr,
      gas: _gas,
      gasPrice: _gas_price 
  }, function(error, transactionHash) { 
    event.sender.send('lease-broadcasted', transactionHash)
    console.log('TxHash : ' + transactionHash)
  }).on('error', 
      function(error) {
        event.sender.send('error', error)
        console.log(error)
  }).on('transactionHash',
    function(transactionHash) {
      console.log("Transaction hash is: " + transactionHash)
  }).on('receipt', 
    function(receipt) {
    event.sender.send('lease-receipt', receipt.contractAddress)
    console.log("Contract mined! Available at address: " + receipt.contractAddress) // contains the new contract address
  }).on('confirmation',
    function(confirmationNumber, receipt) { 
      console.log("Confirmation Number : " + confirmationNumber + " with receipt: " + receipt)
  }).then(function(newContractInstance) {
      leaseContract.options.address = newContractInstance.options.address;
      console.log(newContractInstance.options.address) // instance with the new contract address
  });
})
