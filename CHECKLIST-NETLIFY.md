# ✅ Checklist - Vérification Netlify

Utilisez cette checklist pour vous assurer que tout est bien configuré.

## 📦 Code (Déjà Fait ✅)

- [x] Fonction `netlify/functions/send-order.ts` créée
- [x] Formulaire `src/components/CheckoutForm.tsx` configuré
- [x] Configuration `netlify.toml` optimisée
- [x] Dépendances installées (`nodemailer`, `@netlify/functions`)

## 🔧 Configuration Netlify (À Faire)

### 1. Gmail

- [ ] Validation en deux étapes activée sur Gmail
- [ ] Mot de passe d'application créé (16 caractères)
- [ ] Mot de passe d'application copié et sauvegardé en lieu sûr

### 2. Variables d'Environnement Netlify

- [ ] Variable `EMAIL_USER` ajoutée = `yacinemed2020@gmail.com`
- [ ] Variable `EMAIL_PASS` ajoutée = `[mot de passe d'application]`
- [ ] Les deux variables sont marquées "Contains secret values"

### 3. Déploiement

- [ ] Site redéployé après l'ajout des variables
- [ ] Déploiement réussi (statut "Published")
- [ ] Fonction `send-order` visible dans Netlify > Functions

### 4. Test

- [ ] Test de commande effectué sur le site
- [ ] Message de confirmation affiché au client
- [ ] Email reçu à `yacinemed2020@gmail.com`
- [ ] Commande visible dans Netlify > Forms

## 📊 Vérifications Techniques

### Netlify Dashboard

- [ ] **Functions** : `send-order` apparaît dans la liste
- [ ] **Forms** : Les soumissions apparaissent après test
- [ ] **Environment variables** : 2 variables configurées

### Logs (si problème)

1. Allez dans Netlify > Functions > send-order > Logs
2. Faites une commande de test
3. Vérifiez les logs pour des erreurs

## 🎯 Résultat Attendu

Quand tout fonctionne :

✅ Le client voit : "تم تأكيد الطلب!" (Commande confirmée)
✅ Vous recevez un email avec tous les détails
✅ La commande apparaît dans Netlify Forms
✅ Aucune erreur dans les logs

## 🆘 En Cas de Problème

1. **Consultez** : `GUIDE-NETLIFY-COMPLET.md` (guide détaillé)
2. **Vérifiez** : Les logs Netlify Functions
3. **Vérifiez** : Que les variables d'environnement sont bien configurées
4. **Redéployez** : Le site après chaque modification de variables

---

**Date de vérification** : _____________

**Statut** : ⬜ En attente | ⬜ En cours | ⬜ Terminé ✅

