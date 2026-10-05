const API_URL = '/api/pets';

document.addEventListener('DOMContentLoaded', carregarPets);
document.getElementById('pet-form').addEventListener('submit', salvarPet);

// READ: Buscar e listar os pets
async function carregarPets() {
  const res = await fetch(API_URL);
  const pets = await res.json();
  
  const container = document.getElementById('pets-list');
  container.innerHTML = '';

  pets.forEach(pet => {
    const card = document.createElement('div');
    card.className = 'pet-card';
    card.innerHTML = `
      <h3>${pet.nome}</h3>
      <p><strong>Espécie:</strong> ${pet.especie}</p>
      <p><strong>Idade:</strong> ${pet.idade}</p>
      <span class="badge ${pet.status}">${pet.status}</span>
      <div class="actions">
        <button class="btn-edit" onclick="prepararEdicao(${pet.id}, '${pet.nome}', '${pet.especie}', '${pet.idade}', '${pet.status}')">Editar</button>
        <button class="btn-delete" onclick="deletarPet(${pet.id})">Excluir</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// CREATE / UPDATE: Salvar ou Atualizar Pet
async function salvarPet(e) {
  e.preventDefault();
  const id = document.getElementById('pet-id').value;
  const petData = {
    nome: document.getElementById('nome').value,
    especie: document.getElementById('especie').value,
    idade: document.getElementById('idade').value,
    status: document.getElementById('status').value
  };

  if (id) {
    // UPDATE (PUT)
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(petData)
    });
  } else {
    // CREATE (POST)
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(petData)
    });
  }

  resetForm();
  carregarPets();
}

// Preencher o formulário para edição
function prepararEdicao(id, nome, especie, idade, status) {
  document.getElementById('pet-id').value = id;
  document.getElementById('nome').value = nome;
  document.getElementById('especie').value = especie;
  document.getElementById('idade').value = idade;
  document.getElementById('status').value = status;

  document.getElementById('form-title').innerText = 'Editar Pet';
  document.getElementById('btn-submit').innerText = 'Atualizar';
  document.getElementById('btn-cancel').style.display = 'block';
}

// DELETE: Excluir Pet
async function deletarPet(id) {
  if (confirm('Tem certeza que deseja excluir este pet?')) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    carregarPets();
  }
}

function resetForm() {
  document.getElementById('pet-id').value = '';
  document.getElementById('pet-form').reset();
  document.getElementById('form-title').innerText = 'Cadastrar Novo Pet';
  document.getElementById('btn-submit').innerText = 'Salvar Pet';
  document.getElementById('btn-cancel').style.display = 'none';
}