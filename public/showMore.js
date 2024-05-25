// gets the listing information of the row that was clicked on and updates the table data
async function showMore(event) {
  const listingID = event.target.parentNode.id;
  const response = await fetch(`/get_listing/${listingID}`);
  if (response.status !== 200) {
    document.getElementById(`listing-error-${listingID}`).innerText = "Couldn't get info about listing";
    return;
  }
  const responseJson = await response.json();
  const { listing } = responseJson;
  document.getElementById(`listing-city-${listingID}`).innerText = listing.City;
  document.getElementById(`listing-district-${listingID}`).innerText = listing.District;
  document.getElementById(`listing-area-${listingID}`).innerText = listing.Area;
  document.getElementById(`listing-price-${listingID}`).innerText = listing.Price;
  document.getElementById(`listing-rooms-${listingID}`).innerText = listing.Rooms;
  document.getElementById(`listing-date-${listingID}`).innerText = new Date(listing.Date).toLocaleDateString('en-us', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// add an event listener to all rows of the table
window.onload = () => {
  const rows = document.getElementsByClassName('listing-row');
  for (let i = 0; i < rows.length; i++) {
    rows[i].addEventListener('click', showMore);
  }
};
