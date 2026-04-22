//MAKE A CONTROLLED QUEUE
let queue = Promise.resolve();
function queueGattOperation(operation){
  queue = queue.then(operation, operation);
  return queue;
}
//Make sendOrder function
async function sendOrder(order){
    let encoder = new TextEncoder();
    let data = encoder.encode(order + "\n");

    queueGattOperation(() => rxCharacteristic.writeValue(data));
    console.log("Órdenes enviadas: " + order);
}

//SWITCHES GENERAL MENU

const generalSwitch_input = document.getElementById('generalSwitch_input');
const lightsSwitch_input = document.getElementById('lightsSwitch_input');
const climatizationSwitch_input = document.getElementById('climatizationSwitch_input');
const lights = document.getElementById("lights");
const lightsSwitch = document.getElementById("lightsSwitch");
const climatization = document.getElementById("climatization");
const climatizationSwitch = document.getElementById("climatizationSwitch");


generalSwitch_input.addEventListener('change', function(){
    if(this.checked){
        sendOrder("generalAuto_on");

        lights.classList.add('button_disabled');
        lightsSwitch.classList.add('button_disabled');
        climatization.classList.add('button_disabled');
        climatizationSwitch.classList.add('button_disabled');
        //Move switches
        document.getElementById("lightsSwitch_label").style.setProperty('--before-transform', 'translateX(20px)');
        document.getElementById("lightsSwitch_label").style.backgroundColor = '#0f0f0f';
        document.getElementById("climatizationSwitch_label").style.setProperty('--before-transform', 'translateX(20px)');
        document.getElementById("climatizationSwitch_label").style.backgroundColor = '#0f0f0f';
    } else{
        sendOrder("generalAuto_off");

        lights.classList.remove('button_disabled');
        lightsSwitch.classList.remove('button_disabled');
        climatization.classList.remove('button_disabled');
        climatizationSwitch.classList.remove('button_disabled');
        //Move switches
        document.getElementById("lightsSwitch_label").style.setProperty('--before-transform', 'translateX(0px)');
        document.getElementById("lightsSwitch_label").style.backgroundColor = '';
        document.getElementById("climatizationSwitch_label").style.setProperty('--before-transform', 'translateX(0px)');
        document.getElementById("climatizationSwitch_label").style.backgroundColor = '';
    }
});

lightsSwitch_input.addEventListener('change', function(){
    if(this.checked){
        sendOrder("lgtAuto_on");

        document.getElementById("lightsSwitch_label").style.backgroundColor = '#0f0f0f';
        document.getElementById("lightsSwitch_label").style.setProperty('--before-transform', 'translateX(20px)');
        lights.classList.add('button_disabled');
    } else{
        sendOrder("lgtAuto_off");

        document.getElementById("lightsSwitch_label").style.backgroundColor = '';
        document.getElementById("lightsSwitch_label").style.setProperty('--before-transform', 'translateX(0px)');
        lights.classList.remove('button_disabled');
    }
});

climatizationSwitch_input.addEventListener('change', function(){
    if(this.checked){
        sendOrder("ACAuto_on");

        document.getElementById("climatizationSwitch_label").style.setProperty('--before-transform', 'translateX(20px)');
        document.getElementById("climatizationSwitch_label").style.backgroundColor = '#0f0f0f';
        climatization.classList.add('button_disabled');
    } else{
        sendOrder("ACAuto_off");

        document.getElementById("climatizationSwitch_label").style.backgroundColor = '';
        document.getElementById("climatizationSwitch_label").style.setProperty('--before-transform', 'translateX(0px)');
        climatization.classList.remove('button_disabled');
    }
});


//MENUS
const menu_lights = document.getElementById("menu_lights");
const menu_pool = document.getElementById("menu_pool");

function menuLights_show(){
    screenText.innerText = "LUCES";
    document.getElementById("menu").style.display = 'none';
    document.getElementById("return_container").style.visibility = 'visible';
    menu_lights.style.display = 'flex';
}
function menuPool_show(){
    /*screenText.innerText = "PISCINA";
    document.getElementById("menu").style.display = 'none';
    document.getElementById("return_container").style.visibility = 'visible';
    menu_pool.classList.add
    menu_pool.style.display = 'flex';*/
    document.getElementById("pool").classList.toggle('selected_button');
    
    if(document.getElementById("pool").classList.contains('selected_button')){
        sendOrder("pool_on");
    } else{
        sendOrder("pool_off");
    }
}
function back(){
    screenText.innerText = "MENÚ";
    document.getElementById("menu").style.display = '';
    document.getElementById("return_container").style.visibility = '';
    menu_lights.style.display = '';
    menu_pool.style.display = '';
}

