# nba-state
Project for the company Qard

- Installer composer (https://getcomposer.org/). Lors de l'installation de composer, choisir une version de php >= 7.3
- Lancer en ligne de commande composer install dans le dossier Backend-Symfony afin de récupérer les différentes dépendances de développement nécessaires (make, doctrine, api...)
- Dupliquer le fichier .env et le nommer .env.local puis editer la constante _DATABASEURL avec nos valeurs de serveur (identifiant, port, nom de la base de donnée) 
- Lancer la commande php bin/console doctrine:database:create afin de créer la base de données
- Lancer la commande php bin/console doctrine:schema:update --force afin de récupérer la dernière version de la base de données
- Lancer la commande php -S 127.0.0.1:8000 -t public afin de lancer le serveur de développement.
