#dossier tests, a ne pas prendre en compte dans le projet

Pour eviter les attaques XSS regarder le fichier xss_user.html

#Sujet
Éviter les attaques XSS (Cross-Site Scripting) consiste à s'assurer que le contenu que vous affichez dans votre application web ne peut pas être interprété comme du code exécutable, notamment du code JavaScript malveillant, injecté par un attaquant. 

##Ici il y a une entrée de formulaire ->
Avant de validater des données côté client : Utilisez JavaScript avant de les soumettre au serveur. 

###Test a rentrer dans le formulaire 
<script>alert('XSS');</script>
