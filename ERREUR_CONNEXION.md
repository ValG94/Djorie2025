# ❌ Erreur "Invalid login credentials"

## Diagnostic

L'erreur se produit parce que **l'utilisateur n'a pas encore été créé dans Supabase Auth**.

✅ L'entrée existe dans la table `users` (base de données)
❌ L'utilisateur n'existe PAS dans Supabase Auth (système d'authentification)

## Solution : Créer l'utilisateur dans Supabase Auth

### Étape par étape :

1. **Ouvrez le Dashboard Supabase**
   - Allez sur : https://supabase.com/dashboard/project/hgxcixjkfrothzbrejkt
   - Connectez-vous si nécessaire

2. **Accédez à Authentication**
   - Dans le menu de gauche, cliquez sur `Authentication`
   - Cliquez sur l'onglet `Users`

3. **Vérifiez si l'utilisateur existe**
   - Cherchez `blankcontact1@gmail.com` dans la liste
   - Si l'utilisateur n'apparaît PAS, continuez à l'étape 4
   - Si l'utilisateur existe déjà, passez à la section "Réinitialiser le mot de passe"

4. **Créez l'utilisateur**
   - Cliquez sur le bouton vert `Add user` (en haut à droite)
   - Sélectionnez `Create new user`

5. **Remplissez le formulaire**
   ```
   Email: blankcontact1@gmail.com
   Password: Test1234*
   ```

6. **IMPORTANT : Confirmez automatiquement l'email**
   - ✅ **Cochez la case `Auto Confirm User`**
   - Sans cette case, l'utilisateur devra confirmer son email avant de pouvoir se connecter

7. **Cliquez sur `Create user`**

8. **Testez la connexion**
   - Allez sur votre site : `/admin/login`
   - Email : `blankcontact1@gmail.com`
   - Mot de passe : `Test1234*`
   - Cliquez sur `Se connecter`

## Alternative : Réinitialiser le mot de passe

Si l'utilisateur existe déjà mais le mot de passe ne fonctionne pas :

1. Dans `Authentication` > `Users`
2. Trouvez l'utilisateur `blankcontact1@gmail.com`
3. Cliquez sur les `...` à droite
4. Sélectionnez `Reset Password`
5. Définissez le nouveau mot de passe : `Test1234*`
6. Cliquez sur `Update user`

## Pourquoi cette étape est nécessaire ?

Supabase utilise deux systèmes distincts :

1. **Supabase Auth** (pour l'authentification)
   - Gère les connexions, mots de passe, sessions
   - Les utilisateurs doivent être créés ici en premier

2. **Table `users`** (pour les données utilisateur)
   - Stocke les informations supplémentaires (nom, rôle, etc.)
   - ✅ Déjà créée automatiquement

Pour des raisons de sécurité, la création d'utilisateurs Auth nécessite :
- Soit l'interface web Supabase (recommandé)
- Soit une clé de service (service_role key) qui ne doit jamais être exposée

## Après la connexion

Une fois connecté, vous pourrez :
- Accéder au tableau de bord admin
- Gérer le contenu de la plateforme
- Voir les statistiques

## Amélioration ajoutée

✅ Le bouton "œil" a été ajouté au champ mot de passe pour afficher/masquer le mot de passe

---

**Besoin d'aide ?** Si le problème persiste après avoir créé l'utilisateur Auth, vérifiez :
- Que le mot de passe contient exactement : `Test1234*`
- Que l'email est bien : `blankcontact1@gmail.com` (sans espace)
- Que la case "Auto Confirm User" était cochée lors de la création
