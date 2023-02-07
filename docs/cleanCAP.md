# Cleaning CAP Platform

Since CAP is continuously ingesting, processing and storing streams of data through long-lasting real-time algorithms, it continously accumulate data within time. Provided version of CAP limits the amount of disk space required for docker logs and some algorithm execution, however some databases slowly continue to accumulate data.
Through the bash command:
```
docker system df
```
It is possible to understand how all docker images, containers and volumes accumulate data. However, some information like docker logging is not displayed in this report.
Another way to see how much space docker container are occupying is through the command:
```
docker ps -s
```
Where each container shows the amount of disk space used (with also virtual space which is sum of container + image size). Also in this case, some information is not diplayed (i.e: crate database data).
After some investigation, we provide two ways to clean data.


In all CAP platform, there are two main points of data accumulation through time:
- Databases (such as HDFS)
- Spark Master and workers

To clean those two data sources, it is only necessary to do the following steps:

```
cd CAPRI
docker compose down -v
docker compose up
```
It will delete all stored data in CAP, so the deploy must be repeated





