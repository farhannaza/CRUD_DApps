import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import CrudApp from './artifacts/CrudApp.json'; // Import the ABI of the smart contract

const App = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [updateItemId, setUpdateItemId] = useState('');
  const [updateItemName, setUpdateItemName] = useState('');
  const [deleteItemId, setDeleteItemId] = useState('');
  const [transferAddress, setTransferAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  useEffect(() => {
    const loadBlockchainData = async () => {
      const web3 = new Web3(Web3.givenProvider);
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const networkData = CrudApp.networks[networkId];
      if (networkData) {
        const abi = CrudApp.abi;
        const address = networkData.address;
        const contract = new web3.eth.Contract(abi, address);
        setContract(contract);

        const itemCount = await contract.methods.nextId().call();
        const items = [];
        for (let i = 0; i < itemCount; i++) {
          try {
            const item = await contract.methods.read(i).call();
            items.push(item);
          } catch (error) {
            console.log('Item not found', i);
          }
        }
        setItems(items);
      } else {
        window.alert('Smart contract not deployed to detected network.');
      }
    };

    loadBlockchainData();
  }, []);

  const createItem = async () => {
    await contract.methods.create(newItemName).send({ from: account });
    window.location.reload();
  };

  const updateItem = async () => {
    await contract.methods.update(updateItemId, updateItemName).send({ from: account });
    window.location.reload();
  };

  const deleteItem = async () => {
    await contract.methods.deleteItem(deleteItemId).send({ from: account });
    window.location.reload();
  };

  const transferMoney = async () => {
    await contract.methods.transfer(transferAddress, Web3.utils.toWei(transferAmount, 'ether')).send({ from: account });
    window.location.reload();
  };

  return (
    <div>
      <h1>CRUD App</h1>
      <p>Your account: {account}</p>

      <h2>Create Item</h2>
      <input
        type="text"
        value={newItemName}
        onChange={(e) => setNewItemName(e.target.value)}
        placeholder="Item Name"
      />
      <button onClick={createItem}>Create</button>

      <h2>Update Item</h2>
      <input
        type="text"
        value={updateItemId}
        onChange={(e) => setUpdateItemId(e.target.value)}
        placeholder="Item ID"
      />
      <input
        type="text"
        value={updateItemName}
        onChange={(e) => setUpdateItemName(e.target.value)}
        placeholder="New Item Name"
      />
      <button onClick={updateItem}>Update</button>

      <h2>Delete Item</h2>
      <input
        type="text"
        value={deleteItemId}
        onChange={(e) => setDeleteItemId(e.target.value)}
        placeholder="Item ID"
      />
      <button onClick={deleteItem}>Delete</button>

      <h2>Transfer Money</h2>
      <input
        type="text"
        value={transferAddress}
        onChange={(e) => setTransferAddress(e.target.value)}
        placeholder="Recipient Address"
      />
      <input
        type="text"
        value={transferAmount}
        onChange={(e) => setTransferAmount(e.target.value)}
        placeholder="Amount in Ether"
      />
      <button onClick={transferMoney}>Transfer</button>

      <h2>Items</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            ID: {item[0]}, Name: {item[1]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
