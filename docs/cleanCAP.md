# Cleaning CAP Platform

Since CAP is continuously ingesting, processing and storing streams of data through long-lasting real-time algorithms, it continuously accumulates data within time. Provided version of CAP limits the amount of disk space required for docker logs and some algorithm execution, however some databases slowly continue to accumulate data. Through the bash command:
```
docker system df
```
Another way to see how much space docker container are occupying is through the command:
```
docker ps -s
```
Where each container shows the amount of disk space used (with also virtual space which is sum of container + image size). In all CAP platform version, there are two main points of data accumulation through time:
- Databases (such as HDFS)
- Spark Master and workers

To clean those two data sources, it is only necessary to do the following steps:

```
cd CAPRI
docker compose down -v
docker compose up
```
It will delete all stored data in CAP, so the deploy must be repeated.





