const showFormInputs = function() {
  var formInputs = `<h4>Change ${clickedField}</h4>` +
                   '<input type="text" id="new-input" placeholder="New Value"><br>' +
                   '<input type="password" id="auth" placeholder="Password"><br>' +
                   '<button id="submit">Submit</button>';

  document.getElementById('change-info').innerHTML = formInputs;
  document.getElementById('submit').addEventListener('click',()=>{requestChange(false)})
}
const showPasswordChange = function() {
  var formInputs = `<h4>Change Password</h4>` +
                   '<input type="password" id="new-pass" placeholder="New Password"><br>' +
                   '<input type="password" id="new-pass-confirm" placeholder="Confirm New Password"><br>' +
                   '<input type="password" id="auth" placeholder="Current Password"><br>' +
                   '<button id="submit-pass">Submit</button>';

  document.getElementById('change-info').innerHTML = formInputs;
  document.getElementById('submit-pass').addEventListener('click',()=>{requestChange(true)})
}

const requestChange = function(pass) {
  var change, new_val, password = null;
  if (pass) {
    change = 'password';
    new_val = document.getElementById("new-pass").value;
  } else {
    change = clickedField;
    new_val = document.getElementById("new-input").value;
  }

  password = document.getElementById("auth").value;

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:8080/change-user', true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  var data = JSON.stringify({
    field: change,
    new_val: new_val,
    pass: password
  });

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // Handle the response from the server
        console.log(xhr.responseText);
      } else {
        // Handle error
        console.log(xhr.statusText);
      }
    }
  };

  xhr.send(data);
}

var clickedField;

window.addEventListener('load', () => {
  document.getElementById('username').addEventListener('click', () => {
    clickedField = 'username';
    showFormInputs();
  });
  document.getElementById('email').addEventListener('click', () => {
    clickedField = 'email';
    showFormInputs();
  });
  document.getElementById('password').addEventListener('click', () => {
    showPasswordChange();
  });
});