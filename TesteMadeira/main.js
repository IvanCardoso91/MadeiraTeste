var selectedRow = null;
var method = "POST";
var userId = 0;
const url = "http://5d8e5ea67162f10014a490ac.mockapi.io/contatos/";

//envia novo user ou edita user
function onFormSubmit() {
    if (method == "POST") {
        if (selectedRow == null)
            axios.post(url, {
                nome: document.getElementById("nomeCompleto").value,
                email: document.getElementById("email").value,
                telefone: document.getElementById("telefone").value
            })
            .then(response => {
                reloadForm();
                getContacts();
                closeOneModal();
            });
        else
            updateRecord(formData);
    } else {
        axios.put(`${url}${userId}`, {
                nome: document.getElementById("nomeCompleto").value,
                email: document.getElementById("email").value,
                telefone: document.getElementById("telefone").value
            })
            .then(response => {
                reloadForm();
                getContacts();
                closeOneModal();
            });
    }
    resetForm();
}
//popula dados na tabela
function insertNewRecord(data) {
    var table = document.getElementById("contatoLista").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    cell1 = newRow.insertCell(0);
    cell1.innerHTML = data.nomeCompleto;
    cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.email;
    cell3 = newRow.insertCell(2);
    cell3.innerHTML = data.telefone;
    cell4 = newRow.insertCell(3);
    cell4.innerHTML = `<button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#ModalCenter" onClick="onEdit(${data.id})">Editar</button>`
    cell5 = newRow.insertCell(4);
    cell5.innerHTML = `<button type="button" class="btn btn-danger btn-sm" onClick="onDelete(${data.id})">Deletar</button>`;
}
//abre modal para adicionar contato
function addContact() {
    document.getElementById("TitleModalCenter").innerHTML = "Adicionar Contato";
    document.getElementById("nomeCompleto").value = "";
    document.getElementById("email").value = "";
    document.getElementById("telefone").value = "";
    selectedRow = null;
}
//reload do formularo
function reloadForm() {
    var Table = document.getElementById("contatoLista").getElementsByTagName('tbody')[0];
    while (Table.hasChildNodes()) {
        Table.removeChild(Table.firstChild);
    }
}
//carrega contatos para editar
function onEdit(id) {
    userId = id;
    method = "PUT";
    document.getElementById("TitleModalCenter").innerHTML = "Edidar Contato";
    axios.get(url + id)
        .then(response => {
            console.log(response)
            document.getElementById("nomeCompleto").value = response.data.nome;
            document.getElementById("email").value = response.data.email;
            document.getElementById("telefone").value = response.data.telefone;
        })
}
//deleta contatos
function onDelete(id) {
    if (confirm('Você quer deletar este contato?')) {
        axios.delete(url + id)
            .then(response => {
                reloadForm();
                getContacts();
            })
    }
}

//pega contatos
function getContacts() {
    axios.get(url)
        .then(response => {
            console.log(response.data);
            for (i = 0; i < response.data.length; i++) {
                var data = {
                    id: response.data[i].id,
                    nomeCompleto: response.data[i].nome,
                    email: response.data[i].email,
                    telefone: response.data[i].telefone,
                }
                insertNewRecord(data);
            }
        })
};

window.onload = getContacts();


//função para fechar modal sem jquery
function closeOneModal() {

    // get modal
    const modal = document.getElementById("ModalCenter");

    // change state like in hidden modal
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('style', 'display: none');

    // get modal backdrop
    const modalBackdrops = document.getElementsByClassName('modal-backdrop');

    // remove opened modal backdrop
    document.body.removeChild(modalBackdrops[0]);

    document.location.reload();
}