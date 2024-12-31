import React, { useState, useEffect } from "react";
import Web3 from "web3";
import CrudContract from "./contracts/Crud.json";
import Setup from "./components/Setup";

const App = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [data, setData] = useState("");
  const [editId, setEditId] = useState(null);
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const loadBlockchainData = async () => {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545"); // Connect to Ganache
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CrudContract.networks[networkId];
      const timer = setInterval(() => {
        setDateTime(new Date());
      }, 1000);

      if (deployedNetwork) {
        const contractInstance = new web3.eth.Contract(
          CrudContract.abi,
          deployedNetwork.address
        );
        setContract(contractInstance);
        loadItems(contractInstance);
      } else {
        alert("Smart contract not deployed on the detected network.");
      }
    };

    loadBlockchainData();
  }, []);

  const loadItems = async (contractInstance) => {
    const result = await contractInstance.methods.getAllItems().call();
    const ids = result[0];
    const names = result[1];
    const dataList = result[2];
    const allItems = [];

    for (let i = 0; i < ids.length; i++) {
      if (names[i] !== "") {
        allItems.push({ id: ids[i], name: names[i], data: dataList[i] });
      }
    }
    setItems(allItems);
  };

  const createItem = async () => {
    if (contract && name && data) {
      await contract.methods.createItem(name, data).send({ from: account });
      setName("");
      setData("");
      loadItems(contract);
    }
  };

  const deleteItem = async (id) => {
    if (contract) {
      await contract.methods.deleteItem(id).send({ from: account });
      loadItems(contract);
    }
  };

  const updateItem = async () => {
    if (contract && editId !== null) {
      await contract.methods.updateItem(editId, name, data).send({ from: account });
      setEditId(null);
      setName("");
      setData("");
      loadItems(contract);
    }
  };

  const startEditing = (id, currentName, currentData) => {
    setEditId(id);
    setName(currentName);
    setData(currentData);
  };

  return (
    <div className="container">
      <h1 style={{
        color: "green",
        textAlign: "center"

      }}>👋 Welcome to Our new Student Management dApp using React + Truffle!</h1>
      <p style={{
        color: "green",
        textAlign: "center"

      }}
      >Connected Account: {account}</p>

      <Setup />

      <div>
        <input
          style={{
            width: "100 %",
            margin: "3px",
            border: "2px solid #ccc",
            borderRadius: "4px",
            fontsize: "16px",
            backgroundcolor: "white",

            backgroundposition: " 10px 10px",
            backgroundrepeat: "no-repeat",
            padding: "12px 20px 12px 40px",

          }}
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          style={{
            width: "100 %",
            margin: "3px",
            border: "2px solid #ccc",
            borderRadius: "4px",
            fontsize: "16px",
            backgroundcolor: "white",

            backgroundposition: " 10px 10px",
            backgroundrepeat: "no-repeat",
            padding: "12px 20px 12px 40px",

          }}
          type="text"
          placeholder="Student ID"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        {editId !== null ? (
          <button
            style={{
              // display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              padding: '10px 15px',
              margin: '5px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              backgroundColor: '#90ee90',
              color: '#333',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#e8f5e9')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#90ee90')}
            onClick={updateItem}>Update Item</button>
        ) : (
          <button
            style={{
              // display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              padding: '10px 15px',
              margin: '5px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              backgroundColor: '#90ee90',
              color: '#333',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#e8f5e9')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#90ee90')}
            onClick={createItem}>Create Student Entry</button>
        )}
      </div>

      <h2 style={{
        textAlign: "center",
        margin: "10px",
        color: "orange"
      }}
      >STUDENTS INFORMATION</h2>
      <table
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          borderCollapse: "collapse",
          width: "100%"
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                paddingTop: "12px",
                paddingBottom: "12px",
                textAlign: "center",
                backgroundColor: " #04AA6D",
                color: "white",
              }}
            >SL NO.</th>
            <th
              style={{
                paddingTop: "12px",
                paddingBottom: "12px",
                textAlign: "center",
                backgroundColor: " #04AA6D",
                color: "white",
              }}
            >Name</th>
            <th
              style={{
                paddingTop: "12px",
                paddingBottom: "12px",
                textAlign: "center",
                backgroundColor: " #04AA6D",
                color: "white",
              }}
            >Student ID</th>
            <th
              style={{
                paddingTop: "12px",
                paddingBottom: "12px",
                textAlign: "center",
                backgroundColor: " #04AA6D",
                color: "white",
              }}
            >Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td
                style={{
                  border: "1px solid black",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  textAlign: "center",
                  backgroundColor: " white",
                  color: "black",
                }}
              >{item.id}</td>
              <td
                style={{
                  border: "1px solid black",
                  borderColor: "black",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  textAlign: "center",
                  backgroundColor: " white",
                  color: "black",
                }}
              >{item.name}</td>
              <td
                style={{
                  border: "1px solid black",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  textAlign: "center",
                  backgroundColor: " white",
                  color: "black",
                }}
              >{item.data}</td>
              <td
                style={{
                  border: "1px solid black",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  textAlign: "center",
                  backgroundColor: "white",
                  color: "black",
                }}
              >
                <button
                  style={{
                    // display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    padding: '10px 15px',
                    margin: '5px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    backgroundColor: '#90ee90',
                    color: '#333',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#e8f5e9')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#90ee90')}
                  onClick={() => startEditing(item.id, item.name, item.data)}
                >
                  Edit
                </button>
                <button
                  style={{
                    // display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    padding: '10px 15px',
                    margin: '5px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    backgroundColor: '#90ee90',
                    color: '#333',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#e8f5e9')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#90ee90')}
                  onClick={() => deleteItem(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;