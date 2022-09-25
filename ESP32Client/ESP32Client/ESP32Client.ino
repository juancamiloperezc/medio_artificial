#include <WiFiManager.h>

#define SERIAL_DEBUG // descomente esta linea si desea verificar datos en el puerto serie

//objetos
WiFiManager wifiManager;

char *ssidCaptive = "medio_artificial"; // se define nombre del SSID del portal cautivo

void setup() {
  #ifdef SERIAL_DEBUG   
   Serial.begin(115200); // se incializa el monitor serie
  #endif
}

void loop() { 

  if (WiFi.status() == WL_CONNECTED) { // se verifica conexión a la red

  } else {
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
  delay(1000);
}
