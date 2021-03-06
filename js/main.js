// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC26KdlrSiQHhEEj4b_7W-D2ZqoGa-tn8A",
  authDomain: "picadu-27258.firebaseapp.com",
  projectId: "picadu-27258",
  storageBucket: "picadu-27258.appspot.com",
  messagingSenderId: "306645299513",
  appId: "1:306645299513:web:9140d402658681378df8e8",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log(firebase);

// Создаем переменную, в которую положим кнопку меню
let menuToggle = document.querySelector("#menu-toggle");
// Создаем переменную, в которую положим меню
let menu = document.querySelector(".sidebar");

const regExpValidEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
const exitElem = document.querySelector(".exit");

const editElem = document.querySelector(".edit");
const editContainer = document.querySelector(".edit-container");
const editUsername = document.querySelector(".edit-username");
const editPhotoURL = document.querySelector(".edit-photo");
const userAvatarElem = document.querySelector(".user-avatar");

const loginElem = document.querySelector(".login");
const loginForm = document.querySelector(".login-form");
const emailInput = document.querySelector(".login-email");
const passwordInput = document.querySelector(".login-password");
const loginSignup = document.querySelector(".login-signup");
const userElem = document.querySelector(".user");
const userNameElem = document.querySelector(".user-name");

const postsWrapper = document.querySelector(".posts");
const buttonNewPost = document.querySelector(".button-new-post");
const addPostElem = document.querySelector(".add-post");
const defaultPhoto = userAvatarElem.src;
const loginForget = document.querySelector(".login-forget");
const setUsers = {
  user: null,
  initUser(handler) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
      if (handler) {
        handler();
      }
    });
  },
  // getUser(email) {
  //   listUsers.find((item) => {
  //     return item.email === email;
  //   });
  // },
  // authorizedUser(user) {
  //   this.user = user;
  // },
  logIn(email, password, handler) {
    if (handler) {
      handler();
    }

    if (!regExpValidEmail.test(email)) {
      alert("Email не валиден");
      return;
    }
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        const errCode = error.code;
        const errMessage = error.message;
        if (errCode === "auth/wrong-password") {
          console.log(errMessage);
          alert("Неверный пароль");
        } else if (errCode === "auth/user-not-found") {
          console.log(errMessage);
          alert("Пользователь с таким ящиком не найден");
        } else {
          alert(errMessage);
        }

        console.log(error);
      });
    // const user = this.getUser(email);
    // if (user && user.password === password) {
    //   this.authorizedUser(user);
    //   handler();
    // } else {
    //   alert("Пользователь с такими данными не найден");
    // }
  },
  logOut() {
    firebase.auth().signOut();
  },
  signUp(email, password, handler) {
    if (!regExpValidEmail.test(email)) {
      alert("Email не валиден");
      return;
    }
    if (!email.trim() || !password.trim()) {
      alert("Введите данные");
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.editUser(email.slice(0, email.indexOf("@"), null, toggleAuthDom));
      })
      .catch((err) => {
        const errCode = err.code;
        const errMessage = err.message;
        if (errCode === "auth/weak-password") {
          console.log(errMessage);
          alert("Слабый пароль");
        } else if (errCode === "auth/email-already-in-use") {
          console.log(errMessage);
          alert("Пользователь с таким ящиком уже зарегистрирован");
        } else {
          alert(errMessage);
        }

        console.log(error);
      });
    if (handler) {
      handler();
    }

    // if (!this.getUser(email)) {
    //   const user = {
    //     email,
    //     password,
    //     displayName: email.slice(0, email.indexOf("@")),
    //   };
    //   listUsers.push(user);
    //   this.authorizedUser(user);

    // } else {
    //   alert("Пользователь с таким эл адресом уже зарегистрирован");
    // }
  },
  editUser(displayName, photoURL, handler) {
    const user = firebase.auth().currentUser;
    if (displayName) {
      if (photoURL) {
        user
          .updateProfile({
            displayName,
            photoURL,
          })
          .then(handler);
      } else {
        user
          .updateProfile({
            displayName,
          })
          .then(handler);
      }
    }
  },
  sendReset(email) {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        alert("Письмо отправлено").catch((error) => {
          console.log(error);
        });
      });
  },
};
loginForget.addEventListener("click", (ev) => {
  ev.preventDefault();
  setUsers.sendReset(emailInput.value);
  emailInput.value = "";
});
const setPosts = {
  allPosts: [],
  addPost(title, text, tags, handler) {
    const user = firebase.auth().currentUser;
    this.allPosts.unshift({
      id: `postID${(+new Date()).toString(16)}-${user.uid}`,
      title,
      text,
      tags: tags.split(", ").join(" ").trim().split(" "),
      author: {
        displayName: setUsers.user.displayName,
        photo: user.photoURL,
      },
      date: new Date().toLocaleString(),
      like: 0,
      comments: 0,
    });
    firebase
      .database()
      .ref("post")
      .set(this.allPosts)
      .then(() => this.getPosts(handler));
  },
  getPosts(handler) {
    firebase
      .database()
      .ref("post")
      .on("value", (snapshot) => {
        this.allPosts = snapshot.val() || [];
        handler();
      });
  },
};
const toggleAuthDom = () => {
  const user = setUsers.user;
  if (user) {
    loginElem.style.display = "none";
    userElem.style.display = "";
    userNameElem.textContent = user.displayName;
    userAvatarElem.src = user.photoURL || defaultPhoto;
    buttonNewPost.classList.add("visible");
  } else {
    loginElem.style.display = "";
    userElem.style.display = "none";
    buttonNewPost.classList.remove("visible");
    addPostElem.classList.remove("visible");
    postsWrapper.classList.add("visible");
  }
};

