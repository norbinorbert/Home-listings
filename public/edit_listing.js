// edits a listing using fetch API
async function saveListing(event) {
  document.getElementById('error').innerText = '';
  const listingID = event.target.parentNode.id;
  const cityTextbox = document.getElementById('city-textbox');
  const districtTextbox = document.getElementById('district-textbox');
  const areaTextbox = document.getElementById('area-textbox');
  const roomsTextbox = document.getElementById('rooms-textbox');
  const priceTextbox = document.getElementById('price-textbox');

  // get the listing info from the textareas and tds
  let city;
  let district;
  let area;
  let rooms;
  let price;
  if (cityTextbox) {
    city = cityTextbox.value;
  } else {
    city = document.getElementById('city').innerText;
  }
  if (districtTextbox) {
    district = districtTextbox.value;
  } else {
    district = document.getElementById('district').innerText;
  }
  if (areaTextbox) {
    area = areaTextbox.value;
  } else {
    area = document.getElementById('area').innerText;
  }
  if (roomsTextbox) {
    rooms = roomsTextbox.value;
  } else {
    rooms = document.getElementById('rooms').innerText;
  }
  if (priceTextbox) {
    price = priceTextbox.value;
  } else {
    price = document.getElementById('price').innerText;
  }

  // send the new listing data to the server
  const response = await fetch('/edit_listing', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ city, district, area, rooms, price, listingID }),
  });
  const responseJson = await response.json();
  if (response.status !== 200) {
    document.getElementById('error').innerText = responseJson.message;
    return;
  }

  // if successful, remove textareas and button
  event.target.remove();
  if (cityTextbox) {
    cityTextbox.remove();
  }
  document.getElementById('city').innerText = city;
  if (districtTextbox) {
    districtTextbox.remove();
  }
  document.getElementById('district').innerText = district;
  if (areaTextbox) {
    areaTextbox.remove();
  }
  document.getElementById('area').innerText = area;
  if (roomsTextbox) {
    roomsTextbox.remove();
  }
  document.getElementById('rooms').innerText = rooms;
  if (priceTextbox) {
    priceTextbox.remove();
  }
  document.getElementById('price').innerText = price;
}

// replace td data with a textbox that has same text
function createTextbox(event) {
  let textbox = document.getElementById(`${event.target.className}-textbox`);
  if (!textbox) {
    textbox = document.createElement('textarea');
    textbox.id = `${event.target.className}-textbox`;
    textbox.innerText = event.target.innerText;
    textbox.className = event.target.className;
    event.target.innerText = '';
    event.target.append(textbox);
  }
  let saveButton = document.getElementById('save-button');
  if (!saveButton) {
    saveButton = document.createElement('button');
    saveButton.id = 'save-button';
    saveButton.innerText = 'Save';
    saveButton.addEventListener('click', saveListing);
    textbox.parentNode.parentNode.append(saveButton);
  }
}

// add event listeners to all tds that can be modified
window.addEventListener('DOMContentLoaded', () => {
  const tds = document.getElementsByTagName('td');
  for (let i = 0; i < tds.length; i++) {
    if (tds[i].className) {
      tds[i].addEventListener('click', createTextbox);
    }
  }
});
