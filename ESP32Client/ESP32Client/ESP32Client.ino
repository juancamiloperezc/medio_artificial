#include <WiFiManager.h>

// macros
#define SERIAL_DEBUG // descomente esta linea si desea verificar datos en el puerto serie

//prototipos
void connectWiFi();

// variables
const char *ssidCaptive = "medio_artificial_esp32"; // se define nombre del SSID del portal cautivo

//objetos
WiFiManager wifiManager;

void setup() {
  // se configura el modo de conexión a wifi
  // como estación
  WiFi.mode(WIFI_STA);

  #ifdef SERIAL_DEBUG   
   Serial.begin(115200); // se incializa el monitor serie
  #endif
}

void loop() { 
    connectWiFi();
}


// se conecta el wifi o se activa el portal cautivo en caso de desconexión
void connectWiFi(){
  if (!WiFi.status() == WL_CONNECTED) { // se verifica conexión a la red

    #ifdef SERIAL_DEBUG
     Serial.println("no conectado");
    #endif

    // se intenta conectar a la última red por defecto
    wifiManager.autoConnect(ssidCaptive);
    
    #ifdef SERIAL_DEBUG
      Serial.print("\n\nConectado a -> ");
      Serial.println(WiFi.SSID());
      Serial.print("ip -> " );
      Serial.println(WiFi.localIP());
      Serial.println("\n");
    #endif
  }
}

