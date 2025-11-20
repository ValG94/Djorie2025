# ✅ Configuration Compte Administrateur

## État actuel

✅ **L'entrée dans la table `users` a été créée avec succès**
- Email: `blankcontact1@gmail.com`
- Rôle: `admin`
- Nom: `Administrateur Principal`

## Étape finale : Créer l'utilisateur dans Supabase Auth

Il reste une dernière étape à faire manuellement via l'interface Supabase :

### Instructions pas à pas :

1. **Allez sur le Dashboard Supabase**
   - URL : https://supabase.com/dashboard/project/hgxcixjkfrothzbrejkt

2. **Créez l'utilisateur Auth**
   - Dans le menu de gauche, cliquez sur `Authentication`
   - Cliquez sur l'onglet `Users`
   - Cliquez sur le bouton `Add user` (en haut à droite)
   - Sélectionnez `Create new user`

3. **Remplissez les informations**
   ```
   Email: blankcontact1@gmail.com
   Password: Test1234*
   ```

4. **Important : Confirmez l'email automatiquement**
   - ✅ Cochez la case `Auto Confirm User`
   - Cela permet de se connecter immédiatement sans confirmation par email

5. **Cliquez sur `Create user`**

## Connexion à l'interface admin

Une fois l'utilisateur Auth créé, vous pourrez vous connecter :

1. **Accédez à la page de connexion**
   - Sur votre site, cliquez sur "Administration" dans le footer
   - Ou allez directement sur : `votre-site.com/admin/login`

2. **Identifiants de connexion**
   ```
   Email: blankcontact1@gmail.com
   Mot de passe: Test1234*
   ```

3. **Vous serez redirigé vers le tableau de bord** à `/admin/dashboard`

## Pourquoi cette étape manuelle ?

Supabase Auth nécessite soit :
- L'interface web (recommandé pour la première création)
- Une clé de service (service_role key) qui ne doit jamais être exposée côté client

Pour des raisons de sécurité, la création du premier admin se fait via l'interface Supabase.

## Que faire après ?

✅ Changez votre mot de passe après la première connexion
✅ Vous pourrez ensuite gérer le contenu de la plateforme
✅ Le lien "Administration" dans le footer permet un accès rapide

---

**Note** : Si vous rencontrez des problèmes, vérifiez que :
- La case "Auto Confirm User" est bien cochée
- Le mot de passe contient au moins 8 caractères
- L'email correspond exactement à celui de la table `users`
