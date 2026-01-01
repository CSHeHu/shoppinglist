document.getElementById('createUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('newUserEmail').value;
    const password = document.getElementById('newUserPassword').value;
    const role = document.getElementById('newUserRole').value;
    const res = await fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
        credentials: 'same-origin'
    });
    const msgDiv = document.getElementById('createUserMsg');
    if (res.ok) {
        msgDiv.innerText = 'User created successfully!';
        document.getElementById('createUserForm').reset();
    } else {
        const data = await res.json();
        msgDiv.innerText = data.message || 'Failed to create user.';
    }
});
document.getElementById('listUsersBtn').addEventListener('click', async () => {
    const res = await fetch('/users', { credentials: 'same-origin' });
    if (res.ok) {
        const users = await res.json();
        document.getElementById('usersList').innerText = JSON.stringify(users, null, 2);
    } else {
        document.getElementById('usersList').innerText = 'Failed to fetch users.';
    }
});
