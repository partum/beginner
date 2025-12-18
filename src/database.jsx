import React, { useState } from 'react';
class Customer {
  constructor(customerDB) {
    this.customerDB = customerDB;
    if (!window.indexedDB) {
      window.alert("Your browser doesn't support IndexedDB.");
    }
  }

  /**
   * Remove all rows from the database
   * @memberof Customer
   */
  removeAllRows = (addToLog) => {
    const request = indexedDB.open(this.customerDB, 1);

    request.onerror = (event) => {
      addToLog('removeAllRows - Database error: ', event.target.error.code,
        " - ", event.target.error.message);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('customers')) {
        addToLog('Database not initialized. Please click Load first.');
        return;
      }
      addToLog('Deleting all customers...');
      const txn = db.transaction('customers', 'readwrite');
      txn.onerror = (event) => {
        addToLog('removeAllRows - Txn error: ', event.target.error.code,
          " - ", event.target.error.message);
      };
      txn.oncomplete = () => {
        addToLog('All rows removed!');
      };
      const objectStore = txn.objectStore('customers');
      const getAllKeysRequest = objectStore.getAllKeys();
      getAllKeysRequest.onsuccess = () => {
        getAllKeysRequest.result.forEach(key => {
          objectStore.delete(key);
        });
      }
    }
  }

  /**
   * Populate the Customer database with an initial set of customer data
   * @param {[object]} customerData Data to add
   * @memberof Customer
   */
  initialLoad = (customerData, addToLog) => {
    const request = indexedDB.open(this.customerDB, 1); 
    request.onerror = (event) => {
      addToLog('initialLoad - Database error: ', event.target.error.code,
        " - ", event.target.error.message);
    };

    request.onupgradeneeded = (event) => {
      addToLog('Populating customers...');
      const db = event.target.result;
      const objectStore = db.createObjectStore('customers', { keyPath: 'userid' });
      objectStore.onerror = (event) => {
        addToLog('initialLoad - objectStore error: ', event.target.error.code,
          " - ", event.target.error.message);
      };

      // Create an index to search customers by name and number
      objectStore.createIndex('fname', 'fname', { unique: false });
      objectStore.createIndex('lname', 'lname', { unique: false });
      objectStore.createIndex('number', 'number', { unique: true });

      // Populate the database with the initial set of rows
      customerData.forEach(function (customer) {
        objectStore.put(customer); //this is not being called for some reason
        console.log('Customer added:', customer);
      });
      //db.close();
    };
    console.log('initialLoad was called');
  }
}

// Web page event handlers
const customerDB = 'customer_db';

/**
 * Clear all customer data from the database
 */
const clearDB = (addToLog) => {
  addToLog('Delete all rows from the Customers database');
  let customer = new Customer(customerDB);
  customer.removeAllRows(addToLog);
}

/**
 * Add customer data to the database
 */
const loadDB = (addToLog) => {
  addToLog('Loading database...');

  // Customers to add to initially populate the database with
  const customerData = [
    { userid: '444', fname: 'Bill', lname: 'Nissenberg', number: '9347623874' },
    { userid: '555', fname: 'Gilda', lname: 'Young', number: '4738572983' }
  ];
  let customer = new Customer(customerDB);
  customer.initialLoad(customerData, addToLog);
  addToLog('Database loaded');
}
//list all entries in the database
const queryDB = (addToLog, setOutput) => {
  const request = indexedDB.open('customer_db', 1);

  request.onerror = (event) => {
    console.error('queryDB - Database error: ', event.target.error.code,
      " - ", event.target.error.message);
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('customers')) {
      addToLog('Database not initialized. Please click Load first.');
      return;
    }
    addToLog('Querying database...');
    const txn = db.transaction('customers', 'readonly');
    txn.onerror = (event) => {
      console.error('queryDB - Transaction error: ', event.target.error.code,
        " - ", event.target.error.message);
    };
    const objectStore = txn.objectStore('customers');
    const getAllRequest = objectStore.getAll();
    getAllRequest.onsuccess = () => {
      const customers = getAllRequest.result;
      addToLog('Got all customers');
      console.table(customers);
      setOutput(customers);
    };
    getAllRequest.onerror = (err) => {
      console.error(`Error to get all customers: ${err}`);
    };
  };
}



function Database() {

  const [status, setStatus] = useState(['Started']);
  const [output, setOutput] = useState('');

  const addToLog = (message) => {
    setStatus(prevStatus => [...prevStatus, message]);
  }

  return (< div className="project">
    <h2>Customer Database</h2>
    <div id="ErrorOutput">
      {status.map((msg, index) => (
        <div key={index}>{msg}</div>
      ))}
    </div>
    <button onClick={() => loadDB(addToLog)}>Load</button>
    <button onClick={() => queryDB(addToLog, setOutput)}>Query</button>
    <button onClick={() => clearDB(addToLog)}>Clear</button>
    <div>
      <h3>Customer List:</h3>
      {output.length > 0 ? (
        output.map((customer, index) => (
          <div key={index}>
            {customer.fname} {customer.lname} - {customer.number}
          </div>
        ))
      ) : (
        <div>No customers found.</div>
      )}
    </div>
  </div>
  )
}
export default Database;