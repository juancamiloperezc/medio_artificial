# MEDIO ARTIFICIAL APP

## INTRODUCTION
This project arises to provide a solution to the early death of the hills due to bad processes, 
by the use of the same tools for all the hills and the same soil of sick plants that caused the death or cause 
the growth of the other hills to stop. Due to the poor care of the hills, contaminated crops are mostly generated 
that reduce their quality and in some cases these crops must be discarded in their entirety because the diseases 
of the land cannot be treated in time.


## SOLUTION 
As a solution to the problem raised, an artificial environment was implemented, also known as a greenhouse, which has two sensors to measure two variables, which are temperature and humidity of the soil in the pot where the hill with the In order to provide a stable temperature for the hill and perfect humidity for its growth, in addition to this, the input data of the hill is recorded, such as: the state, age, size and width with which the hill enters the greenhouse, these data are recorded in the database. This project has a sending of data from the greenhouse to the database and with a web application where the monitored data and the data entered with the parameters of the hill are displayed.

## PRERREQUISITES
As this project is in local development mode, you need a some prerrequisites.

- Install nodejs (V 12.22.9 recommended)
- Have a database manager from sql (recommended xampp)
- Have tables like the next examples:
    
    -  table 'colino':  ![image](https://user-images.githubusercontent.com/87032143/203472307-2495eb14-6599-436f-a992-6146948ec146.png)
    -  table 'fincas': ![image](https://user-images.githubusercontent.com/87032143/203472374-03ee1e34-2e59-4f19-91ad-f9106125f957.png)
    -  table 'medicion_humedades': ![image](https://user-images.githubusercontent.com/87032143/203472433-13700cc7-2063-41b3-910c-09bbc8a11e04.png)
    -  table 'medicion_temperaturas': ![image](https://user-images.githubusercontent.com/87032143/203472479-1af0a4f3-83e4-4cf2-a2df-5469d95c7e86.png)     
    -  table 'usuarios': ![image](https://user-images.githubusercontent.com/87032143/203472528-10e5ab37-3256-404c-84ec-48f225f8a504.png)

- you design of parameter in file https://github.com/juancamiloperezc/medio_artificial/blob/juancamiloperezc-patch-1/Aplicativo/frontend/.env
- you design of parameters in file https://github.com/juancamiloperezc/medio_artificial/tree/main/Aplicativo/backend/src/env

## INSTALLATION
For installation of different sections on our project, You should use the npm package of nodejs

- you should clone this repository and go to the file https://github.com/juancamiloperezc/medio_artificial/tree/main/Aplicativo/backend in your desktop
  open cmd or terminal of you operative system and execute the command 'npm install'

- you repeat the last section but in the next file https://github.com/juancamiloperezc/medio_artificial/tree/main/Aplicativo/frontend

- that firmware upload in ESP32 https://github.com/juancamiloperezc/medio_artificial/blob/main/ESP32/Client/ESP32Client/ESP32Client.ino


## RUN THE PROJECT

- for you run the project you should go to the file https://github.com/juancamiloperezc/medio_artificial/tree/main/Aplicativo/backend, open cdm or terminal in your desktop and write the command 'npm run start'

- for you run the project you should go to the file https://github.com/juancamiloperezc/medio_artificial/tree/main/Aplicativo/frontend, open cdm or terminal in your desktop and write the command 'npm run serve'

- in your navigator of preference you type http://yourURLfrontend:yourPortFrontend and initialize the database manager
    
    for example : 
    
    ![image](https://user-images.githubusercontent.com/87032143/203475296-cea6e31c-8e6d-4881-bac9-55c63beec329.png)
    
    ![image](https://user-images.githubusercontent.com/87032143/203475025-bc1f7358-e2d7-4c65-bba0-5e828a136028.png)
                  
    and get that 
                  
    ![image](https://user-images.githubusercontent.com/87032143/203475105-ab384f2a-b309-4e75-a84b-c5986f0b051b.png)
    
    and run the mangement database 
    
    ![image](https://user-images.githubusercontent.com/87032143/203475838-b3d5ac39-1c95-4fe4-8a5c-03047abbce28.png)
    
    and you run the project in your navigator:
    
    ![image](https://user-images.githubusercontent.com/87032143/203476303-524ab278-bb88-4692-ac4f-34be92a19aa8.png)

                
