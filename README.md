# Spring-Boot React Project

### Requirements
Software and tools you will need to run this project:
* Java 11 (_tested version_)
* Node v14.17.3 (_tested version_)
* Maven

### Project creation
```bash
mvn archetype:generate \
  -DarchetypeGroupId=org.irlab.fd.maven.archetypes \
  -DarchetypeArtifactId=spring-boot-react-archetype \
  -DarchetypeVersion=2.0 \
  -DgroupId=com.theeasteregg \
  -DartifactId=theeasteregg_web \
  -Dversion=0.1-SNAPSHOT \
  -DcurrentYear=2025 \
  -DregCredName=theeasteregg-reg-cred \
  -DdeveloperId=theeasteregg-dev \
  -DdeveloperMail=joaquin.solla@udc.es \
  -DdeveloperName='Joaquin Solla Vazquez' \
  -DgitBaseUrl=gitlab.com \
  -DgitGroup=theeasteregg_web \
  -DprojectDescription='The Easter Egg Web.' \
  -DprojectName='The Easter Egg Web' \
  -DrepoUserId='theeasteregg_web'
```

### Local deployment
**Access frontend in port 3000 (Frontend development)**
* Install your maven project
    ```bash
    mvn clean install
    ```
* Start the application
  ```
  cd /frontend
  ```
  
  ```bash
    npm start
  ```
  
* You can access to the web on http://localhost:3000/theeasteregg_web and quick update it

**Access frontend in port 8080**

* Install your maven project
    ```bash
    mvn clean install
    ```
* Start the application
    ```bash
    mvn spring-boot:run
    ```
* Thanks to the provided plugin configuration you can access your React app directly on http://localhost:8080/theeasteregg_web
