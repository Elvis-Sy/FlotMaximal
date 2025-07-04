# 🧠 Algorithme de Calcul du Flot Maximal

Cette application implémente une version optimisée de **l'algorithme de Ford-Fulkerson** pour calculer le **flot maximal** entre un nœud source (`start`) et un puits (`end`) dans un graphe orienté.

---

## 🔁 Principe général

L'algorithme de Ford-Fulkerson consiste à :

1. Chercher un **chemin augmentant** (chemin de la source au puits avec de la capacité résiduelle).
2. Trouver la **capacité minimale résiduelle** sur ce chemin.
3. **Ajouter** ce flot à chaque arc du chemin (et le retirer en sens inverse).
4. Répéter jusqu’à ce qu’aucun chemin augmentant n’existe.

---

## 📌 Étapes de l’implémentation

### 1. Recherche de tous les chemins possibles

- Une **recherche en profondeur (DFS)** est utilisée pour lister tous les chemins valides entre `start` et `end`.
- Seuls les arcs non saturés sont pris en compte.

### 2. Sélection du "meilleur" chemin 

Parmi les chemins trouvés :

- On sélectionne ceux ayant la **plus petite capacité résiduelle**.
- Parmi eux, on garde le **plus court** (en nombre d’arêtes).

Cela permet d’éviter les chemins trop longs ou peu efficaces.

### 3. Application du flot

- Le flot est ajouté aux arcs directs.
- Si le chemin utilise un **arc en sens inverse**, un flux négatif est appliqué.

### 4. Mise à jour visuelle

- Chaque chemin est animé pendant le traitement.
- La couleur des arcs change selon leur statut :
  - 🔵 Bleu : arc partiellement utilisé
  - 🔴 Rouge : arc saturé
  - ⚪ Gris : arc inutilisé

---

## 📚 Références

- Algorithme de Ford-Fulkerson : https://fr.wikipedia.org/wiki/Algorithme_de_Ford-Fulkerson
- Edmonds-Karp (amélioration BFS) : https://en.wikipedia.org/wiki/Edmonds%E2%80%93Karp_algorithm
