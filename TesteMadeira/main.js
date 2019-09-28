var selectedRow = null;
var method = "POST";
var userId = 0;
const url = "http://5d8e5ea67162f10014a490ac.mockapi.io/contatos/";

//envia requisição http para recuperar contatos existentes
function getContacts() {
    axios.get(url)
        .then(response => {
            for (i = 0; i < response.data.length; i++) {
                var data = {
                    id: response.data[i].id,
                    nomeCompleto: response.data[i].nome,
                    email: response.data[i].email,
                    telefone: response.data[i].telefone,
                }
                insertContacts(data);
            }
        })
        .catch(error => {
            alert('Falha na requisição');
        })
};

window.onload = getContacts();

//popula dados na tabela
function insertContacts(data) {
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

//abre modal para editar contato
function onEdit(id) {
    userId = id;
    method = "PUT";
    document.getElementById("TitleModalCenter").innerHTML = "Editar Contato";
    axios.get(`${url}${id}`)
        .then(response => {
            document.getElementById("nomeCompleto").value = response.data.nome;
            document.getElementById("email").value = response.data.email;
            document.getElementById("telefone").value = response.data.telefone;
        })
        .cacth(error => {
            alert('Erro de requisição')
        })
}

//valida se os campos foram preenchidos
function validateFields(){
    
    isValid = true;

    if(document.getElementById("nomeCompleto").value == ""){
        alert('Preencha o campo Nome.');
        return false;
    }
    if(document.getElementById("email").value == ""){
        alert('Preencha o campo E-mail.');
        return false;
    }
    if(document.getElementById("telefone").value == "" || isNaN(document.getElementById("telefone").value)){
        alert('Preencha o campo Telefone com números.');
        return false;
    }
    return isValid;
}

//adiciona novo contato ou edita contato
function onFormSubmit() {
    if(validateFields()){
        if (method === "POST") {
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
                })
                .catch(error => {
                    alert('Erro ao enviar dados.')
                })
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
                })
                .catch(error => {
                    alert('Erro ao editar os dados')
                })
        }
    }
}

//deleta contatos
function onDelete(id) {
    if (confirm('Tem certeza que deseja deletar este contato?')) {
        axios.delete(url + id)
            .then(response => {
                reloadForm();
                getContacts();
            })
            .catch(error => {
                alert('Erro ao deletar dado.')
            })
    }
}

//reload do formulario
function reloadForm() {
    var Table = document.getElementById("contatoLista").getElementsByTagName('tbody')[0];
    while (Table.hasChildNodes()) {
        Table.removeChild(Table.firstChild);
    }
}

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