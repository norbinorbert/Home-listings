let usernameButton;
let phoneButton;
let passwordButton;
let activeForm;

function usernameForm() {
  let form = document.getElementsByTagName('form')[0];
  if (form) {
    form.remove();
  }
  form = document.createElement('form');
  form.action = '/edit_username';
  form.method = 'POST';

  const div1 = document.createElement('div');
  const labelForUsername = document.createElement('label');
  labelForUsername.innerText = 'New username';
  div1.append(labelForUsername);
  const inputForUsername = document.createElement('input');
  inputForUsername.type = 'text';
  inputForUsername.name = 'user';
  inputForUsername.id = 'user';
  inputForUsername.required = true;
  div1.append(inputForUsername);
  form.append(div1);

  const div2 = document.createElement('div');
  const labelForPassword = document.createElement('label');
  labelForPassword.innerText = 'Password';
  div2.append(labelForPassword);
  const inputForPassword = document.createElement('input');
  inputForPassword.type = 'password';
  inputForPassword.name = 'password';
  inputForPassword.id = 'password';
  inputForPassword.required = true;
  div2.append(inputForPassword);
  form.append(div2);

  const div3 = document.createElement('div');
  const submit = document.createElement('input');
  submit.type = 'submit';
  submit.value = 'Change username';
  div3.append(submit);
  form.append(div3);

  activeForm.append(form);
}

function phoneForm() {
  let form = document.getElementsByTagName('form')[0];
  if (form) {
    form.remove();
  }
  form = document.createElement('form');
  form.action = '/edit_phone';
  form.method = 'POST';

  const div1 = document.createElement('div');
  const labelForPhone = document.createElement('label');
  labelForPhone.innerText = 'New phone number';
  div1.append(labelForPhone);
  const inputForPhone = document.createElement('input');
  inputForPhone.type = 'text';
  inputForPhone.name = 'phone';
  inputForPhone.id = 'phone';
  inputForPhone.required = true;
  div1.append(inputForPhone);
  form.append(div1);

  const div2 = document.createElement('div');
  const labelForPassword = document.createElement('label');
  labelForPassword.innerText = 'Password';
  div2.append(labelForPassword);
  const inputForPassword = document.createElement('input');
  inputForPassword.type = 'password';
  inputForPassword.name = 'password';
  inputForPassword.id = 'password';
  inputForPassword.required = true;
  div2.append(inputForPassword);
  form.append(div2);

  const div3 = document.createElement('div');
  const submit = document.createElement('input');
  submit.type = 'submit';
  submit.value = 'Change phone number';
  div3.append(submit);
  form.append(div3);

  activeForm.append(form);
}

function passwordForm() {
  let form = document.getElementsByTagName('form')[0];
  if (form) {
    form.remove();
  }
  form = document.createElement('form');
  form.action = '/edit_password';
  form.method = 'POST';

  const div1 = document.createElement('div');
  const labelForOldPassword = document.createElement('label');
  labelForOldPassword.innerText = 'Old password';
  div1.append(labelForOldPassword);
  const inputForOldPassword = document.createElement('input');
  inputForOldPassword.type = 'password';
  inputForOldPassword.name = 'old-password';
  inputForOldPassword.id = 'old-password';
  inputForOldPassword.required = true;
  div1.append(inputForOldPassword);
  form.append(div1);

  const div2 = document.createElement('div');
  const labelForPassword = document.createElement('label');
  labelForPassword.innerText = 'New password';
  div2.append(labelForPassword);
  const inputForPassword = document.createElement('input');
  inputForPassword.type = 'password';
  inputForPassword.name = 'password';
  inputForPassword.id = 'password';
  inputForPassword.required = true;
  div2.append(inputForPassword);
  form.append(div2);

  const div3 = document.createElement('div');
  const labelForConfirm = document.createElement('label');
  labelForConfirm.innerText = 'Confirm new password';
  div3.append(labelForConfirm);
  const inputForConfirm = document.createElement('input');
  inputForConfirm.type = 'password';
  inputForConfirm.name = 'password2';
  inputForConfirm.id = 'password2';
  inputForConfirm.required = true;
  div3.append(inputForConfirm);
  form.append(div3);

  const div4 = document.createElement('div');
  const submit = document.createElement('input');
  submit.type = 'submit';
  submit.value = 'Change password';
  div4.append(submit);
  form.append(div4);

  activeForm.append(form);
}

window.onload = () => {
  usernameButton = document.getElementById('username-change');
  phoneButton = document.getElementById('phone-change');
  passwordButton = document.getElementById('password-change');

  activeForm = document.getElementById('active-form');

  usernameButton.addEventListener('click', () => {
    usernameButton.style.visibility = 'hidden';
    phoneButton.style.visibility = 'visible';
    passwordButton.style.visibility = 'visible';
    usernameForm();
    activeForm.style.visibility = 'visible';
  });

  phoneButton.addEventListener('click', () => {
    usernameButton.style.visibility = 'visible';
    phoneButton.style.visibility = 'hidden';
    passwordButton.style.visibility = 'visible';
    phoneForm();
    activeForm.style.visibility = 'visible';
  });

  passwordButton.addEventListener('click', () => {
    usernameButton.style.visibility = 'visible';
    phoneButton.style.visibility = 'visible';
    passwordButton.style.visibility = 'hidden';
    passwordForm();
    activeForm.style.visibility = 'visible';
  });
};
