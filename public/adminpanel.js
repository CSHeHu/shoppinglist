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

// User search functionality
const searchUserForm = document.getElementById('searchUserForm');
if (searchUserForm) {
    searchUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const type = document.getElementById('searchType').value;
        const value = document.getElementById('searchUserInput').value.trim();
        const msgDiv = document.getElementById('searchUserMsg');
        const resultDiv = document.getElementById('searchUserResult');
        msgDiv.innerText = '';
        resultDiv.innerText = '';
        let url = '';
        if (type === 'id') {
            url = `/users/id/${encodeURIComponent(value)}`;
        } else if (type === 'email') {
            url = `/users/email/${encodeURIComponent(value)}`;
        }
        const res = await fetch(url, { credentials: 'same-origin' });
        if (res.ok) {
            const user = await res.json();
            resultDiv.innerText = JSON.stringify(user, null, 2);
        } else {
            const data = await res.json().catch(() => ({}));
            msgDiv.innerText = data.message || 'User not found or error.';
        }
    });
}

