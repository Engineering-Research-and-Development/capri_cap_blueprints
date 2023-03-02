# Introduction to Asphalt Blueprint
<div align="justify">
In the asphalt mix manufacturing process, most of the measured data is not usually exploited although it may provide very interesting information. There could be variables for which is not known how to relate with the information obtained or whose relationship is unknow. Even more, some variables might not even ever be measured or were measured only in the laboratory. Additionally, since much of the information is not collected or stored properly, the information provided cannot be traced.
CAPRI project will address the challenge of integrating relevant information data sources as well as knowledge of the personal of the plant, at all the levels: planning, operation and control of the plant. The results of the project will be translated in terms of costs, effectiveness, and product quality for the asphalt mix manufacturing process.
</div>
With the development of CAP Platform, for the asphalt use case there are improvements in the plant like:

-   increase production productivity
-   predictive maintenance
-   increase production quality
-   energy efficiency
-   optimization of resources consumption,reducing the products wasted

The Asphalt blueprint has been developed with open-source components to satisfy the needs abovementioned. In the following section is reported a guide to deploy the platform, useful as a starting point to increase its functionalities.


![CAP Platform Asphalt Blueprint](images/Asphalt.png?raw=true "CAP Platform Asphalt Blueprint")

# How to deploy the platform

Here you can find [Asphalt Blueprint](https://github.com/Engineering-Research-and-Development/capri_cap_blueprints/tree/main/asphalt), following the step described below you can run the CAP.

The CAP platform is provided in two folders:
- **asphaltCAP_Processing:** containing the docker-compose for  HDFS, FIWARE Draco mySQL, phpMyadmin, MQTT Agent.
- **asphaltCAP_Processing:** containing Apache Superset as visualization Layer

This guide take "asphalt" as starting working folder for each step.

### DEPLOYMENT STEPS:
-   [AsphaltCAP_Processing Folder](#step-1-asphaltcap_processing-folder)
-   [Starting Compose](#step-2-starting-compose)
-   [Starting asphaltCAP_Visualization docker compose](#step-3-starting-asphaltcap_visualization-docker-compose)
-   [Access Main Services](#step-4-access-main-services)

## Step 1: Organizing asphaltCAP_Processing Folder
CAP Platform is already provided with all data necessary to deploy algorithms provided until now.
If you have not to add/modify any solution, you can skip this step and go to step 2.
Otherwise, to make any modification or addition to the algorithms, this is the folder structure:

**asphaltCAP_Processing**<br/>
---| docker-compose.yml<br/>
---| hadoop.env<br/>
---| init.sql<br/>
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

## Step 2: Starting Compose

First of all it is necessary to start CAP docker compose.

```
cd asphaltCAP_Processing
docker compose up
```
Then check if every docker is up with:
```
docker ps
```
You should find every docker container relative to each service up.
**Warning:** *spark master and workers could be tagged as "unhealthy" but it is caused by the setup execution.*

## Step 3: Starting asphaltCAP_Processing Docker compose

Once checked the simulators are running / the OPCUA server is working correctly, it's possible to start the IoT Agent docker compose.

```
cd asphaltCAP_Processing
docker compose up
```
Then check if every docker is up with:
```
docker ps
```
You should find every docker container relative to each service up.


## Step 4: Accessing main services

Once all docker composes are up and algorithms are running, it is possible to access the following main services.
If the machine is equipped with a browser, you can access them through the exposed ports.
Main services to be accessed are:
- **YARN** : localhost:8788 (on browser to check spark app statuses)
- **Draco** : localhost:9090/nifi/ (on browser to run batch algorithms -see later-)
- **Orion context broker** : localhost:1026/ (from postman or CURLS for entity management)
- **Superset** : localhost:8080 (on browser, visualization tool)
