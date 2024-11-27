async function fetchUsers() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
        const userList = document.getElementById('userList');
        userList.innerHTML = ''; // Clear previous list

        users.forEach(user => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                ${user.name} (${user.email}, Age: ${user.age}) 
                <button onclick="deleteUser('${user._id}')">Delete</button>
                <button onclick="fillUpdateForm('${user._id}')">Update</button>
            `;
            userList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

document.getElementById('addUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;

    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, age })
        });

        const newUser = await response.json();

        if (response.ok) {
            fetchUsers();
            document.getElementById('addUserForm').reset();
        } else {
            alert(newUser.error);
        }
    } catch (error) {
        console.error('Error adding user:', error);
    }
});

async function deleteUser(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
        const result = await response.json();

        if (response.ok) {
            fetchUsers();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

async function fillUpdateForm(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        const user = await response.json();

        if (response.ok) {
            document.getElementById('updateUserId').value = user._id;
            document.getElementById('updateName').value = user.name;
            document.getElementById('updateEmail').value = user.email;
            document.getElementById('updateAge').value = user.age;
        } else {
            alert('User not found');
        }
    } catch (error) {
        console.error('Error fetching user data for update:', error);
    }
}

document.getElementById('updateUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('updateUserId').value;
    const name = document.getElementById('updateName').value;
    const email = document.getElementById('updateEmail').value;
    const age = document.getElementById('updateAge').value;

    try {
        const response = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, age })
        });

        const updatedUser = await response.json();

        if (response.ok) {
            fetchUsers();
            document.getElementById('updateUserForm').reset();
        } else {
            alert(updatedUser.error);
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }
});

window.onload = fetchUsers;
