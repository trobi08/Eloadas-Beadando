let data = [];
let sortDirection = true;
let currentEditIndex = null;

const form = document.getElementById("form");
const tableBody = document.querySelector("#dataTable tbody");
const searchInput = document.getElementById("searchInput");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newItem = {
    name: form.name.value.trim(),
    age: parseInt(form.age.value),
    city: form.city.value.trim(),
    email: form.email.value.trim()
  };
  if (validate(newItem)) {
    if (currentEditIndex !== null) {
      data[currentEditIndex] = newItem;
      currentEditIndex = null;
    } else {
      data.push(newItem);
    }
    form.reset();
    renderTable();
  } else {
    alert("Érvénytelen adatok!");
  }
});

function validate(item) {
  return (
    item.name.length >= 2 &&
    item.name.length <= 30 &&
    item.age >= 1 &&
    item.age <= 120 &&
    item.city.length >= 2 &&
    item.city.length <= 30 &&
    /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(item.email)
  );
}

function renderTable() {
  const search = searchInput.value.toLowerCase();
  tableBody.innerHTML = "";
  data
    .filter(row =>
      Object.values(row).some(val =>
        val.toString().toLowerCase().includes(search)
      )
    )
    .forEach((row, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.name}</td>
        <td>${row.age}</td>
        <td>${row.city}</td>
        <td>${row.email}</td>
        <td>
          <button onclick="editItem(${index})">✏️</button>
          <button onclick="deleteItem(${index})">❌</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
}

function deleteItem(index) {
  if (confirm("Biztosan törlöd?")) {
    data.splice(index, 1);
    renderTable();
  }
}

function editItem(index) {
  const item = data[index];
  form.name.value = item.name;
  form.age.value = item.age;
  form.city.value = item.city;
  form.email.value = item.email;
  currentEditIndex = index;
}

searchInput.addEventListener("input", renderTable);

document.querySelectorAll("th[data-column]").forEach(th => {
  th.addEventListener("click", () => {
    const column = th.dataset.column;
    data.sort((a, b) => {
      if (a[column] < b[column]) return sortDirection ? -1 : 1;
      if (a[column] > b[column]) return sortDirection ? 1 : -1;
      return 0;
    });
    sortDirection = !sortDirection;
    renderTable();
  });
});

renderTable();