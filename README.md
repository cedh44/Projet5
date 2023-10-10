# Application d'inscription à des sessions de Yoga

Cette application permet à des utilisateurs de s'inscrire à des sessions de Yoga.

## Pré-requis

Préalablement, il est nécessaire d'avoir sur le poste :
- Mysql
- Angular (14.1.0 ou supérieur)
- Java 8 et maven

## Récupérer les sources du projet

Depuis un terminal, placez vous dans un répertoire où déposer les sources et tapez : `git clone https://github.com/cedh44/Projet5.git`

## Installer la base de données

Se connecter en tant que root dans mysql, puis taper :
- `CREATE DATABASE yoga;`
- `CREATE USER 'yogauser'@'localhost' IDENTIFIED BY 'yogapass';`
- `GRANT ALL ON yoga.* to 'yogauser'@'localhost';`
- dans un terminal depuis le répertoire racine du Projet5/ressources/sql, taper : `mysql -u root -p yoga < script.sql`

## Installer l'application

### Front :
  - dans un terminal, depuis la racine du Projet5 : `cd front`
  - puis `npm install` pour installer les dépendances

### Back :
  - depuis un terminal, depuis la racine du Projet5 : `cd back`
  - puis `mvn compile` afin de valider que la compilation s'effectue correctement

## Lancer l'application

### Front :
  - dans un terminal, depuis le répertoire front : `npm run start`
  - l'application est disponible à l'url http://localhost:4200/

### Back :
  - dans un terminal, depuis le répertoire back : `mvn spring-boot:run`
  - l'application est disponible à l'url http://localhost:8080/ (en tant qu'API)

## Lancer les tests

### Front :
  - dans un terminal, depuis le répertoire front : `npm run test`

### End to end :
  - dans un terminal, depuis le répertoire front : `npm run e2e`
  - Cypress s'ouvre, il faut d'abord choisir un navigateur de test puis cliquer sur le fichier allTestsYoga.cy.ts pour lancer tous les tests

### Back :
  - dans un terminal, depuis le répertoire back : `mvn clean test`

## Générer les rapports de couverture.

### Front :
  - dans un terminal, depuis le répertoire front : `npm run test:coverage`
  - le rapport de couverture s'affiche dans le terminal
  - il est aussi présent dans front/coverage/jest/lcov-report/index.html

### End to end :
  - dans un terminal, depuis le répertoire front : `npm run e2e:coverage`
  - le rapport de couverture s'affiche dans le terminal
  - il est aussi présent dans front/coverage/lcov-report/index.html

### Back :
  - suite au lancement des tests, le rapport de couverture se trouve dans back/target/site/jacoco/index.html

## Technologies

- Angular
- Spring Boot
- Java 8
- Maven
- MySql
- Git

## Licence

Développé dans le cadre du projet 5 de la formation Développeur Full-Stack - Java et Angular (OpenClassrooms) : https://openclassrooms.com/fr/paths/533/projects/1304/assignment
