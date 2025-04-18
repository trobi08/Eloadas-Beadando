const API_URL = "http://gamf.nhely.hu/ajax2/";
const CODE = "RO30XN, ZE4F8M"; // a neptun kód

function showMessage(msg) {
  document.getElementById("responseMessage").textContent = msg;
  document.getElementById("errorMessage").textContent = "";
}

function showError(msg) {
  document.getElementById("errorMessage").textContent = msg;
  document.getElementById("responseMessage").textContent = "";
}

// CREATE
function createData() {
  const name = document.getElementById("name").value.trim();
  const height = document.getElementById("height").value.trim();
  const weight = document.getElementById("weight").value.trim();

  if (!validateInputs(name, height, weight)) return;

  const formData = new URLSearchParams({
    op: "create",
    code: CODE,
    name,
    height,
    weight
  });

  fetch(API_URL, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(() => {
      showMessage("Sikeres hozzáadás!");
      loadData();
    })
    .catch(() => showError("Hiba történt a hozzáadás során."));
}

// READ ALL
function loadData() {
  const formData = new URLSearchParams({
    op: "read",
    code: CODE
  });

  fetch(API_URL, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      displayData(data.list);
      showStatistics(data.list);
    })
    .catch(() => showError("Nem sikerült lekérni az adatokat."));
}

function displayData(list) {
  const container = document.getElementById("dataList");
  container.innerHTML = "";
  list.forEach(item => {
    container.innerHTML += `
      <div>
        <strong>ID:</strong> ${item.id} |
        <strong>Név:</strong> ${item.name} |
        <strong>Magasság:</strong> ${item.height} |
        <strong>Súly:</strong> ${item.weight}
      </div>
    `;
  });
}

// STATS
function showStatistics(list) {
  const heights = list.map(item => parseFloat(item.height)).filter(h => !isNaN(h));
  const sum = heights.reduce((acc, val) => acc + val, 0);
  const avg = heights.length ? (sum / heights.length).toFixed(2) : 0;
  const max = heights.length ? Math.max(...heights) : 0;

  document.getElementById("stats").innerHTML = `
    <p>Összeg: ${sum}</p>
    <p>Átlag: ${avg}</p>
    <p>Legnagyobb: ${max}</p>
  `;
}

// DELETE
function deleteData() {
  const id = document.getElementById("deleteId").value.trim();
  if (!id) return showError("Add meg a törlendő ID-t!");

  const formData = new URLSearchParams({
    op: "delete",
    code: CODE,
    id
  });

  fetch(API_URL, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(() => {
      showMessage("Sikeres törlés.");
      loadData();
    })
    .catch(() => showError("Hiba történt a törlés során."));
}

// GET BY ID
function getDataById() {
  const targetId = document.getElementById("searchId").value.trim();
  if (!targetId) return showError("Add meg az ID-t!");

  const formData = new URLSearchParams({
    op: "read",
    code: CODE
  });

  fetch(API_URL, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      const found = data.list.find(item => item.id == targetId);
      if (found) {
        document.getElementById("id").value = found.id;
        document.getElementById("name").value = found.name;
        document.getElementById("height").value = found.height;
        document.getElementById("weight").value = found.weight;
        showMessage("Adatok betöltve.");
      } else {
        showError("Nem található ilyen ID.");
      }
    })
    .catch(() => showError("Hiba történt az adatok betöltésekor."));
}

// UPDATE
function updateData() {
  const id = document.getElementById("id").value.trim();
  const name = document.getElementById("name").value.trim();
  const height = document.getElementById("height").value.trim();
  const weight = document.getElementById("weight").value.trim();

  if (!id) return showError("Nincs betöltve ID!");
  if (!validateInputs(name, height, weight)) return;

  const formData = new URLSearchParams({
    op: "update",
    code: CODE,
    id,
    name,
    height,
    weight
  });

  fetch(API_URL, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(() => {
      showMessage("Sikeres módosítás!");
      loadData();
    })
    .catch(() => showError("Hiba történt a módosítás során."));
}

// VALIDATION
function validateInputs(name, height, weight) {
  if (!name || !height || !weight) {
    showError("Minden mező kitöltése kötelező!");
    return false;
  }
  if (name.length > 30 || height.length > 30 || weight.length > 30) {
    showError("Maximális hossz: 30 karakter!");
    return false;
  }
  return true;
}
