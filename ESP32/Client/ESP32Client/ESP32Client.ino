#include <HTTPClient.h>
#include <WiFiManager.h>

#include "DHTesp.h"
#include "Led.h"

// macros
#define SERIAL_DEBUG // descomente esta linea si desea verificar datos en el puerto serie

// macros para la definición de pines
#define DHT_PIN          32  // pin para el sensor de temperatura
#define HUMIDITY_PIN     35 // pin para el sensor de temperatura
#define WATER_BOMB_PIN   12 // pin para la motobomba de riego
#define VENTILATOR_PIN   13 // pin para los ventiladores
#define PELTIER_PIN      14 // pin para la celda peltier

// macros para la definición de los rangos de medicion



//prototipos
void connectWiFi();
void taskControlCode(void *parameter);
void taskSendDataCode(void *parameter);
int sendDataPOST(char * body, char * url);
uint32_t readTemperature();

// variables
const char *ssidCaptive = "medio_artificial_esp32"; // se define nombre del SSID del portal cautivo
const char *localHost = "http://192.168.26.246:3001"; 

uint16_t n_meditions = 0; // número de mediciones de los sensores para hallar el promedio
uint32_t medTemp = 0;
uint32_t medHum = 0;
uint32_t averageTemp = 0; // promedio de medidas
uint32_t averageHum = 0; // promedio de medidas de temperatura
uint32_t cummulativeTemp = 0;
uint32_t cumulativeHum = 0;

static SemaphoreHandle_t mutex; // semaforo para la lectura de los sensores

//objetos
WiFiManager wifiManager; //objeto para el manejo del portal cautivo
DHTesp dht;

Led waterBomb(WATER_BOMB_PIN, DRAIN); // se crea objeto para control de la motobomba
Led ventilators(VENTILATOR_PIN, DRAIN); // se cres objeto para la activación de los ventiladores

void setup() {
  //borrar credenciales
  /*wifiManager.resetSetting();
  while(1);*/

  // se inicializan los sensores y actuadores
  dht.setup(DHT_PIN, DHTesp::DHT11);
  waterBomb.init();
  ventilators.init(); 

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

      // se toman las mediciones de los sensores
      medTemp = readTemperature();
      medHum = map(analogRead(HUMIDITY_PIN), 0, 4096, 0, 100);
      cummulativeTemp += medTemp;
      cumulativeHum += medHum;
      n_meditions++; // se aumenta el número de mediciones

    xSemaphoreGive(mutex);
    
    #ifdef SERIAL_DEBUG 
    #endif

    vTaskDelay(1000/portTICK_PERIOD_MS);

    // TO DO LIST: condiciones de uso de los actuadores

  }
}

// tarea para enviar los datos de los sensores al servidor
void taskSendDataCode(void *parameter){
  while(1){
    
    if (! (WiFi.status() == WL_CONNECTED)) connectWiFi(); // se asegura la conexión a internet 

    xSemaphoreTake(mutex, portMAX_DELAY);

    averageTemp =  cummulativeTemp / n_meditions;
    averageHum = cumulativeHum / n_meditions;

    uint16_t id_colino= 1;
      
    
    String val1 = String(averageTemp/100) + ".";
    (averageTemp%100 < 10)? val1 += "0" + String(averageTemp%100) : val1 += String(averageTemp%100);
    
    String val2 = String(averageHum/100) + ".";
    (averageHum%100 < 10)? val2 += "0" + String(averageHum%100) : val2 += String(averageHum%100);

    String bodyTemp =  "{ \"id\" : " + String(id_colino) + "," ;
    bodyTemp += " \"medition\" :" + String(val1) + "}"; 

    String bodyHum =  "{ \"id\" : " + String(id_colino) + "," ;
    bodyHum += " \"medition\" :" + String(val2) + "}"; 

    if (WiFi.status() == WL_CONNECTED){
     sendDataPOST(bodyTemp.c_str(), "/saveTemp");
     sendDataPOST(bodyHum.c_str(), "/saveHum");
    }

    // se reinician los valores
    averageHum = 0;
    averageTemp = 0;
    n_meditions = 0;
    cumulativeHum = 0;
    cummulativeTemp = 0;

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
      
      // Send HTTP GET request
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

uint32_t readTemperature(){
     uint32_t read = (uint32_t) dht.getTemperature();

     while (isnan(read) || read > 50){
        delay(100);
        read = (uint32_t) dht.getTemperature();
     }
     
     Serial.print(read);
     Serial.println(" C");
     return read;
}
