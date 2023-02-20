# Introduction to Pharma Blueprint

The main focus of Pharma use case is the development and implementation of advanced control concepts based on the cognitive solutions in the existing continuous line.
For that CAPRI projec will support the:
- increase the robustness of the process
- secure constant product quality
- increase effectiveness (raw material, energy, process time, storage capacity)
- reduce waste material
- reduce labour effort (e.g. off-line end product testing)


The Pharma blueprint has been developed with open-source components to satisfy the needs abovementioned. In the following section is reported a guide to deploy the platform, useful as a starting point to increase its functionalities.


![CAP Platform Pharma Blueprint](images/Pharma.png?raw=true "CAP Platform Pharma Blueprint")

# How to deploy the platform

Here you can find [Pharma Blueprint](https://github.com/Engineering-Research-and-Development/capri_cap_blueprints/tree/main/pharma), following the step described below you can run the CAP.

The CAP platform is provided in two folders:
- **PharmaCAP_Processing:** containing the docker-compose for Apache Spark (spark master and workers), HDFS, FIWARE Draco and Apache Livy. It also contains algorithm solutions and data to be executed and the FIWARE Orion-PySpark Connector.
- **PharmaCAP_Visualization:** containing most of the CAPRI components, such as FIWARE Orion Context Broker, FIWARE IoTAgents, MongoDB database, FIWARE Quantumleap, CrateDB, Grafana

This guide take "pharma" as starting working folder for each step.

### DEPLOYMENT STEPS:
-   [Organizing Pharma Folder](#step-1-organizing-pharmacap_rocessing-folder)
-   [Starting Spark Compose and simulators](#step-2-starting-spark-compose-and-simulators)
-   [Configure OPCUA Agents](#step-3-configure-opcua-agents)
-   [Starting PharmaCAP_Visualization docker compose](#step-4-starting-pharmacap_visualization-docker-compose)
-   [Access Main Services](#step-5-access-main-services)
-   [OCB Entities and Subscriptions](#step-6-ocb-entities-and-subscriptions)
-   [Running the Algorithms](#step-7-running-the-algorithms)
-   [Setting up Grafana](#step-8-setting-up-grafana)

## Step 1: Organizing PharmaCAP_Processing Folder
CAP Platform is already provided with all data necessary to deploy algorithms provided until now.
If you have not to add/modify any solution, you can skip this step and go to step 2.
Otherwise, to make any modification or addition to the algorithms, this is the folder structure:

**PharmaCAP_Processing**<br/>
---| docker-compose.yml<br/>
---| **DATA**<br/>
------| draco<br/>
------| setup<br/>
------| ...<br/>
------| **jobs**<br/>
---------| **py** <br/>
------------| Solution1 <br/>
------------| Solution2<br/>
------------| ... <br/> 
------------| **SolutionN** (example) <br/>
---------------| SolutionN.py <br/>
---------------| SolutionN Postman Collection.json <br/>
---------------| SolutionN accessoryfile1 <br/>
---------------| SolutionN accessoryfile2 <br/>
---------------| SolutionN pyspark connector lib + conf files <br/>
---------------| SolutionN datafolder <br/>
<br/>
Place each additional solution in the **py** folder. An example of solution structure was provided by opening **SolutionN** folder.
Other folders contains data and configuration for each component.

## Step 2: Starting Spark Compose and simulators

First of all it is necessary to start CAP docker compose.

```
cd PharmaCAP_Processing
docker compose up
```
Then check if every docker is up with:
```
docker ps
```
You should find every docker container relative to each service up.
**Warning:** *spark master and workers could be tagged as "unhealthy" but it is caused by the setup execution.*

When all dockers are up it is possible to launch every simuulator needed (if any).
Instructions to launch every simulator is provided in the solution's individual README. However, in general (for python simulators):
```
cd data/jobs/py/SolutionFoolder
python simulator.py
```

Otherwise, if connected with real plant servers, only check the connection works before stepping ahead.


## Step 3: Configure OPCUA Agents

This step is about how to configure and deploy a [FIWARE OPCUA Agent](https://github.com/Engineering-Research-and-Development/iotagent-opcua). CAP platoform is provided with a complete configuration, however if you need to the setup follow this step. Ohterwise, it is possible to skip to the next step.

In the **PharmaCAP_Visualization** folder there is data regarding OPCUA Agent and grafana data. The folder structure is the following

**PharmaCAP_Visualization**<br/>
---| docker-compose.yml<br/>
---| grafana_data <br/>
---| Grafana Dashboards <br/>
---| AGECONF_SOLUTION1 <br/>
---| AGECONF_SOLUTION2 <br/>
---| ... <br/>
---| **conf** (example) <br/>
------| **config.js** (if executed first time) <br/>

Where **config.js** is the configuration file in which the agent maps entities on Orion Context Broker. <br/>

```iot-agent:
    image: iotagent4fiware/iotagent-opcua:latest
    hostname: iotagent-opcua
    depends_on:
      - mongodb
      - orion
    networks:
      - hostnet
    ports:
      - "4041:4041"
      - "9229:9229"
    environment:
      - "IOTA_CB_HOST=orion"
      - "IOTA_CB_PORT=1026"
      - "IOTA_NORTH_PORT=4041"
      - "IOTA_REGISTRY_TYPE=mongodb"
      - "IOTA_MONGO_HOST=mongodb"
      - "IOTA_MONGO_PORT=27017"
      - "IOTA_MONGO_DB=iotagent_opcua"
      - "IOTA_PROVIDER_URL=http://iotagent-opcua:4041"
      - "IOTA_OPCUA_ENDPOINT=opc.tcp://{IP}:{PORT}{URI}"
      - "IOTA_OPCUA_SECURITY_MODE=None"
      - "IOTA_OPCUA_SECURITY_POLICY=None"
      #- "IOTA_OPCUA_SECURITY_USERNAME=null"
      #- "IOTA_OPCUA_SECURITY_PASSWORD=null"
      - "IOTA_OPCUA_UNIQUE_SUBSCRIPTION=false"
      - "IOTA_OPCUA_SUBSCRIPTION_NOTIFICATIONS_PER_PUBLISH=1000"
      - "IOTA_OPCUA_SUBSCRIPTION_PUBLISHING_ENABLED=true"
      - "IOTA_OPCUA_SUBSCRIPTION_REQ_LIFETIME_COUNT=100"
      - "IOTA_OPCUA_SUBSCRIPTION_REQ_MAX_KEEP_ALIVE_COUNT=10"
      - "IOTA_OPCUA_SUBSCRIPTION_REQ_PUBLISHING_INTERVAL=1000"
      - "IOTA_OPCUA_SUBSCRIPTION_PRIORITY=128"
      - "IOTA_EXTENDED_FORBIDDEN_CHARACTERS=[]"
      - "IOTA_OPCUA_MT_POLLING=false"
      - "IOTA_OPCUA_MT_AGENT_ID=age01_"
      - "IOTA_OPCUA_MT_ENTITY_ID=age01_Pharma"
      - "IOTA_OPCUA_MT_ENTITY_TYPE=Device"
      - "IOTA_OPCUA_MT_NAMESPACE_IGNORE=0,7"
      - "IOTA_OPCUA_MT_STORE_OUTPUT=true"
    volumes:
      - ./conf:/opt/iotagent-opcua/conf

```
The environment variables defined in the docker-compose allow you to configure the OPCUA Agent

- IOTA_OPCUA_ENDPOINT --> define the server OPCUA endpoint
- IOTA_OPCUA_MT_ENTITY_ID=age01_Pharma --> define the name of the entity will be created on the CB
- change the environment variables IOTA_OPCUA_MT_ENTITY_ID, IOTA_OPCUA_MT_ENTITY_ID, IOTA_OPCUA_MT_ENTITY_TYPE with the desired names

## Step 4: Starting PharmaCAP_Visualization Docker compose

Once checked the simulators are running / the OPCUA server is working correctly, it's possible to start the IoT Agent docker compose.

Run this command to allow Crate to start properly
```
sysctl -w vm.max_map_count=262144
```

```
cd PharmaCAP_Visualization
docker compose up
```
Then check if every docker is up with:
```
docker ps
```
You should find every docker container relative to each service up.


## Step 5: Accessing main services

Once all docker composes are up and algorithms are running, it is possible to access the following main services.
If the machine is equipped with a browser, you can access them through the exposed ports.
Main services to be accessed are:
- **YARN** : localhost:8788 (on browser to check spark app statuses)
- **Draco** : localhost:9090/nifi/ (on browser to run batch algorithms -see later-)
- **Livy** : localhost:8998/ (on browser to check livy session status)
- **Orion context broker** : localhost:1026/ (from postman or CURLS for entity management)
- **Crate UI** : localhost:4200 (on browser check data flow from OCB - Quantumleap)
- **Grafana** : localhost:3000 (on browser, visualization tool)


## Step 6: OCB Entities and Subscriptions

After running the PharmaCAP_Visualization compose, it is suggested to create OCB entities and subscriptions for each solution.
In each solution folder it's possible to find its postman collection

**PharmaCAP_Processing**<br/>
---| **DATA**<br/>
------| **jobs**<br/>
---------| **py** <br/>
------------| **SolutionN** (example) <br/>
---------------| **SolutionN Postman Collection.json** <br/>

Download Postman (if needed) and import the relative collection.
Once imported the files, do the following steps:

- Adjust the IPs on the top of each API
  - http://**OCBIP:1026**/rest/of/API. The OCBIP should be the IP of the machine running the OCB
- Send the Output Entity Creation API (generally called Create Output Entity SOLUTIONX)
- Send the Connector subscription API (generally called post subscription)
- Send the QuantumLeap subscription API (generally called quantumleap subscription)


## Step 7: Running the algorithms

To run the algorithm, follow each solution guide provided in each solution's folder.
Generally speaking, there are two kind of algorithms:
- **Batch algorithms** usually runned on livy docker container with the help of Draco
  - Usually they need to install library dependencies on livy container (dependencies expressed in solution's guide)
- **Real time algorithms** usually runned on sparkmaster container
  - They should have every dependency already installed on sparkmaster container, however further modifications may need other libraries

In both case is reccomended to check if the execution starts correctly and wait for the first results to be displayed on screen. <br/>

To understand how to allocate resources, here some simple formulas:
- **n_nodes** : total number of machines
- **machine_cores** : number of cores per machine
- **machine_mem** : memory for each machine
- **executor_max_vcores**: From research, 5
- **tot_machine_executors**: floor((machine_cores - 1)/5)
- **tot_executors**: (tot_machine_executors * n_nodes) - 1
- **optimal_executor_memory**: ((machine_mem / tot_machine_executor)-1g) - (((machine_mem / tot_machine_executor)-1g) \* 0.07)

Each spark-submit execution has some command options that can be changed by the user based on needs. Here the list of arguments modifiable with the minimum/maximum/suggested amount of resources:
- **num_executors**: 1 / tot_machine_executors / 2
- **executor_cores**: 1 / 4 / 4 
- **driver_memory** : 512m / 4g / 1g
- **executor_memory** :512m / 4g / min(4g, max(512, optimal_executor_memory/(2 * total_number_of_algs)))

Moreover there are more things to consider:
- YARN doubles the amount of memory allocated for execution, meaning that 512m declared becomes 1g effective
- Suggested amount of resources has to be limited due to machine limits, setting them to the highest possible maximum
- Minimum and maximum amount of resources can be expanded in yarn configuration
- For small algorithms / if resources are not enough (check the scheduler on YARN service to see the resources) it is suggested to use the following settings:
  - **num_executors**: 2
  - **executor_cores**: 1
  - **driver_memory** : 512m
  - **executor_memory** : 512m
  
  
 To add more resources to yarn, type the following lines of code:
```
docker exec -it sparkmasterdemo bash
yarn nodemanager &
```
This will add extra 8 giga and extra 8 vcores to the platform


## Step 8: Setting Up Grafana

On first grafana deploy, dashboards must be created and imported. It is possible to login to grafana at **localhost:3000** and access with the default user "admin" "admin".
Cap platform is provided with all Grafana dashboards already prepared in ENG environment. It is possible to find them in the following folder:

**PharmaCAP_Visualization**<br/>
---| docker-compose.yml<br/>
---| grafana_data <br/>
---| **Grafana Dashboards** <br/>
---| SOLUTION1 <br/>
---| SOLUTION2 <br/>
---| ... <br/>

In order to make grafana working, the following steps should be followed: <br/>
- Add the crate data source: 
  - Go to Data sources in the bottom left part of the screen: 
  - Click on "Add Data Source"
  - Select Postgresql
  - Compile with:
    - host: crate:5432
    - database: iotage
    - user: crate
    - password: 
    - TLS/SSL mode: disable
  - Click on save & test
- Install grafana plugins:
  - Go to Plugins in the bottom left part of the screen: 
  - Install Plotly and Plotly panel
- Create a new dasboard and populate it with the provided JSON:
  - Go to dashboards in the upper left part of the screen: 
  - Click on import
  - Copy the content of the solution-related dashboard from the abovementioned folder to the JSON Model
  - Select the Dashboard folder and confirm the importing.
 