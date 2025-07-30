# The Easter Egg Web

### Requisitos
Software y herramientas necesarias para ejecutar este proyecto:
* Java 11 (_versión testeada_)
* Node v14.17.3 (_versión testeada_)
* Maven


### Creación del proyecto
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


### Despliegue local
**Puerto 3000 (Desarrollo frontend)**
* Instalar el proyecto Maven
    ```bash
    mvn clean install
    ```
* Iniciar la aplicación
  ```bash
  cd /frontend
  npm start
  ```
  
* Se puede acceder a la web a través de http://localhost:3000/theeasteregg_web y actualizar el frontend en caliente

**Puerto 8080 (Desarrollo backend)**

* Instalar el proyecto Maven
    ```bash
    mvn clean install
    ```
* Iniciar la aplicación
    ```bash
    mvn spring-boot:run
    ```
* Se puede acceder a la web a través de http://localhost:8080/theeasteregg_web pero no actualizar en caliente


### Despliegue en Raspberry
* Ajustamos la variable **REACT_APP_ELASTICSEARCH_URL** en **/frontend/.env** con la ruta del servidor

* Entramos en la carpeta /frontend y generamos el frontend
  ```bash
  cd frontend
  npm run build
  ```

* Borramos los recursos estáticos viejos y copiamos los generados
  ```bash
  # Borrar el contenido de src/main/resources/static/
  rm -rf src/main/resources/static/*
  
  # Copiar el contenido de frontend/build/ a src/main/resources/static/
  cp -r frontend/build/* src/main/resources/static/
  ```

* Generamos el JAR
  ```bash
  mvn clean package -DskipTests
  ```

#### Pasamos el JAR generado en /target a la Raspberry Pi

* En la Raspberry Pi ejecutamos:
  ```bash
  java -jar x.jar --server.port=8000 --server.address=0.0.0.0
  ```
