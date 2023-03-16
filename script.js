

//Проверка ошибок
function ErrorShow(elem, error, errorValue) {
    // отображение ошибки
    const elementCase = elem.closest('.form-inputs');
    const errorBox = elementCase.querySelector('.error');
    if (errorBox) { // если ошибка, то дальше не идём
        return;
    }

    const divWithError = document.createElement('div');
    divWithError.classList.add('error');

    let valueInputs = document.createElement('p');
    valueInputs.textContent = 'Заполните поле правильно.'
   
    divWithError.append(valueInputs);

    elementCase.append(divWithError);
    elem.classList.add('error-input');
    valueInputs.classList.add('error-input');
}

function hideError(input) {
    input.classList.remove('error-input');
    const formGroup = input.closest('.form-inputs');
    const error = formGroup.querySelector('.error');
    if (error) {
        error.remove();
    }
}


function getValidationResult(input, options) {
    const {min, max} = options;
    const value = input.value.trim();

    if (min && value.length < min) {
        return {check: false, error: 'min', errorValue: value.length};
    }

    if (max && value.length > max) {
        return {check: false, error: 'max', errorValue: value.length};
    }

    return {check: true};
}

//Ссылка на репозитории
async function getRepos(queryInput, filterSelected) {
    const query = queryInput.value;
    const qualifier = filterSelected.value;
    const queryURL = constructQuery(query, qualifier);

    return fetch(queryURL);
}

function constructQuery(query, qualifier) {
    let queryURL = 'https://api.github.com/search/repositories?q=';
    queryURL += query;
    if (qualifier !== 'all') {
        queryURL += ' in:' + qualifier;
    }

    return queryURL;
}

function showReposList(repos) {
    console.log('repos: ', repos);
}


//Блок с запросом
function showLoadingBlock() {
    const repositorBlock = document.querySelector('.repos');
    
    const loadingBlock = document.createElement('div');
    loadingBlock.classList.add('expectation-block');
    loadingBlock.textContent = 'Ожидание ответа сервера';
    
    repositorBlock.append(loadingBlock);
}

function hideLoadingBlock() {
    const loadingBlock = document.querySelector('.expectation-block');
    loadingBlock.remove();
}



//Вывод репозиториев



function main() {
    const searchForm = document.forms.search;
    searchForm.addEventListener('submit', searchRepos);

    const InputsAll = document.querySelectorAll('input');
    InputsAll.forEach(input => {
        input.addEventListener('input', () => {
            hideError(input);
        });
    });
}

main();


async function searchRepos(e) {
    e.preventDefault();
    const searchForm = document.forms.search;
    const queryInput = searchForm.searchString;
    const filterSelected = searchForm.searchMeaning;

    let SomeError = false;
    const requestValidOptions = {min: 3, max: 32};
    const requestValidResult = getValidationResult(queryInput, requestValidOptions);
    if (!requestValidResult.check) {
        SomeError = true;
        ErrorShow(queryInput, requestValidResult.error, requestValidResult.errorValue, requestValidOptions);
    }

    if (SomeError) {
        e.preventDefault();
        return;
    }

    showLoadingBlock();
    getRepos(queryInput, filterSelected)
    .then(response => response.json())
    .then(repos => showReposList(repos))
    .catch(error => {
        console.log('error: ', error);
    })
    .finally(() => {
        hideLoadingBlock();
        console.log('finally');
    })
}