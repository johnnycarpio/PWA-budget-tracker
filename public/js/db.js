let database;
const req = indexedDB.open('budget-tracker', 1);

function saveTransaction(record) {
  const transaction = database.transaction(['newBalance'], 'readwrite');
  const objectStore = transaction.objectStore('newBalance');

  objectStore.add(record);
}

function budgetSync() {
  const transaction = database.transaction(['newBalance'], 'readwrite');
  const objectStore = transaction.objectStore('newBalance');
  const fetchAll      = objectStore.getAll();

  fetchAll.onsuccess = function () {
    if (fetchAll.result.length > 0) {
      fetch(`${apiUrl}/api/transaction`, {
        method: 'POST',
        body: JSON.stringify(fetchAll.result),
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(serverResponse => {
        if (serverResponse.message) {
            throw new Error(serverResponse);
        }

        const transaction = database.transaction(['newBalance'], 'readwrite');
        const objectStore = transaction.objectStore('newBalance');
        objectStore.clear();
        alert('All saved transactions have been submitted!');
      })
      .catch(error => {
          console.log(error);
      });
    }
  };
}

req.onupgradeneeded = function (e) {
  const db = e.target.result;
  db.createObjectStore('newBalance', { autoIncrement: true });
};

req.onsuccess = function (e) {
  database = e.target.result;
  if (navigator.onLine) {
    budgetSync();
  }
};

req.onerror = function (e) {
  console.log(e.target.errorCode);
};

window.addEventListener('online', budgetSync);