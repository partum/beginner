import React, { useState, useEffect, useRef } from 'react';
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
  removeAllRows = () => {
    const request = indexedDB.open(this.customerDB, 1);

    request.onerror = (event) => {
      console.log('removeAllRows - Database error: ', event.target.error.code,
        " - ", event.target.error.message);
    };

    request.onsuccess = (event) => {
      console.log('Deleting all customers...');
      const db = event.target.result;
      const txn = db.transaction('customers', 'readwrite');
      txn.onerror = (event) => {
        console.log('removeAllRows - Txn error: ', event.target.error.code,
          " - ", event.target.error.message);
      };
      txn.oncomplete = (event) => {
        console.log('All rows removed!');
      };
      const objectStore = txn.objectStore('customers');
      const getAllKeysRequest = objectStore.getAllKeys();
      getAllKeysRequest.onsuccess = (event) => {
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
  initialLoad = (customerData) => {
    const request = indexedDB.open(this.customerDB, 1);

    request.onerror = (event) => {
      console.log('initialLoad - Database error: ', event.target.error.code,
        " - ", event.target.error.message);
    };

    request.onupgradeneeded = (event) => {
      console.log('Populating customers...');
      const db = event.target.result;
      const objectStore = db.createObjectStore('customers', { keyPath: 'userid' });
      objectStore.onerror = (event) => {
        console.log('initialLoad - objectStore error: ', event.target.error.code,
          " - ", event.target.error.message);
      };

      // Create an index to search customers by name and number
      objectStore.createIndex('fname', 'fname', { unique: false });
      objectStore.createIndex('lname', 'lname', { unique: false });
      objectStore.createIndex('number', 'number', { unique: true });

      // Populate the database with the initial set of rows
      customerData.forEach(function (customer) {
        objectStore.put(customer);
      });
      db.close();
    };
  }
}

// Web page event handlers
const customerDB = 'customer_db';

/**
 * Clear all customer data from the database
 */
const clearDB = () => {
  console.log('Delete all rows from the Customers database');
  let customer = new Customer(customerDB);
  customer.removeAllRows();
}

/**
 * Add customer data to the database
 */
const loadDB = (setStatus) => {
  console.log('Load the Customers database');
  setStatus('Loading database...');

  // Customers to add to initially populate the database with
  const customerData = [
    { userid: '444', fname: 'Bill', lname: 'Nissenberg', number: '9347623874' },
    { userid: '555', fname: 'Gilda', lname: 'Young', number: '4738572983' }
  ];
  let customer = new Customer(customerDB);
  customer.initialLoad(customerData);
  setStatus('Database loaded');
}
//list all entries in the database
const queryDB = () => {
  const request = indexedDB.open('customer_db', 1);

  request.onerror = (event) => {
    console.error('queryDB - Database error: ', event.target.error.code,
      " - ", event.target.error.message);
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    const txn = db.transaction('customers', 'readonly');
    txn.onerror = (event) => {
      console.error('queryDB - Transaction error: ', event.target.error.code,
        " - ", event.target.error.message);
    };
    const objectStore = txn.objectStore('customers');
    const getAllRequest = objectStore.getAll();
    getAllRequest.onsuccess = () => {
      const customers = getAllRequest.result;
      console.log('Got all customers');
      console.table(customers);
    };
    getAllRequest.onerror = (err) => {
      console.error(`Error to get all customers: ${err}`);
    };
  };
}



function Database() {

  const [status, setStatus] = useState('Started');

  return < div className="project">
    <h2>Customer Database</h2>
    <span id="ErrorOutput">{status}</span>
    <button onClick={() => loadDB(setStatus)}>Load</button>
    <button onClick={queryDB}>Query</button>
    <button onClick={clearDB}>Clear</button>
  </div>
}
export default Database;