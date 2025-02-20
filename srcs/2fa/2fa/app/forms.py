# Le modèle utilisateur utilisé : Dans le premier cas, vous avez utilisé un modèle utilisateur 
# personnalisé CustomUser, tandis que dans le deuxième cas, vous avez utilisé le modèle utilisateur 
# par défaut de Django User.
# Les fonctionnalités supplémentaires : Dans le premier cas, vous avez une personnalisation plus 
# fine des formulaires avec des fonctionnalités telles que la vérification de la correspondance
# des mots de passe, le hachage des mots de passe et l'exposition sélective des champs. Dans le 
# deuxième cas, vous avez utilisé le formulaire standard fourni par Django avec un champ 
# supplémentaire pour la 2FA.

# Importation des classes nécessaires depuis le module forms de Django
from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from .models import CustomUser

class CustomUserCreationForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['username', 'password1', 'password2'] #, 'enable_2fa']
    
    username = forms.CharField(
        label='Username',
        max_length=15,
        help_text="Required. 15 characters or fewer. Letters, digits and @/./+/-/_ only."
    )
    password1 = forms.CharField(
        label='Password',
        widget=forms.PasswordInput,
    )
    password2 = forms.CharField(
        label='Password confirmation',
        widget=forms.PasswordInput,
    )
    # enable_2fa = forms.BooleanField(
    #     label='Enable 2FA',
    #     required=False,
    #     help_text="Enable Two-Factor Authentication for added security."
    # )

    field_order = ['username', 'password1', 'password2']#, 'enable_2fa']

    def clean_password1(self):
        password1 = self.cleaned_data.get("password1")
        # Vérification de la longueur minimale du mot de passe
        if len(password1) < 8:
            raise forms.ValidationError("Password must be at least 8 characters long")
        # Vérification de la présence d'une lettre majuscule, d'un chiffre et d'un caractère spécial
        has_uppercase = any(char.isupper() for char in password1)
        has_digit = any(char.isdigit() for char in password1)
        has_special = any(char in "!@#$%^&*()-_=+[]{};:'\"|\\<>,./?" for char in password1)
        if not (has_uppercase and has_digit and has_special):
            raise forms.ValidationError("Password must contain at least one uppercase letter, one digit, and one special character.")
        return password1

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords do not match")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user

#fonctionnalités permettant aux utilisateurs existants de modifier leurs 
# informations (telles que la modification du nom d'utilisateur ou la gestion 
# de l'authentification à deux facteurs)
# class CustomUserChangeForm(forms.ModelForm):
#     password = ReadOnlyPasswordHashField()

#     class Meta:
#         model = CustomUser
#         fields = ['username', 'enable_2fa', 'password']

#     def clean_password(self):
#         # Retourne le mot de passe initial pour que le widget ReadOnlyPasswordHashField soit rendu correctement
#         return self.initial["password"]


# À l'intérieur du constructeur, nous appelons d'abord le constructeur de la 
# classe parente pour nous assurer que toutes les fonctionnalités de base du 
# formulaire sont initialisées correctement. Ensuite, nous ajoutons un champ 
# au formulaire en utilisant self.fields['nom_du_champ'] = .... Dans ce cas, 
# nous ajoutons un champ de type CharField avec le label 'Verification Code' 
# et une longueur maximale de 6 caractères.
# class Enable2FAForm(forms.Form):
#     def __init__(self, user, *args, **kwargs):
#         # Initialisation du formulaire avec l'utilisateur en cours
#         super(Enable2FAForm, self).__init__(*args, **kwargs)
        
#         # Ajout du champ de vérification du code
#         self.fields['verification_code'] = forms.CharField(label='Verification Code', max_length=6)

