const signupForm = document.getElementById("signup-form");
const avatarInput = document.getElementById("avatar");
const clearBtn = document.querySelector(".reset");
const figure = document.querySelector(".avatar-preview");

let memoryFile = null;

const handleAvatarUpload = (e) => {
  console.log(e);
  const file = e.target.files[0];

  if (!file) {
    return;
  } else {
    const img = URL.createObjectURL(file);

    if (!figure || !img) {
      return;
    }

    figure.innerHTML = `
            <img src="${img}" alt="user" class="avatar-preview__frame" /> 
          `;

    storeImage(file);
  }
};

const storeImage = (file) => {
  try {
    const reader = new FileReader();
    reader.onload = function (event) {
      const base64String = event.target.result;

      // Save to localStorage
      memoryFile = base64String;
    };

    reader.readAsDataURL(file);
  } catch (err) {
    console.log(
      `Error loading image into memory as base64 string with file reader. Error: ${err}`
    );
  }
};

const clearAvatar = () => {
  if (figure) {
    figure.innerHTML = `
                 <div
                  class="avatar-preview__frame"
                  role="img"
                  aria-label="Avatar preview placeholder"
                ></div>
                <figcaption class="avatar-preview__caption"
                  >Preview appears here</figcaption
                >
              </figure>
            `;
  }
};

const handleFormSubmit = (e) => {
  e.preventDefault();

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");

  if (nameInput && emailInput) {
    const name = nameInput.value;
    const email = emailInput.value;

    storeUserInApp(name, email);
  }
};

const storeUserInApp = (name, email) => {
  if (!name || !email) {
    console.log(`There is no name or email. Email: ${email}\n Name: ${name}`);

    return;
  }

  try {
    const user = {
      user: {
        name: name,
        email: email,
        avatar: memoryFile,
        todosComplete: 0,
        totalProductiveTime: 0,
      },
      todos: [],
      timers: [],
    };

    const localStorageUser = JSON.stringify(user);

    localStorage.setItem("user", localStorageUser);

    window.location.href = `${window.location.origin}/index.html`;
  } catch (err) {
    console.log(`Error loading localStorage. ${err}`);
  }
};

if (avatarInput) {
  avatarInput.addEventListener("change", handleAvatarUpload);
}

if (clearBtn) {
  clearBtn.addEventListener("click", clearAvatar);
}

if (signupForm) {
  signupForm.addEventListener("submit", handleFormSubmit);
}
