// create a new table with the necessary headers
function createTable() {
  const table = document.createElement('table');
  const tr = document.createElement('tr');
  table.append(tr);

  const nameTD = document.createElement('th');
  nameTD.innerText = 'Name';
  tr.appendChild(nameTD);
  const phoneTD = document.createElement('th');
  phoneTD.innerText = 'Phone';
  tr.appendChild(phoneTD);
  const roleTD = document.createElement('th');
  roleTD.innerText = 'Role';
  tr.appendChild(roleTD);

  document.body.append(table);
}

// add a row to the table using the json information
function createRow(json) {
  const tr = document.createElement('tr');

  const nameTD = document.createElement('td');
  nameTD.innerText = json.Username;
  tr.append(nameTD);
  const phoneTD = document.createElement('td');
  phoneTD.innerText = json.Phone;
  tr.append(phoneTD);
  const roleTD = document.createElement('td');
  roleTD.innerText = json.Role;
  tr.append(roleTD);

  return tr;
}

// remove the old table and fill up a new table with the filtered users
async function fillTable(prefix) {
  const response = await fetch(`/get_users_prefix?prefix=${prefix}`);
  const responseJson = await response.json();
  const { searchResults } = responseJson;
  if (document.getElementsByTagName('table').length) {
    document.getElementsByTagName('table')[0].remove();
  }
  const messageP = document.getElementById('message');
  if (searchResults.length === 0) {
    messageP.innerText = 'No users found';
    return;
  }
  if (messageP.innerText === 'No users found') {
    messageP.innerText = '';
  }
  createTable();
  const table = document.getElementsByTagName('table')[0];
  for (let i = 0; i < searchResults.length; i++) {
    const tr = createRow(searchResults[i]);

    // button that changes the users role
    const roleButton = document.createElement('button');
    if (searchResults[i].Role === 'admin') {
      roleButton.innerText = 'Demote';
    } else {
      roleButton.innerText = 'Promote';
    }

    roleButton.addEventListener('click', async () => {
      const changeRoleResponse = await fetch('/change_role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: searchResults[i].Username, role: searchResults[i].Role }),
      });

      const changeRoleResponseJson = await changeRoleResponse.json();
      messageP.innerText = changeRoleResponseJson.message;
      if (changeRoleResponse.status === 200) {
        fillTable(document.getElementById('username').value);
      }
    });
    tr.append(roleButton);

    table.append(tr);
  }
}

// fill a table with all users when first loading the page
window.onload = () => {
  const prefixTextbox = document.getElementById('username');
  fillTable(prefixTextbox.value);
  // each time something gets typed, the table is updated
  prefixTextbox.addEventListener('input', () => {
    fillTable(prefixTextbox.value);
  });
};
