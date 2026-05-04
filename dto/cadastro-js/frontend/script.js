document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('formCadastro');
  const toggleSenha = document.getElementById('toggleSenha');
  const senhaInput = document.getElementById('senha');
  const btn = document.getElementById('btn');
  const btnText = document.getElementById('btnText');
  const mensagem = document.getElementById('mensagem');

  toggleSenha.addEventListener('click', function() {
    const type = senhaInput.getAttribute('type') === 'password' ? 'text' : 'password';
    senhaInput.setAttribute('type', type);
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
  });


  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    await cadastrar();
  });

  async function cadastrar() {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if(!nome || !email || !senha) {
      showMessage("Preencha todos os campos", "erro");
      return;
    }

    if(senha.length < 6) {
      showMessage("Senha mínima de 6 caracteres", "erro");
      return;
    }

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMessage("Email inválido", "erro");
      return;
    }

    btn.disabled = true;
    btnText.textContent = '';
    mensagem.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    mensagem.className = 'mensagem loading';
    mensagem.style.display = 'block';

    try {
      const res = await fetch("http://localhost:8080/usuarios", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({nome, email, senha})
      });

      const data = await res.json();

      if(res.ok) {
        showMessage("✅ Conta criada com sucesso! Redirecionando...", "sucesso");
        // Limpar form
        form.reset();
        // Redirecionar após 2s (opcional)
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        showMessage(data.mensagem || "Erro ao cadastrar", "erro");
      }
    } catch(e) {
      showMessage("❌ Erro de conexão com servidor", "erro");
    }

    btn.disabled = false;
    btnText.textContent = 'Criar minha conta';
  }

  function showMessage(text, type) {
    mensagem.textContent = text;
    mensagem.className = `mensagem ${type}`;
    mensagem.style.display = 'block';

    setTimeout(() => {
      mensagem.style.display = 'none';
    }, 5000);
  }


  document.querySelectorAll('.input-field').forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value.trim() === '') {
        this.style.borderColor = '#f87171';
      } else {
        this.style.borderColor = '#e5e7eb';
      }
    });
  });
});