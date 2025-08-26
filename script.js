const addTimerBtn = document.querySelector(".button--add--timer");

const initialize = () => {
  try {
    const user = localStorage.getItem("user");

    try {
      const userObj = JSON.parse(user);
      loadApp(userObj);
    } catch (err) {
      console.log("Error parsing user JSON");
      console.log(err);
      setUpApp();
      return;
    }
  } catch (err) {
    console.log("User most likely does not exist. Loading setup");
    setUpApp();
  }
};

const loadApp = (userObj) => {
  const user = userObj.user;
  const timers = userObj.timers;
  const todos = userObj.todos;

  showUserData(user);
  processTodos(todos);
  processTimers(timers);
};

const showUserData = (user) => {
  const avatarBox = document.querySelector(".avatar__img");
  const nameHeading = document.querySelector(".username");
  const todosComplete = document.getElementById("todos_complete");
  const hoursComplete = document.getElementById("hours_complete");

  nameHeading.innerHTML = user.name;
  avatarBox.setAttribute("src", user.avatar);
  todosComplete.innerHTML = `${user.todosComplete}`;
  hoursComplete.innerHTML = `${user.totalProductiveTime}H`;
};

const processTodos = (todos) => {
  if (todos.length < 1) {
    return;
  } else {
    paintTodos(todos);
  }
};

const processTimers = (timers) => {
  if (timers.length < 1) {
    return;
  } else {
    paintTimers(timers);
  }
};

const paintTimers = (timers) => {
  const timerBox = document.querySelector(".timers-scroll");

  timers.forEach((timer) => {
    const timerHtml = `
       <article class="timer-card">
            <h4 class="timer-card__title">Focus</h4>
            <p class="timer-card__time-left">12:32 left</p>
            <p class="timer-card__time-total">/ 25:00 total</p>
       </article>
    `;
    timerBox.innerHTML += timerHtml;
  });
};

const paintTodos = (todos) => {
  const todoBox = document.querySelector(".todo-list");
  todos.forEach((todo) => {
    const todoHtml = `
      <li class="todo-item">
            <input type="checkbox" checked="${todo.checked}" id="todo1" name="todo" />
            <label for="todo1">${todo.text}</label>
      </li>
    `;

    todoBox.innerHTML += todoHtml;
  });
};

const setUpApp = () => {
  console.log(
    "This is where we will set up the application for a new user or if localStorage failed for some reason"
  );

  window.location.href = "http://127.0.0.1:5500/load.html";
};

window.addEventListener("load", initialize);

if (addTimerBtn) {
  addTimerBtn.addEventListener("click", () => {
    const modalOverlay = document.querySelector(".modal-overlay");
    modalOverlay.classList.add("active");

    modalOverlay.addEventListener("click", (e) => {
      if (e.target.id === "new-timer-modal") {
        modalOverlay.classList.remove("active");

        modalOverlay.removeEventListener("click", this);
      }
    });
  });
}
