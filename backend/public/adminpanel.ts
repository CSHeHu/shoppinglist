const form: HTMLFormElement | null = document.getElementById(
  "createUserForm",
) as HTMLFormElement;
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput: HTMLInputElement | null = document.getElementById(
      "newUserEmail",
    ) as HTMLInputElement | null;
    const passwordInput: HTMLInputElement | null = document.getElementById(
      "newUserPassword",
    ) as HTMLInputElement | null;
    const roleInput: HTMLInputElement | null = document.getElementById(
      "newUserRole",
    ) as HTMLInputElement | null;

    if (!emailInput || !passwordInput || !roleInput) {
      //TODO add error handling whole file
      return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;
    const role = roleInput.value;

    const res = await fetch("/api/v1/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
      credentials: "same-origin",
    });

    const adminMsg: HTMLDivElement | null = document.getElementById(
      "adminMsg",
    ) as HTMLDivElement | null;
    const usersList: HTMLDivElement | null = document.getElementById(
      "usersList",
    ) as HTMLDivElement | null;
    if (res.ok && adminMsg) {
      adminMsg.innerText = "User created successfully!";
      form.reset();
      // Optionally clear users list view
      if (usersList) usersList.innerText = "";
    } else if (adminMsg) {
      const data = await res.json().catch(() => ({}));
      adminMsg.innerText = data.message || "Failed to create user.";
    }
  });
}

const listUsersBtn: HTMLButtonElement | null = document.getElementById(
  "listUsersBtn",
) as HTMLButtonElement | null;
if (listUsersBtn) {
  listUsersBtn.addEventListener("click", async () => {
    const res = await fetch("/api/v1/users", { credentials: "same-origin" });
    const adminMsg: HTMLDivElement | null = document.getElementById(
      "adminMsg",
    ) as HTMLDivElement | null;
    const usersList: HTMLDivElement | null = document.getElementById(
      "usersList",
    ) as HTMLDivElement | null;

    if (res.ok && usersList) {
      const users = await res.json();
      usersList.innerText = JSON.stringify(users, null, 2);
      if (adminMsg) adminMsg.innerText = "Listed all users.";
    } else if (usersList) {
      usersList.innerText = "Failed to fetch users.";
      if (adminMsg) adminMsg.innerText = "Failed to fetch users.";
    }
  });
}

// User search functionality
const searchUserForm: HTMLFormElement | null = document.getElementById(
  "searchUserForm",
) as HTMLFormElement | null;
if (searchUserForm) {
  searchUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const typeSelectElement: HTMLSelectElement | null = document.getElementById(
      "searchType",
    ) as HTMLSelectElement | null;
    const valueInputElement: HTMLInputElement | null = document.getElementById(
      "searchUserInput",
    ) as HTMLInputElement | null;
    const adminMsg: HTMLDivElement | null = document.getElementById(
      "adminMsg",
    ) as HTMLDivElement | null;
    const usersList: HTMLDivElement | null = document.getElementById(
      "usersList",
    ) as HTMLDivElement | null;

    if (!typeSelectElement || !valueInputElement || !adminMsg || !usersList) {
      return;
    }

    const type: string | null = typeSelectElement.value;
    const value: string | null = valueInputElement.value.trim();
    if (!type || !value) {
      adminMsg.innerText = "Please provide both search type and value.";
      return;
    }

    adminMsg.innerText = "";
    usersList.innerText = "";
    let url = "";
    if (type === "id") {
      url = `/users/id/${encodeURIComponent(value)}`;
    } else if (type === "email") {
      url = `/users/email/${encodeURIComponent(value)}`;
    }
    const res = await fetch(`/api/v1${url}`, { credentials: "same-origin" });
    if (res.ok) {
      const user = await res.json();
      usersList.innerText = JSON.stringify(user, null, 2);
      adminMsg.innerText = "User found.";
    } else {
      const data = await res.json().catch(() => ({}));
      adminMsg.innerText = data.message || "User not found or error.";
    }
  });
}