const showAddPost = () => {
  addPostElem.classList.add("visible");
  postsWrapper.classList.remove("visible");
};

const showAllPosts = () => {
  let postsHTML = "";
  setPosts.allPosts.forEach(
    ({ title, text, date, tags, like, comments, author }) => {
      postsHTML += `
  <section class="post">
        <div class="post-body">
        <h2 class="post-title">${title}</h2>
          <p class="post-text">${text} </p>
          
          <div class="tags">
          ${tags
            .map((tag) => `<a href="#${tag}" class="tag">#${tag}</a>`)
            .join(" ")}
          </div>
          
        </div>
        
        <div class="post-footer">
          <div class="post-buttons">
            <button class="post-button likes">
              <svg width="19" height="20" class="icon icon-like">
                <use xlink:href="img/icons.svg#like"></use>
              </svg>
              <span class="likes-counter">${like}</span>
            </button>
            <button class="post-button comments">
              <svg width="21" height="21" class="icon icon-comment">
                <use xlink:href="img/icons.svg#comment"></use>
              </svg>
              <span class="comments-counter">${comments}</span>
            </button>
            <button class="post-button save">
              <svg width="19" height="19" class="icon icon-save">
                <use xlink:href="img/icons.svg#save"></use>
              </svg>
            </button>
            <button class="post-button share">
              <svg width="17" height="19" class="icon icon-share">
                <use xlink:href="img/icons.svg#share"></use>
              </svg>
            </button>
          </div>
          
          <div class="post-author">
            <div class="author-about">
              <a href="#" class="author-username">${author.displayName}</a>
              <span class="post-time">${date}</span>
            </div>
            <a href="#" class="author-link"><img src=${
              author.photo || "img/Blank-profile.png"
            } alt="avatar" class="author-avatar"></a>
          </div>
          
        </div>
        
      </section>
      
`;
    }
  );
  postsWrapper.innerHTML = postsHTML;

  addPostElem.classList.remove("visible");
  postsWrapper.classList.add("visible");
};

const init = () => {
  loginForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const emailValue = emailInput.value;
    const passwordValue = passwordInput.value;
    setUsers.logIn(emailValue, passwordValue, toggleAuthDom);
    loginForm.reset();
  });

  loginSignup.addEventListener("click", (ev) => {
    ev.preventDefault();
    const emailValue = emailInput.value;
    const passwordValue = passwordInput.value;
    setUsers.signUp(emailValue, passwordValue, toggleAuthDom);
    loginForm.reset();
  });

  exitElem.addEventListener("click", (ev) => {
    ev.preventDefault();
    setUsers.logOut();
  });
  editElem.addEventListener("click", (ev) => {
    ev.preventDefault();
    editContainer.classList.toggle("visible");
    editUsername.value = setUsers.user.displayName;
  });
  editContainer.addEventListener("submit", (ev) => {
    ev.preventDefault();
    setUsers.editUser(editUsername.value, editPhotoURL.value, toggleAuthDom);
    editContainer.classList.remove("visible");
  });

  menuToggle.addEventListener("click", (ev) => {
    ev.preventDefault();
    menu.classList.toggle("visible");
  });
  buttonNewPost.addEventListener("click", (ev) => {
    ev.preventDefault();
    showAddPost();
  });

  addPostElem.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const { title, text, tags } = addPostElem.elements;
    if (title.value.length < 6) {
      alert("Too short title");
      return;
    }
    if (text.value.length < 50) {
      alert("Too short text");
      return;
    }
    setPosts.addPost(title.value, text.value, tags.value, showAllPosts);
    addPostElem.classList.remove("visible");
    addPostElem.reset();
  });
  setUsers.initUser(toggleAuthDom);
  setPosts.getPosts(showAllPosts);
};
document.addEventListener("DOMContentLoaded", init);
