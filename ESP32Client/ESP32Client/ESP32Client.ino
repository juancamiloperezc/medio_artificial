#include <HTTPClient.h>
#include <WiFiManager.h>

// macros
#define SERIAL_DEBUG // descomente esta linea si desea verificar datos en el puerto serie
#define POT1  34
#define POT2  35

//prototipos
void connectWiFi();
void taskControlCode(void *parameter);
void taskSendDataCode(void *parameter);
int sendDataPOST(char * body, char * url);

// variables
const char *ssidCaptive = "medio_artificial_esp32"; // se define nombre del SSID del portal cautivo
const char *localHost = "http://192.168.26.246:3001"; 

uint16_t valPot1 = 0;
uint16_t valPot2 = 0;

static SemaphoreHandle_t mutex; // semaforo para la lectura de los sensores

//objetos
WiFiManager wifiManager; //objeto para el manejo del portal cautivo

void setup() {
  //borrar credenciales
  /*wifiManager.resetSetting();
  while(1);*/

  #ifdef SERIAL_DEBUG   
   Serial.begin(115200); // se incializa el monitor serie
  #endif

  // se configura el modo de conexión a wifi
  // como estación
  WiFi.mode(WIFI_STA);

  TaskHandle_t ControlHandle, sendDataHandle;

  mutex = xSemaphoreCreateMutex();

  // se crean las tareas para ejecutar en cada nucleo

  //tarea para leer datos de los sensores
  xTaskCreatePinnedToCore(
     taskControlCode, // método a ejecutar
     "taskControl", // nombre de la tarea
     10000, // tamaño en words de la pila
     NULL,  // parametro de la tarea
     10, //prioridad
     &ControlHandle,
     1 //número del nucleo a ejecutar la tarea
  );

  //tarea para enviar los datos al servidor
  xTaskCreatePinnedToCore(
     taskSendDataCode, // método a ejecutar
     "taskSendData", // nombre de la tarea
     10000, // tamaño en words de la pila
     NULL,  // parametro de la tarea
     11, //prioridad
     &sendDataHandle,
     0 //número del nucleo a ejecutar la tarea
  );
}

void loop() { 
  // se elimina el loop
  vTaskDelete(NULL);
}

// tarea para leer y controlar
void taskControlCode(void *parameter){
  while(1){
    // CÓDIGO DE PRUEBA CON POTENCIOMETROS
    xSemaphoreTake(mutex, portMAX_DELAY);
    valPot1 = analogRead(POT1) * 330 / 4095;
    valPot2 = analogRead(POT2) * 330 / 4095;
    
    String val1 = String(valPot1/100) + ".";
    (valPot1%100 < 10)? val1 += "0" + String(valPot1%100) : val1 += String(valPot1%100);
    
    String val2 = String(valPot2/100) + ".";
    (valPot2%100 < 10)? val2 += "0" + String(valPot2%100) : val2 += String(valPot2%100);

    xSemaphoreGive(mutex);
    
    #ifdef SERIAL_DEBUG 
      Serial.print("\nnucleo: ");
      Serial.println(xPortGetCoreID());
      Serial.print("pot1: ");
      Serial.println(val1.c_str());
      Serial.print("pot2: ");
      Serial.println(val2.c_str());
    #endif

    vTaskDelay(1000/portTICK_PERIOD_MS);

    // TO DO LIST: acoplar la lectura y el control para los sensores a utilizar
  }
}

// tarea para enviar los datos de los sensores al servidor
void taskSendDataCode(void *parameter){
  while(1){
    
    if (! (WiFi.status() == WL_CONNECTED)) connectWiFi(); // se asegura la conexión a internet 

    xSemaphoreTake(mutex, portMAX_DELAY);

    uint16_t pos = 1;
    
    String val1 = String(valPot1/100) + ".";
    (valPot1%100 < 10)? val1 += "0" + String(valPot1%100) : val1 += String(valPot1%100);
    
    String val2 = String(valPot2/100) + ".";
    (valPot2%100 < 10)? val2 += "0" + String(valPot2%100) : val2 += String(valPot2%100);

    String bodyTemp =  "{ \"position\" : " + String(pos) + "," ;
    bodyTemp += " \"medition\" :" + String(val1) + "}"; 

    String bodyHum =  "{ \"position\" : " + String(pos) + "," ;
    bodyHum += " \"medition\" :" + String(val2) + "}"; 

    if (WiFi.status() == WL_CONNECTED){
     sendDataPOST(bodyTemp.c_str(), "/saveTemp");
     sendDataPOST(bodyHum.c_str(), "/saveHum");
    }

    xSemaphoreGive(mutex );
    
    
    vTaskDelay(120000/portTICK_PERIOD_MS);
  }
}

// se conecta el wifi o se activa el portal cautivo en caso de desconexión
void connectWiFi(){
  if (! (WiFi.status() == WL_CONNECTED)) { // se verifica conexión a la red

    #ifdef SERIAL_DEBUG
     Serial.println("no conectado");
    #endif

    // se intenta conectar a la última red por defecto
    //wifiManager.setConfigPortalBlocking(false);
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

int sendDataPOST(const char * body, const char * url){
  
    HTTPClient http;

    String host = String(localHost) + String(url);

    #ifdef SERIAL_DEBUG
     Serial.print("\nEnviando peticion POST A -> ");
     Serial.println(host);
    #endif
      
    http.begin(host.c_str());
    http.addHeader("Content-Type", "application/json");
      
    int httpCode = http.POST(body);
      
    if (httpCode>0) {
       #ifdef SERIAL_DEBUG 
        Serial.print("HTTP Response code: ");
        Serial.println(httpCode);
        String payload = http.getString();
        Serial.println(payload);
       #endif  
      }
      else {
        #ifdef SERIAL_DEBUG 
         Serial.print("Error code: ");
         Serial.println(httpCode);
        #endif 
      }

      http.end();

      return httpCode;
}
