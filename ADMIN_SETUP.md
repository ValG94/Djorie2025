# Configuration de l'Administrateur

## Création du compte administrateur

Pour créer votre compte administrateur, suivez ces étapes :

### Option 1 : Via l'interface Supabase (Recommandé)

1. **Connectez-vous à Supabase Dashboard** : https://supabase.com/dashboard

2. **Accédez à votre projet** : `hgxcixjkfrothzbrejkt`

3. **Créez l'utilisateur dans Authentication** :
   - Allez dans `Authentication` > `Users`
   - Cliquez sur `Add user` > `Create new user`
   - Email : `blankcontact1@gmail.com`
   - Password : `Test1234*`
   - Cochez `Auto Confirm User` pour confirmer l'email automatiquement
   - Cliquez sur `Create user`

4. **Ajoutez l'entrée dans la table users** :
   - Allez dans `Table Editor` > `users`
   - Cliquez sur `Insert` > `Insert row`
   - Remplissez :
     - `email` : `blankcontact1@gmail.com`
     - `name` : `Administrateur`
     - `role` : `admin`
   - Cliquez sur `Save`

5. **C'est fait !** Vous pouvez maintenant vous connecter sur `/admin/login`

### Option 2 : Via SQL (Alternative)

Si vous préférez utiliser SQL, exécutez ces commandes dans l'éditeur SQL de Supabase :

```sql
-- Note: La création d'utilisateur Auth doit se faire via l'interface ou l'API
-- Après avoir créé l'utilisateur Auth, exécutez cette requête :

INSERT INTO users (email, name, role)
VALUES ('blankcontact1@gmail.com', 'Administrateur', 'admin')
ON CONFLICT (email) DO NOTHING;
```

## Accès à l'interface d'administration

1. Allez sur votre site
2. Cliquez sur le lien "Administration" en bas de page (footer)
3. Ou accédez directement à `/admin/login`
4. Connectez-vous avec :
   - Email : `blankcontact1@gmail.com`
   - Mot de passe : `Test1234*`

## Sécurité

⚠️ **Important** :
- Changez le mot de passe après la première connexion
- Ne partagez jamais vos identifiants
- La clé de service Supabase ne doit jamais être exposée côté client

## Tableau de bord

Le tableau de bord administrateur vous permet de :
- Gérer les actualités et communiqués
- Modérer les messages citoyens
- Suivre les dons
- Gérer les abonnés newsletter
- Modifier le programme politique

Note : Les fonctionnalités CRUD complètes seront ajoutées dans les prochaines versions.
