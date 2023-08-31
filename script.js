async function fetchRepo() {
    let url = 'https://www.cbr-xml-daily.ru/latest.js';
    let response = await fetch(url);
    let responseData = await response.json();
    fx.rates = responseData.rates; 
    fx.base = responseData.base; 
}

let secValue = '';
let firstValue = '';

const getValues = () => {
    let firstCurrencyButtons = document.querySelectorAll('.firstCurrency button')
    let firsDropMenuButtons = document.querySelectorAll('.popup-menu button[data-currency]')
    let secCurrencyButtons = document.querySelectorAll('.secondCurrency button')
    let secDropMenuButtons = document.querySelectorAll('.secPopup-menu button[data]')

    firsDropMenuButtons.forEach(item => {
        item.addEventListener('click', function(){
            let selectedCurrency = item.getAttribute('data-currency')
            let firstCurrencyButton = document.querySelector('.firstCurrency button')
            firstCurrencyButton.textContent = selectedCurrency;
            
            firstCurrencyButtons.forEach(btn => btn.classList.remove('selected'));
            firstCurrencyButton.classList.add('selected');
            
            menu.classList.remove('active');
            convertValue();
        });
    });
    
    secDropMenuButtons.forEach(item => {
        item.addEventListener('click', function(){
            let selectedCurrency = item.getAttribute('data');
            let secCurrencyButton = document.querySelector('.secondCurrency button');
            secCurrencyButton.textContent = selectedCurrency;
            
            secCurrencyButtons.forEach(btn => btn.classList.remove('secSelected'));
            secCurrencyButton.classList.add('secSelected');
            
            secMenu.classList.remove('active');
            convertValue();
        });
    });

    firstCurrencyButtons.forEach(button => {
        button.addEventListener('click', function(){
            firstValue = button.getAttribute('data-currency')
            if(firstValue === null){
                return
            }
            menu.classList.remove('active');
            firstCurrencyButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            convertValue();
        })
    })

    secCurrencyButtons.forEach(button => {
        button.addEventListener('click', function(){
            secValue = button.getAttribute('data')
            if(secValue === null){
                return
            }
            secMenu.classList.remove('active');
            secCurrencyButtons.forEach(btn => btn.classList.remove('secSelected'));
            button.classList.add('secSelected');
            convertValue();
        })
    })

    let firstExtensionButton = document.querySelector('.otherValue')
    let menu = document.querySelector('.popup-menu')
    firstExtensionButton.addEventListener('click', function(){
        menu.classList.toggle('active')
    })
    let secMenu = document.querySelector('.secPopup-menu')
    let secondExtensionButton = document.querySelector('.secondOtherValue')
    secondExtensionButton.addEventListener('click', function(){
        secMenu.classList.toggle('active')
    })
}

const amount = document.getElementById('amount');

const convertValue = () => {
    let inputValue = parseFloat(amount.value)
    let result = document.querySelector('.result')

    if (isNaN(inputValue) || inputValue === '') {
        result.innerHTML = '';
        return
    }

    if (!firstValue || !secValue) {
        result.innerHTML = 'choose two currencies';
        return
    }

    let convert = fx.convert(inputValue, { from: firstValue, to: secValue });
    let formattedConvert = convert.toLocaleString('ru-RU', { minimumFractionDigits: 2 });
    result.innerHTML = formattedConvert;
};

const debounce = (fn, debounceTime) => {
    let timer;
    return function(...args){
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, debounceTime)
    }
}

const debounced = debounce(convertValue, 500)

amount.addEventListener('input', debounced);

getValues();
fetchRepo();
convertValue();
