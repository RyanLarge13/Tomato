const addTimerBtn = document.querySelector(".button--add--timer");
let user = null;
let timers = [];
let todos = [];

const initialize = () => {
  try {
    const user = localStorage.getItem("user");

    try {
      const userObj = JSON.parse(user);
      loadApp(userObj);
    } catch (err) {
      console.log("Error parsing user JSON");
      console.log(err);
      // return;
      setUpApp();
    }
  } catch (err) {
    console.log("User most likely does not exist. Loading setup");
    // return;
    setUpApp();
  }
};

const loadApp = (userObj) => {
  user = userObj.user;
  timers = userObj.timers;
  todos = userObj.todos;

  showUserData();
  processTodos();
  processTimers();
};

const showUserData = () => {
  const avatarBox = document.querySelector(".avatar__img");
  const nameHeading = document.querySelector(".username");
  const todosComplete = document.getElementById("todos_complete");
  const hoursComplete = document.getElementById("hours_complete");

  nameHeading.innerHTML = user.name;
  avatarBox.setAttribute("src", user.avatar);
  todosComplete.innerHTML = `${user.todosComplete}`;
  hoursComplete.innerHTML = `${user.totalProductiveTime}H`;
};

const processTodos = () => {
  if (todos.length < 1) {
    return;
  } else {
    paintTodos();
  }
};

const processTimers = () => {
  paintTimers();
  setInterval(() => {
    paintTimers();
  }, 1000);
};

const formatTime = (seconds) => {
  let minutes = Math.floor(seconds / 60);
  let secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

const paintTimers = () => {
  const timerBox = document.querySelector(".timers-scroll");
  timerBox.innerHTML = "";

  timers.forEach((timer) => {
    const totalTime = formatTime(timer.totalTime);

    const timeLeft = formatTime(timer.timeLeft);

    const timerHtml = `
       <article class="timer-card ${timer.paused ? "paused" : "going"}" id="${
      timer.id
    }">
            <h4 class="timer-card__title">${timer.title}</h4>
            <p class="timer-card__time-left">${timeLeft} left</p>
            <p class="timer-card__time-total">${totalTime} total</p>
       </article>
    `;

    timerBox.innerHTML += timerHtml;

    if (!timer.paused) {
      const newTimers = timers.map((t) => {
        if (t.id === timer.id) {
          return {
            ...t,
            timeLeft: t.timeLeft - 1,
          };
        } else {
          return t;
        }
      });

      timers = newTimers;

      localStorage.setItem(
        "user",
        JSON.stringify({ user, todos, timers: newTimers })
      );
    }
  });

  timerBox.childNodes.forEach((node) => {
    node.addEventListener("click", (e) => {
      const id = Number(e.currentTarget.id);
      const newTimers = timers.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            paused: !t.paused,
          };
        } else {
          return t;
        }
      });

      timers = newTimers;

      localStorage.setItem(
        "user",
        JSON.stringify({ user, todos, timers: newTimers })
      );

      paintTimers();
    });
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

const modalShowForTimer = (e) => {
  const modalOverlay = document.querySelector(".modal-overlay");
  modalOverlay.classList.add("active");

  modalOverlay.addEventListener("click", (e) => {
    if (e.target.id === "new-timer-modal") {
      modalOverlay.classList.remove("active");

      modalOverlay.removeEventListener("click", modalShowForTimer);
    }
  });

  const createTimerBtn = document.getElementById("create-timer-btn");

  createTimerBtn.addEventListener("click", (e) => createTimer(e, modalOverlay));
};

if (addTimerBtn) {
  addTimerBtn.addEventListener("click", modalShowForTimer);
}

const createTimer = (e, modalOverlay) => {
  e.preventDefault();

  const title = document.getElementById("timer-title").value;

  const newTimer = {
    id: timers.length,
    title: title,
    totalTime: 1500,
    timeLeft: 1500,
    paused: false,
  };

  const newTimers = [...timers, newTimer];

  localStorage.setItem(
    "user",
    JSON.stringify({ user, todos, timers: newTimers })
  );

  modalOverlay.classList.remove("active");
  modalOverlay.removeEventListener("click", modalShowForTimer);

  timers = newTimers;

  paintTimers();
};
