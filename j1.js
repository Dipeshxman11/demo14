// Get DOM elements
const myForm = document.querySelector('#my-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const phoneInput = document.querySelector('#phone');
const btn = document.querySelector('.btn');

// Event listeners
myForm.addEventListener('submit', onSubmit);
btn.addEventListener('mouseover', onButtonHover);
btn.addEventListener('click', onButtonClick);

// Load existing users from local storage on page load
window.addEventListener('DOMContentLoaded', () => {
  loadUsersFromStorage();
});

function loadUsersFromStorage() {
  for (let i = 0; i < localStorage.length; i++) {
    const email = localStorage.key(i);
    const user = JSON.parse(localStorage.getItem(email));
    showUsersOnScreen(user);
  }
}

function onSubmit(e) {
  e.preventDefault();

  const name = nameInput.value;
  const email = emailInput.value;
  const phone = phoneInput.value;

  if (name === '' || email === '' || phone === '') {
    showMessage('Please enter all fields.', 'error');
    return;
  }

  // Check if the user already exists in local storage
  const existingUser = localStorage.getItem(email);
  if (existingUser) {
    // If user exists, remove the existing entry
    const parsedUser = JSON.parse(existingUser);
    deleteUser(parsedUser.email, parsedUser.listItem);
  }

  // Create a new user object
  const newUser = {
    name,
    email,
    phone
  };

  // Store updated data in local storage
  localStorage.setItem(newUser.email, JSON.stringify(newUser));
  showUsersOnScreen(newUser);

  // Clear fields
  nameInput.value = '';
  emailInput.value = '';
  phoneInput.value = '';

  // Display success message
  showMessage('Form submitted successfully!');
}

function showUsersOnScreen(newUser) {
  const parentEle = document.getElementById('listOfItems');
  const childEle = document.createElement('li');
  childEle.textContent = newUser.name + ' - ' + newUser.email + ' - ' + newUser.phone;
  parentEle.appendChild(childEle);

  // Create Edit button
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => {
    editUser(newUser);
  });
  childEle.appendChild(editButton);

  // Create Delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    deleteUser(newUser.email, childEle);
  });
  childEle.appendChild(deleteButton);

  // Attach the listItem reference to the user object
  newUser.listItem = childEle;
}

function editUser(user) {
  // Set user details in the form for editing
  nameInput.value = user.name;
  emailInput.value = user.email;
  phoneInput.value = user.phone;

  // Remove the user from UI and local storage
  deleteUser(user.email, user.listItem);
}

function deleteUser(email, listItem) {
  localStorage.removeItem(email);
  listItem.remove();
}

function onButtonHover() {
  console.log('Button hovered');
}

function onButtonClick() {
  console.log('Button clicked');
}

function showMessage(message, type = 'success') {
  const msg = document.querySelector('.msg');
  msg.classList.remove('error', 'success');
  msg.classList.add(type);
  msg.innerHTML = message;

  // Remove message after 3 seconds
  setTimeout(() => {
    msg.innerHTML = '';
  }, 5000);
}