//LIGHTS SLIDER
const sliderLights = document.getElementById("sliderLights");
const sliderLights_text = document.getElementById("sliderLights_text");

sliderLights.addEventListener('input', () => {
    sliderLights_text.innerText = sliderLights.value+"%";
});


const lights_buttons = document.querySelectorAll("#menu_lights button");
let activeButton, sendOrderHandler = null;
let buttonsValues = {};

//Selected Button
lights_buttons.forEach(button => {
    button.addEventListener('click', () => {
        document.getElementById("sliderLights_container").style.display = 'flex';

        if(button.classList.contains('selected_button')){
            button.classList.remove('selected_button');
            document.getElementById("sliderLights_container").style.display = '';
            activeButton = null;

            sliderLights.removeEventListener('input', sendOrderHandler);
        } else{
            if(activeButton){
                activeButton.classList.remove('selected_button');
            }

            button.classList.add('selected_button');
            activeButton = button;
            sendOrder(button.id + "_on");

            setupOrder(button.id);
        }
    });
});

function setupOrder(buttonID){
    sliderLights.removeEventListener('input', sendOrderHandler);

    sendOrderHandler = () => {
        const value = sliderLights.value;
        buttonsValues[buttonID] = value;

        if(buttonID === "pbed"){
            sendOrder("S" + buttonID + sliderLights.value);
        } else if(buttonID === "pbath"){
            sendOrder("S" + buttonID + sliderLights.value);
        } else if(buttonID ===  "bath"){
            sendOrder("S" + buttonID + sliderLights.value);
        } else if(buttonID ===  "stud"){
            sendOrder("S" + buttonID + sliderLights.value);
        } else if(buttonID ===  "bed1"){
            sendOrder("S" + buttonID + sliderLights.value);
        } else if(buttonID ===  "bed2"){
            sendOrder("S" + buttonID + sliderLights.value);
        } else if(buttonID ===  "ext"){
            sendOrder("S" + buttonID + sliderLights.value);
        } else if(buttonID ===  "liv"){
            sendOrder("S" + buttonID + sliderLights.value);
        } else if(buttonID ===  "kit"){
            sendOrder("S" + buttonID + sliderLights.value);
        } else if(buttonID ===  "pbath2"){
            sendOrder("T" + buttonID + sliderLights.value);
        } else if(buttonID ===  "bath2"){
            sendOrder("T" + buttonID + sliderLights.value);
        } else if(buttonID ===  "pbed2"){
            sendOrder("T" + buttonID + sliderLights.value);
        } else if(buttonID ===  "laun"){
            sendOrder("S" + buttonID + sliderLights.value);
        }
    }

    sliderLights.addEventListener('input', sendOrderHandler);

    if(buttonID in buttonsValues){
        sliderLights.value = buttonsValues[buttonID];
        sliderLights_text.innerText = sliderLights.value+"%";

    } else{
        sliderLights.value = 50;
        sliderLights_text.innerText = sliderLights.value+"%";
    }
}



const gar = document.getElementById("gar");

function open_garage(){
    gar.classList.toggle('selected_button');
    
    if(gar.classList.contains('selected_button')){
        sendOrder("garage_on");
    } else{
        sendOrder("garage_off");
    }
}


//POOL SLIDER
const sliderPool = document.getElementById("sliderPool");
const sliderPool_text = document.getElementById("sliderPool_text");

sliderPool.addEventListener('input', () => {
    sliderPool_text.innerText = sliderPool.value+"%";
});





//FUNCIÓN TEMPORAL
function temp(){
    document.getElementById("flakeStart").style.display = 'none';
    document.getElementById("flakeConnected_show").classList.add('flakeConnected');
    screenText.innerText = "MENÚ";
    document.getElementById("main_container").style.display = 'flex';
    document.getElementById("flakeConnected").style.visibility = 'visible';
}