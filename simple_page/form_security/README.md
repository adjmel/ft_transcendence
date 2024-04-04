*dossier tests*

Pour eviter les attaques XSS utiliser le script present dans le fichier xss_user.html

# Sujet
Éviter les attaques XSS (Cross-Site Scripting) consiste à s'assurer que le contenu que vous affichez dans votre application web ne peut pas être interprété comme du code exécutable, notamment du code JavaScript malveillant, injecté par un attaquant. 

Ici il y a une entrée de formulaire

### Test a entrer dans le formulaire 
<script>alert('XSS');</script>
