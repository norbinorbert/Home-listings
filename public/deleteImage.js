async function deleteImage(event) {
  const button = event.target;
  const listingID = button.id.substring(0, button.id.indexOf('|'));
  const pictureName = button.id.substring(button.id.indexOf('|') + 1);

  // send a post method containing the listingID and the name of the image
  const response = await fetch('/delete_image', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pictureName, listingID }),
  });
  const responseJson = await response.json();

  // if image was removed from the server, remove it from the HTML as well
  if (response.status === 200) {
    button.remove();
    document.getElementById(`image-${pictureName}`).remove();
    document.getElementById(`feedback-message-${pictureName}`).innerText = responseJson.message;
  } else {
    document.getElementById(`feedback-message-${pictureName}`).innerText = responseJson.message;
  }
}

// add event listeners to all buttons
window.onload = () => {
  const deleteButtons = document.getElementsByClassName('image-delete');
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener('click', deleteImage);
  }
};
