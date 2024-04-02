## Lancer le projet :
docker-compose up --build

## Sujet :
**"Le frontend doit être développé en utilisant du Javascript natif (original sans
framework ni extensions). Toutefois, ce pré-requis peut être modifié par le Module
Frontend"**


## Securité :
**"Votre site web doit être protégé contre les injections SQL/XSS."**

"Éviter les attaques XSS (Cross-Site Scripting) consiste à s'assurer que le contenu que vous affichez dans votre application web ne peut pas être interprété comme du code exécutable, notamment du code JavaScript malveillant, injecté par un attaquant."

1) Génération de l'empreinte de hachage pour eviter les injections XSS grace au site ->
https://www.srihash.org/
"Dans le cas d’un site utilisant des ressources internes (fichiers CSS et JavaScript) pour son propre
usage, la mise en œuvre d’un mécanisme de vérification d’intégrité permet de contrôler la nonaltération des fichiers de ressources présents sur le serveur.
Il est fréquent que les ressources utilisées, CSS, fontes ou JavaScript, soient externes au site consulté et hébergées par des Content Delivery Networks (CDNs) afin d’améliorer la disponibilité du
site et d’économiser de la bande passante. Cette pratique présente cependant des risques car elle
étend la surface d’attaque jusqu’aux CDNs. En effet, par défaut une ressource corrompue ne sera
pas détectée et se diffusera sur tous les sites qui en font usage. L’utilisation d’un mécanisme de
vérification de l’intégrité des ressources issues d’un CDN, tel que Subresource Integrity (SRI, [12]),
permet de s’assurer que les fichiers de ressources actifs correspondent bien à ceux qui ont été audités et validés en phase d’intégration logicielle" 
src : https://cyber.gouv.fr/publications/securiser-un-site-web

2) Protection du formulaire :
Il y a une entrée de formulaire dans le HTML pour le systeme d'inscripton mais avant de valider des données côté client il faut utiliser JavaScript pour ensuite les soumettre au serveur. 

Test a rentrer dans le formulaire 
<script>alert('XSS');</script>

