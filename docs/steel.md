# How to deploy the platform

![CAP Platform Steel Blueprint](images/Steel.png?raw=true "CAP Platform Steel Blueprint")

Here you can find [Steel Blueprint](https://github.com/Engineering-Research-and-Development/capri_cap_blueprints/tree/main/pharma), following the step described below you can run the CAP.

### DEPLOYMENT STEPS:
-   [Organizing steel Folder](#step-1-organizing-steel-folder)
-   [Starting Spark-Kafka Compose](#step-2-starting-spark-compose-and-simulators)
-   [Configure Kafka Topics](#step-3-configure-kafka-topics)
-   [Access Main Services](#step-4-access-main-services)
-   [Running the Algorithm](#step-5-running-the-algorithm)

## Step 1: Organizing steel Folder
CAP Platform is already provided with all data necessary to deploy algorithms provided until now.
If you have not to add/modify any solution, you can skip this step and go to step 2.
Otherwise, to make any modification or addition to the algorithms, this is the folder structure:

**CAPRI**<br/>
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

## Step 2: Starting Spark Compose

First of all it is necessary to start CAP docker compose.

```
cd steel
docker compose up
```
Then check if every docker is up with:
```
docker ps
```
You should find every docker container relative to each service up.
**Warning:** *spark master and workers could be tagged as "unhealthy" but it is caused by the setup execution.*

When all dockers are up it is possible to go on.



## Step 3: Configure Kafka Topics

This step is about how to create and manage Kafka topics. CAP platoform docker compose is provided with the kafka service which
implements 4 standard topics:
- *casting-machine.measurement.v0* for strand data
- *casting-machine.billets.v0* for billet data
- *secondary-metallurgy.analysis.v0* for metallurgy data
- *job_topic* for interal pre-processing -> processing communication

This is the example Kafka and zookeeper docker compose part.
```yaml
  zookeeper:
    image: wurstmeister/zookeeper
    container_name: zookeeper
    ports:
      - "2181:2181"
    extra_hosts:
      - "kafka:172.28.1.17"
    logging:
      options:
          max-size : "200m"
    networks:
      spark_net:
        ipv4_address: 172.28.1.17 

  kafka:
    image: wurstmeister/kafka:2.12-2.4.1
    container_name: kafka
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    expose:
      - "9093"
    logging:
      options:
          max-size : "200m"
    environment:
      KAFKA_ADVERTISED_HOST_NAME: 172.28.1.16
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://{IP}:9092
      KAFKA_BROKER_ID: 1
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_CREATE_TOPICS: "casting-machine.measurement.v0:1:1,secondary-metallurgy.analysis.v0:1:1,job_topic:1:1"
    extra_hosts:
      - "zookeeper:172.28.1.17"
      - "kafka:172.28.1.16"
    networks:
      spark_net:
        ipv4_address: 172.28.1.16   
```
If you want to change  topics, under the **KAFKA_CREATE_TOPICS** environment variable:

- change the topic name 
- for each topic, you can set up both the **replica factor** and **number of partitions** indicated in topicname:**replica_factor**:**n_partitions**
- you can also add other topics, if needed


Once configured the kafka service in docker-compose it is possible to set the retention period. To do so, enter in the kafka docker and type the following command:
```
docker exec -it kafka bash
kafka-configs.sh --zookeeper 136.243.156.113:2181 --entity-type topics --alter --entity-name TOPIC_NAME --add-config retention.ms=259200000
```
In this way it is possible to automatically delete data from topics and avoid high disk space filling ratio. 




## Step 4: Accessing main services

Once all docker composes are up and algorithms are running, it is possible to access the following main services.
If the machine is equipped with a browser, you can access them through the exposed ports. If you have to access them from another machine, consider to open the ports or set up a ssh tunneling. <br/>
Main services to be accessed are:
- **YARN** : localhost:8788 (on browser to check spark app statuses)




## Step 5: Running the algorithms

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