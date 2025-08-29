const modalTimerOverlay = document.getElementById("new-timer-modal");
const modalTodoOverlay = document.getElementById("new-todo-modal");
const createTimerBtn = document.getElementById("create-timer-btn");
const addTimerBtn = document.querySelector(".button--add--timer");
const createTodoBtn = document.getElementById("create-todo-btn");
let addTodoBtn = document.querySelector(".button--add--todo");
let user = null;
let timers = [];
let todos = [];
let timerPaintInterval = null;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then(() => console.log("Service Worker registered"));
  });
}

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
  hoursComplete.innerHTML = `${formatTotalTime(user.totalProductiveTime)}`;
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

const formatTotalTime = (seconds) => {
  let hours = Math.floor(seconds / 60 / 60);
  let minutes = Math.floor(seconds / 60);
  let secs = seconds % 60;
  return `${hours}:${minutes}:${secs.toString().padStart(2, "0")}`;
};

const paintTimers = () => {
  const timerBox = document.querySelector(".timers-scroll");
  let newHtml = "";

  timers.forEach((timer) => {
    const totalTime = formatTime(timer.totalTime);

    const timeLeft = formatTime(timer.timeLeft);

    const timerHtml = `
    <article class="timer-card ${timer.paused ? "paused" : "going"}" id="${
      timer.id
    }">
      <h4 class="timer-card__title">${timer.title}</h4>
      ${timer.break ? `<p class="break-time-text">Break Time</p>` : ""}
      <p class="timer-card__time-left">${timeLeft} left</p>
      <p class="timer-card__time-total">${totalTime} total</p>
      <div class="timer-card__control-container">
        <button class="timer-card__btn restart-btn" id="reset">↺</button>
        <button class="timer-card__btn control-btn ${
          timer.paused ? "btn-paused" : "btn-going"
        }" id="play">${timer.paused ? "▶" : "❚❚"}</button>
      </div>
    </article>
    `;

    newHtml += timerHtml;

    if (!timer.paused) {
      const newTimers = timers.map((t) => {
        if (t.id === timer.id) {
          if (t.timeLeft - 1 < 0) {
            if (!t.break) {
              return {
                ...t,
                totalTime: 300,
                timeLeft: 300,
                break: true,
              };
            } else {
              return {
                ...t,
                totalTime: 1500,
                timeLeft: 1500,
                break: false,
              };
            }
          }
          user = {
            ...user,
            totalProductiveTime: user.totalProductiveTime + 1,
          };
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

      showUserData();
    }
  });

  timerBox.innerHTML = newHtml;

  timerBox.childNodes.forEach((node) => {
    node.addEventListener("click", (e) => {
      const id = Number(e.currentTarget.id);
      const childElementId = e.target.id;

      let newTimers;

      if (childElementId !== "play" && childElementId !== "reset") {
        return;
      }

      if (childElementId === "play") {
        newTimers = timers.map((t) => {
          if (t.id === id) {
            user = {
              ...user,
              totalProductiveTime: t.paused
                ? user.totalProductiveTime
                : user.totalProductiveTime - 1,
            };
            return {
              ...t,
              paused: !t.paused,
              timeLeft: t.paused ? t.timeLeft : t.timeLeft + 1,
            };
          } else {
            return t;
          }
        });
      }

      if (childElementId === "reset") {
        newTimers = timers.map((t) => {
          if (t.id === id) {
            return {
              ...t,
              timeLeft: t.totalTime,
            };
          } else {
            return t;
          }
        });
      }

      timers = newTimers;

      localStorage.setItem(
        "user",
        JSON.stringify({
          user,
          todos,
          timers: newTimers,
        })
      );

      paintTimers();
    });
  });
};

const displayCompleteAllBtn = () => {
  const btnContainer = document.querySelector(".todo-btn-container");

  let anyCompleted = false;

  todos.forEach((t) => {
    if (t.complete) {
      anyCompleted = true;
    }
  });

  console.log(anyCompleted);

  if (anyCompleted) {
    btnContainer.innerHTML = `
    <button class="button button--clear--todo">Clear Completed</button>
       <button class="button button--add--todo">＋ Add Todo</button>
    `;

    const clearCompletedBtn = document.querySelector(".button--clear--todo");

    clearCompletedBtn.addEventListener("click", () => {
      const newTodos = todos.filter((t) => !t.complete);
      todos = newTodos;

      localStorage.setItem(
        "user",
        JSON.stringify({
          user: user,
          todos: newTodos,
          timers,
        })
      );

      paintTodos();
      showUserData();
    });
  } else {
    btnContainer.innerHTML = `
       <button class="button button--add--todo">＋ Add Todo</button>
    `;
  }

  addTodoBtn = document.querySelector(".button--add--todo");
  addTodoBtn.addEventListener("click", () =>
    modalTodoOverlay.classList.add("active")
  );
};

const paintTodos = () => {
  const todoBox = document.querySelector(".todo-list");
  todoBox.innerHTML = "";

  displayCompleteAllBtn();

  todos.forEach((todo) => {
    const todoHtml = `
      <li class="todo-item" id="${todo.id}">
            <input type="checkbox" ${
              todo.complete ? "checked" : ""
            } name="todo" />
            <label for="todo1">${todo.text}</label>
      </li>
    `;

    todoBox.innerHTML += todoHtml;
  });

  let changed = 0;

  todoBox.childNodes.forEach((node) => {
    node.addEventListener("change", () => {
      const newTodos = todos.map((t) => {
        if (t.id === node.id) {
          if (t.complete === false) {
            changed = 1;
          } else {
            changed = -1;
          }
          return {
            ...t,
            complete: !t.complete,
          };
        } else {
          return t;
        }
      });

      todos = newTodos;

      const newUser = { ...user, todosComplete: user.todosComplete + changed };

      user = newUser;

      localStorage.setItem(
        "user",
        JSON.stringify({
          user: newUser,
          todos: newTodos,
          timers,
        })
      );

      displayCompleteAllBtn();
      showUserData();
    });
  });
};

const setUpApp = () => {
  console.log(
    "This is where we will set up the application for a new user or if localStorage failed for some reason"
  );

  window.location.href = "load.html";
};

window.addEventListener("load", initialize);

const modalShowForTimer = (e) => {
  modalTimerOverlay.classList.add("active");
};

const createTodo = (e) => {
  e.preventDefault();

  const todoText = document.getElementById("todo-title").value;

  const newTodo = {
    id: `todo-${todos.length}`,
    text: todoText,
    complete: false,
  };

  todos.push(newTodo);

  localStorage.setItem("user", JSON.stringify({ user, timers, todos }));

  modalTodoOverlay.classList.remove("active");

  paintTodos();
};

const createTimer = (e) => {
  e.preventDefault();

  const title = document.getElementById("timer-title").value;

  const newTimer = {
    id: timers.length,
    title: title,
    totalTime: 1500,
    timeLeft: 1500,
    paused: true,
    break: false,
  };

  const newTimers = [...timers, newTimer];

  localStorage.setItem(
    "user",
    JSON.stringify({ user, todos, timers: newTimers })
  );

  modalTimerOverlay.classList.remove("active");

  timers = newTimers;

  paintTimers();
};

if (addTimerBtn) {
  addTimerBtn.addEventListener("click", modalShowForTimer);
}

if (createTimerBtn) {
  createTimerBtn.addEventListener("click", createTimer);
}

if (modalTimerOverlay) {
  modalTimerOverlay.addEventListener("click", (e) => {
    if (e.target.id === "new-timer-modal") {
      modalTimerOverlay.classList.remove("active");
    }
  });
}

if (modalTodoOverlay) {
  modalTodoOverlay.addEventListener("click", (e) => {
    if (e.target.id === "new-todo-modal") {
      modalTodoOverlay.classList.remove("active");
    }
  });
}

if (addTodoBtn) {
  addTodoBtn.addEventListener("click", () =>
    modalTodoOverlay.classList.add("active")
  );
}

if (createTodoBtn) {
  createTodoBtn.addEventListener("click", createTodo);
}
