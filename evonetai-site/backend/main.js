document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DE LOGIN ---
    const loginForm = document.getElementById('login-form-animated');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const loginButton = loginForm.querySelector('.login-btn-animated');
            loginButton.classList.add('loading');

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (!res.ok) {
                    alert(data.message || 'Erro no login.');
                    loginButton.classList.remove('loading');
                    return;
                }

                localStorage.setItem('evonet_token', data.token);
                localStorage.setItem('evonet_user', JSON.stringify(data.user));
                window.location.href = '/html/dashboard.html';

            } catch (err) {
                alert('Erro de conexão com o servidor.');
                loginButton.classList.remove('loading');
            }
        });
    }

    // --- NAVEGAÇÃO DINÂMICA ---
    const user = JSON.parse(localStorage.getItem('evonet_user'));
    const navLoginBtn = document.querySelector('.nav-login-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (user && navMenu && navLoginBtn) {
        navLoginBtn.style.display = 'none'; // Esconde o botão original

        // Cria link para o Dashboard
        const dashboardLi = document.createElement('li');
        dashboardLi.className = 'nav-item';
        dashboardLi.innerHTML = `<a href="/html/dashboard.html" class="nav-link">Dashboard</a>`;
        navMenu.appendChild(dashboardLi);

        // Cria botão de Sair
        const logoutLi = document.createElement('li');
        logoutLi.className = 'nav-item';
        const logoutButton = document.createElement('button');
        logoutButton.className = 'nav-login-btn';
        logoutButton.textContent = 'Sair';
        logoutButton.onclick = () => {
            localStorage.removeItem('evonet_token');
            localStorage.removeItem('evonet_user');
            window.location.href = '/';
        };
        logoutLi.appendChild(logoutButton);
        navMenu.parentElement.appendChild(logoutLi);
    }
});