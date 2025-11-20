# 🔍 Débogage de l'authentification admin

## Problème : "Invalid login credentials"

Si vous obtenez cette erreur après avoir créé l'utilisateur dans Supabase Auth, suivez ces étapes de vérification :

## ✅ Checklist de vérification

### 1. Vérifier que l'utilisateur existe dans Supabase Auth

1. Allez sur : https://supabase.com/dashboard/project/hgxcixjkfrothzbrejkt
2. Cliquez sur `Authentication` > `Users`
3. **Recherchez l'email** : `blankcontact1@gmail.com`

**Si l'utilisateur n'apparaît PAS :**
- L'utilisateur n'a pas été créé → Créez-le maintenant (voir ERREUR_CONNEXION.md)

**Si l'utilisateur apparaît :**
- Passez à l'étape 2

### 2. Vérifier le statut de confirmation de l'email

Dans la liste des utilisateurs, regardez la colonne du statut :

- ✅ **L'email doit être confirmé** (icône verte ou "Confirmed")
- ❌ **Si "Unconfirmed"** → L'utilisateur ne peut pas se connecter

**Pour confirmer l'email manuellement :**
1. Cliquez sur l'utilisateur `blankcontact1@gmail.com`
2. Dans le panneau de droite, cherchez `Email Confirmed`
3. Si c'est `false`, cliquez sur les `...` à droite de l'utilisateur
4. Sélectionnez `Confirm email`

**Alternative - Supprimer et recréer avec Auto Confirm :**
1. Cliquez sur les `...` à droite de l'utilisateur
2. Sélectionnez `Delete user`
3. Confirmez la suppression
4. Recréez l'utilisateur avec **Auto Confirm User coché**

### 3. Vérifier le mot de passe

Le mot de passe DOIT être exactement : `Test1234*`

**Caractéristiques importantes :**
- `T` majuscule au début
- `1234` ensuite
- `*` à la fin
- Total : 9 caractères
- Pas d'espace avant ou après

**Pour réinitialiser le mot de passe :**
1. Dans `Authentication` > `Users`
2. Cliquez sur les `...` à droite de l'utilisateur
3. Sélectionnez `Reset Password`
4. Entrez : `Test1234*`
5. Cliquez sur `Update user`

### 4. Vérifier l'email

L'email DOIT être exactement : `blankcontact1@gmail.com`

**Vérifiez :**
- Pas d'espace avant ou après
- Tout en minuscules
- Le chiffre `1` (et non la lettre `l`)

### 5. Vérifier les paramètres d'authentification Supabase

1. Allez dans `Authentication` > `Settings`
2. Vérifiez que `Enable email confirmations` n'est PAS activé
   - Si activé, l'utilisateur doit confirmer son email avant de se connecter
   - Recommandation : Désactivez-le pour l'environnement de développement

### 6. Test avec la console du navigateur

1. Ouvrez votre site et allez sur `/admin/login`
2. Ouvrez la console du navigateur (F12)
3. Essayez de vous connecter
4. Regardez les messages dans la console :
   - `Tentative de connexion avec: blankcontact1@gmail.com`
   - Les détails de l'erreur

### 7. Vérifier que l'utilisateur existe dans la table users

Depuis le SQL Editor de Supabase :

```sql
SELECT * FROM users WHERE email = 'blankcontact1@gmail.com';
```

Vous devriez voir :
- ✅ email: `blankcontact1@gmail.com`
- ✅ role: `admin`
- ✅ name: `Administrateur Principal`

Si l'utilisateur n'existe PAS dans la table users :

```sql
INSERT INTO users (email, name, role)
VALUES ('blankcontact1@gmail.com', 'Administrateur Principal', 'admin')
ON CONFLICT (email) DO UPDATE
SET role = 'admin', name = 'Administrateur Principal';
```

## Solution recommandée - Recommencer de zéro

Si rien ne fonctionne, recommencez complètement :

### Étape 1 : Nettoyer

1. **Supabase Auth** :
   - Allez dans `Authentication` > `Users`
   - Supprimez l'utilisateur `blankcontact1@gmail.com` s'il existe

2. **Table users** (SQL Editor) :
   ```sql
   DELETE FROM users WHERE email = 'blankcontact1@gmail.com';
   ```

### Étape 2 : Recréer proprement

1. **Créer dans Supabase Auth en premier** :
   - `Authentication` > `Users` > `Add user` > `Create new user`
   - Email : `blankcontact1@gmail.com`
   - Password : `Test1234*`
   - ✅ **Cochez `Auto Confirm User`**
   - Cliquez `Create user`

2. **Créer dans la table users** (SQL Editor) :
   ```sql
   INSERT INTO users (email, name, role)
   VALUES ('blankcontact1@gmail.com', 'Administrateur Principal', 'admin');
   ```

3. **Testez immédiatement** :
   - Allez sur `/admin/login`
   - Email : `blankcontact1@gmail.com`
   - Password : `Test1234*`
   - Cliquez sur l'œil pour vérifier que vous tapez le bon mot de passe

## Points importants

1. **L'ordre est important** :
   - D'abord créer dans Supabase Auth
   - Ensuite créer dans la table users

2. **Auto Confirm User** :
   - DOIT être coché lors de la création
   - Sinon l'utilisateur ne peut pas se connecter

3. **Email confirmé** :
   - Vérifiez toujours que l'email est confirmé dans Supabase Auth

4. **Mot de passe** :
   - Utilisez l'œil pour voir ce que vous tapez
   - Le mot de passe est sensible à la casse

## Toujours une erreur ?

Si après toutes ces étapes vous avez toujours l'erreur, il peut y avoir un problème avec :
- Les clés Supabase dans le fichier `.env`
- La configuration RLS (Row Level Security)
- Les politiques de la table users

Dans ce cas, partagez le message d'erreur exact dans la console du navigateur.
