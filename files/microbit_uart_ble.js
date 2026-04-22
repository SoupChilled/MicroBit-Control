const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const UART_TX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const UART_RX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

let uBitDevice;
let rxCharacteristic;

const disconnectButton = document.getElementById('flakeConnected_show');
const screenText = document.getElementById('screen_text');
let disconnectTimeout;
let countdownInterval;
let flagDisconnected = false;


async function flakePressed(){
    try{
        console.log("Requesting Bluetooth Device...");
        uBitDevice = await navigator.bluetooth.requestDevice({
            filters:[{namePrefix: "BBC micro:bit"}],
            optionalServices: [UART_SERVICE_UUID]
        });

        document.getElementById("flakeStart_show").classList.add('rotate_animation');

        uBitDevice.addEventListener('gattserverdisconnected', onDisconnected);

        console.log("Connecting to GATT Server...");
        const server = await uBitDevice.gatt.connect();

        console.log("Getting Service...");
        const service = await server.getPrimaryService(UART_SERVICE_UUID);

        console.log("Getting Characteristics...");
        const txCharacteristic = await service.getCharacteristic(
            UART_TX_CHARACTERISTIC_UUID
        );
        txCharacteristic.startNotifications();
        txCharacteristic.addEventListener(
            "characteristicvaluechanged",
            onTxCharacteristicValueChanged
        );
        rxCharacteristic = await service.getCharacteristic(
            UART_RX_CHARACTERISTIC_UUID
        );
        
        document.getElementById("flakeStart_show").classList.remove('rotate_animation');
        document.getElementById("flakeStart_show").classList.add('flakeConnected');
        screenText.innerText = "CONECTADO";

        setTimeout(function(){
            document.getElementById("flakeStart").style.display = 'none';
            document.getElementById("flakeConnected_show").classList.add('flakeConnected');
            screenText.innerText = "MENÚ";
            document.getElementById("main_container").style.display = 'flex';
            document.getElementById("flakeConnected").style.visibility = 'visible';
        }, 2000);
    }catch(error){
        console.log(error);
    }
}


function onDisconnected(event){
    let device = event.target;
    console.log(`Device ${device.name} is disconnected.`);

    document.getElementById("flakeConnected_show").classList.remove("flakeConnected");
    document.getElementById("flakeStart_show").classList.remove("flakeConnected");

    if(flagDisconnected){
        screenText.innerText = "Desconectado";
    } else{
        screenText.innerText = "CONEXIÓN PERDIDA";
    }

    document.getElementById("main_container").style.display = '';
    document.getElementById("menu").style.display = '';
    document.getElementById("return_container").style.visibility = '';
    menu_lights.style.display = '';
    menu_pool.style.display = '';
    
    setTimeout(function(){
        document.getElementById("flakeStart").style.display = '';
        screenText.innerText = "RECONECTA";
        document.getElementById("flakeStart_show").classList.remove('rotate_animation');
        document.getElementById("flakeConnected").style.visibility = '';

        setTimeout(function(){
            location.reload();
        }, 700);
    }, 2000);
}


function onTxCharacteristicValueChanged(event){
    let receivedData = [];
    for(var i = 0; i < event.target.value.byteLength; i++){
        receivedData[i] = event.target.value.getUint8(i);
    }

    const receivedString = String.fromCharCode.apply(null, receivedData);
    console.log(receivedString);
    if(receivedString === "S"){
        console.log("Shaken!");
    }
}


function disconnectDevice(){
    clearInterval(countdownInterval)
    screenText.innerText = "Desconectado";
    flagDisconnected = true;
    if(rxCharacteristic){
        rxCharacteristic.service.device.gatt.disconnect();
        console.log("Desconectado de la Micro:Bit");
    } else{
        console.log("No hay Micro:Bit conectada");
    }
}
function startDisconnectTimer(){
    console.log("Botón presionado. Desconectando en 3 segundos...");
    flagDisconnected = false;
    startCountdown();
    disconnectTimeout = setTimeout(disconnectDevice, 3000);
};
function cancelDisconnectTimer(){
    if(!flagDisconnected){
        clearTimeout(disconnectTimeout);
        clearInterval(countdownInterval);
        screenText.innerText = "Desconexión anulada";
        console.log("Desconexión cancelada");
        
        setTimeout(function(){
            if(window.getComputedStyle(menu_lights).display === "flex"){
                screenText.innerText = "LUCES";
            } else if(window.getComputedStyle(menu_pool).display === "flex"){
                screenText.innerText = "PISCINA";
            } else{
                screenText.innerText = "MENÚ";
            }
            
        }, 1500);
    }
};
function startCountdown(){
    let timeLeft = 3;
    screenText.innerText = "Desconexión en " + timeLeft + "s";
    
    countdownInterval = setInterval(() => {
        timeLeft--;
        screenText.innerText = "Desconexión en " + timeLeft + "s";
        if(timeLeft <= 0){
            clearInterval(countdownInterval);
        }
    }, 1000)
}

disconnectButton.addEventListener('mousedown', startDisconnectTimer);
disconnectButton.addEventListener('mouseup', cancelDisconnectTimer);

disconnectButton.addEventListener('touchstart', startDisconnectTimer);
disconnectButton.addEventListener('touchend', cancelDisconnectTimer);