# Mon vieux grimoire

Code du projet 7 de la formation Open Classrooms

## Information pour lancer le code

-   Créer un fichier .env à la racine du backend avec "
    DATABASE_SRV_ADDRESS = `Une chaine de caractère avec l'adresse de votre base de données MongoDB, par exemple 'mongodb+srv://<LOGIN>:<MDP>@cluster0.kl09u4n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'`
    TOKEN = `Une chaine de caractère qui sera utilisée pour l'authentification, par exemple 'SECRET_TOKEN'`
    "
-   Lancer la commande "nodemon server" depuis la racine du backend

-   Lancer la commande "npm start" depuis la racine du frontend

## Notes

-   Les controllers pour les livres et leurs notations ont été séparées dans deux fichiers disctints "book" et "rating", mais proviennent du même router "book" car il partagent la même racine /routes/book sur l'API.
