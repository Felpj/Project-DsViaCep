import Address from '../models/address.js';
import * as addressService from '../services/exceptions/address-service.js'
import * as listController from './list-controller.js'

// 1) Selecionando elementos do formulario.

function State() {

    this.address = new Address();

    this.btnSave = null;
    this.btnClear = null;

    this.inputCep = null;
    this.inputStreet = null;
    this.inputNumber = null;
    this.inputCity = null;

    this.errorCep = null;
    this.errorNumber = null;
}

const state = new State();

export function init() {

    state.inputCep = document.forms.newAddress.cep;
    state.inputCity = document.forms.newAddress.city;
    state.inputStreet = document.forms.newAddress.street;
    state.inputNumber = document.forms.newAddress.number;

    state.btnClear = document.forms.newAddress.btnClear;
    state.btnSave = document.forms.newAddress.btnSave;

    state.errorCep = document.querySelector('[data-error="cep"]');
    state.errorNumber = document.querySelector('[data-error="Number"]');

    state.inputNumber.addEventListener('change', handleInputNumberChange);
    state.inputNumber.addEventListener('keyup', handleInputNumberKeyup);
    state.btnClear.addEventListener('click', handleBtnClearClick);
    state.btnSave.addEventListener('click', handleBtnSaveClick);

    state.inputCep.addEventListener('change', handleInputCepChange);

}

//fazer uma funcao com evento keyup para incrementar o numero no obj this.address
function handleInputNumberKeyup(event) {
    state.address.number = event.target.value;
}

// para tratar o erro caso o cep esteja errado, usando o bloc try catch

async function handleInputCepChange(event) {
    const cep = event.target.value;

    try {
        const address = await addressService.findByCep(cep);

        state.inputCity.value = address.city;
        state.inputStreet.value = address.street;
        state.address = address;

        setFormError("cep", "");
        state.inputNumber.focus();
    }

    catch(e) {
        setFormError("cep", "informe um CEP válido");
        state.inputCity.value = "";
        state.inputStreet.value = "";
    }
    
}



async function handleBtnSaveClick(event) {
    event.preventDefault();

    const errors = addressService.getErrors(state.address);

    const keys = Object.keys(errors);

    if (keys.length > 0) {
        for (let i=0; i< keys.length; i++) {
            setFormError(keys[i], errors[keys[i]]);

        }
    }

    else {
        listController.addCard(state.address);
        clearForm();
    }

    
}

//evento mensagem de erro no cep e number 'change'.
//pegar o valor do input:

function handleInputNumberChange(event) {
    if(event.target.value == "") {
        setFormError("number", "Campo requerido");
    }
    else {
        setFormError("number", "");
    }
}

function setFormError(key, value) {
    const element = document.querySelector(`[data-error="${key}"]`);
    element.innerHTML = value;
}

//event botao clear, 'click'
// event.preventDefault = para que o formulario nao seja enviado e chame outra pagina.
// value = valor/texto dentro da caixa formulario

function handleBtnClearClick(event) {
    event.preventDefault();
    clearForm();
}

function clearForm() {
    state.inputCep.value = "";
    state.inputCity.value = "";
    state.inputNumber.value = "";
    state.inputStreet.value = "";

    setFormError("cep", "");
    setFormError("number", "");

    state.address = new Address();

    state.inputCep.focus();
}

