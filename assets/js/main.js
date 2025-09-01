// ===== PARTICLES BACKGROUND =====
particlesJS("particles-js", {
  "particles": {
    "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
    "color": { "value": "#50e3c2" },
    "shape": { "type": "circle" },
    "opacity": { "value": 0.5, "random": true },
    "size": { "value": 3, "random": true },
    "line_linked": { "enable": true, "distance": 150, "color": "#50e3c2", "opacity": 0.4, "width": 1 },
    "move": { "enable": true, "speed": 2 }
  },
  "interactivity": { "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" } } }
});

// ===== SWITCH LOGIN/REGISTER =====
const loginContainer = document.getElementById("login-container");
const registerContainer = document.getElementById("register-container");
document.getElementById("show-register").addEventListener("click", e => {
  e.preventDefault(); loginContainer.style.display="none"; registerContainer.style.display="block";
});
document.getElementById("show-login").addEventListener("click", e => {
  e.preventDefault(); loginContainer.style.display="block"; registerContainer.style.display="none";
});

// ===== LOGIN FORM =====
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async e => {
  e.preventDefault();
  loginMessage.style.color="#fff"; loginMessage.textContent="Entrando...";
  const spinner = loginForm.querySelector(".spinner");
  spinner.style.display="inline-block";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/login", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({email,password})
    });
    const data = await res.json();
    spinner.style.display="none";

    if(data.success){
      loginMessage.style.color="#50e3c2";
      loginMessage.textContent=data.message;
      localStorage.setItem("token", data.token);
      setTimeout(()=>window.location.href="dashboard.html",1000);
    }else{
      loginMessage.style.color="#f55"; loginMessage.textContent=data.message || "Erro no login";
    }
  } catch(err){ spinner.style.display="none"; loginMessage.style.color="#f55"; loginMessage.textContent="Erro ao conectar com o servidor";}
});

// ===== REGISTER FORM =====
const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

registerForm.addEventListener("submit", async e => {
  e.preventDefault();
  registerMessage.style.color="#fff"; registerMessage.textContent="Cadastrando...";
  const spinner = registerForm.querySelector(".spinner");
  spinner.style.display="inline-block";

  const name = document.getElementById("reg-name").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;
  const role = document.getElementById("reg-role").value;

  if(password.length<8){ spinner.style.display="none"; registerMessage.style.color="#f55"; registerMessage.textContent="Senha muito curta"; return; }

  try{
    const res = await fetch("/api/register", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({name,email,password,role})
    });
    const data = await res.json();
    spinner.style.display="none";

    if(data.success){
      registerMessage.style.color="#50e3c2"; registerMessage.textContent=data.message;
      setTimeout(()=>{ registerContainer.style.display="none"; loginContainer.style.display="block"; },1000);
    }else{
      registerMessage.style.color="#f55"; registerMessage.textContent=data.message || "Erro no cadastro";
    }
  }catch(err){ spinner.style.display="none"; registerMessage.style.color="#f55"; registerMessage.textContent="Erro ao conectar com o servidor";}
});
