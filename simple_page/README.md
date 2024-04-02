## Lancer le projet :
docker-compose up --build

## Sujet :
**"Le frontend doit être développé en utilisant du Javascript natif (original sans
framework ni extensions). Toutefois, ce pré-requis peut être modifié par le Module
Frontend"**


## Cybersecurité :
### **"Votre site web doit être protégé contre les injections SQL/XSS."**

"Éviter les attaques XSS (Cross-Site Scripting) consiste à s'assurer que le contenu que vous affichez dans votre application web ne peut pas être interprété comme du code exécutable, notamment du code JavaScript malveillant, injecté par un attaquant."

1) Specification d'un Content-Type :
"Spécifier un Content-Type approprié contribue à réduire le risque qu’une ressource
soit interprétée de manière inattendue et exploitée par un attaquant."
source : https://cyber.gouv.fr/publications/securiser-un-site-web
Lorsqu'on spécifie un Content-Type approprié on indique explicitement au navigateur comment interpréter le contenu de la réponse. Par exemple dans le fichier server.js on définit un Content-Type: text/html ce qui réduit le risque d'interprétation inattendue ou d'exploitation par des attaquants.

2) Protection des formulaires :
Il y a une entrée de formulaire dans le HTML pour le systeme d'inscripton mais avant de valider des données côté client il faut utiliser un script JavaScript pour verifier les données saisies -> puis les soumettre au serveur.

Test a entrer dans le formulaire 
```<script>alert('XSS');</script>```

3) Contrôle de l'intégrité des contenus tiers :
SRI (Subresource Integrity) est une fonctionnalité de sécurité qui permet de garantir l'intégrité des ressources chargées à partir de sources tierces. Cela permet de protéger votre site contre les attaques de type "subresource injection", où un attaquant pourrait modifier une ressource externe pour exécuter du code malveillant sur votre site.
Ici pour le lien Google font dans le CSS : ```<link rel="stylesheet" href="style.css" integrity="hdUUw/jGEFoxsMHxQkzVy7NG5d8MQ7mLd2udXPczZ8U=" crossorigin="anonymous"><!--lien fichier css-->```



