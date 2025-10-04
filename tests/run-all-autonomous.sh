#!/bin/bash

# 🤖 Script d'exécution autonome des tests Playwright
# Ce script fait TOUT automatiquement sans intervention

set -e  # Arrêter en cas d'erreur

echo "🤖 EXÉCUTION AUTONOME DES TESTS PLAYWRIGHT"
echo "=========================================="
echo ""

# Vérifier que le serveur dev tourne
echo "🔍 Vérification du serveur de développement..."
if ! curl -s http://localhost:5173 > /dev/null; then
  echo "⚠️  Le serveur dev n'est pas démarré"
  echo "📝 Démarrage automatique du serveur..."
  npm run dev &
  SERVER_PID=$!
  sleep 5
  echo "✅ Serveur démarré (PID: $SERVER_PID)"
else
  echo "✅ Serveur déjà en cours d'exécution"
fi

# Installer Playwright si nécessaire
echo ""
echo "🔍 Vérification de Playwright..."
if ! npx playwright --version > /dev/null 2>&1; then
  echo "📦 Installation de Playwright..."
  npx playwright install chromium
  echo "✅ Playwright installé"
else
  echo "✅ Playwright déjà installé"
fi

# Attendre que le serveur soit prêt
echo ""
echo "⏳ Attente de la disponibilité du serveur..."
max_attempts=30
attempt=0
while ! curl -s http://localhost:5173 > /dev/null; do
  attempt=$((attempt + 1))
  if [ $attempt -eq $max_attempts ]; then
    echo "❌ Le serveur n'a pas démarré après 30 secondes"
    exit 1
  fi
  sleep 1
  echo -n "."
done
echo ""
echo "✅ Serveur prêt"

# Exécuter les tests un par un
echo ""
echo "🧪 LANCEMENT DES TESTS"
echo "=========================================="

# Test 1
echo ""
echo "📝 Test 1/4: Persistance Journal"
npx playwright test tests/migration.spec.ts -g "should persist journal progress after refresh" --reporter=list
TEST1=$?

# Test 2
echo ""
echo "🔄 Test 2/4: Synchronisation Cross-Device"
npx playwright test tests/migration.spec.ts -g "should persist meditation progress across devices" --reporter=list
TEST2=$?

# Test 3
echo ""
echo "🔓 Test 3/4: Déblocage Items"
npx playwright test tests/migration.spec.ts -g "should unlock items based on level" --reporter=list
TEST3=$?

# Test 4
echo ""
echo "💾 Test 4/4: Résilience LocalStorage"
npx playwright test tests/migration.spec.ts -g "should not lose data on localStorage clear" --reporter=list
TEST4=$?

# Résumé
echo ""
echo "=========================================="
echo "📊 RÉSUMÉ DES TESTS"
echo "=========================================="

PASSED=0
TOTAL=4

if [ $TEST1 -eq 0 ]; then
  echo "✅ Test 1: PASS - Persistance Journal"
  PASSED=$((PASSED + 1))
else
  echo "❌ Test 1: FAIL - Persistance Journal"
fi

if [ $TEST2 -eq 0 ]; then
  echo "✅ Test 2: PASS - Synchronisation Cross-Device"
  PASSED=$((PASSED + 1))
else
  echo "❌ Test 2: FAIL - Synchronisation Cross-Device"
fi

if [ $TEST3 -eq 0 ]; then
  echo "✅ Test 3: PASS - Déblocage Items"
  PASSED=$((PASSED + 1))
else
  echo "❌ Test 3: FAIL - Déblocage Items"
fi

if [ $TEST4 -eq 0 ]; then
  echo "✅ Test 4: PASS - Résilience LocalStorage"
  PASSED=$((PASSED + 1))
else
  echo "❌ Test 4: FAIL - Résilience LocalStorage"
fi

echo ""
echo "Résultat final: $PASSED/$TOTAL tests réussis"

# Générer le rapport HTML
echo ""
echo "📄 Génération du rapport HTML..."
npx playwright show-report &
REPORT_PID=$!

echo ""
echo "=========================================="
if [ $PASSED -eq $TOTAL ]; then
  echo "🎉 SUCCÈS TOTAL! Tous les tests sont passés"
  echo "✅ Migration validée avec succès"
  echo "✅ Prêt pour la Phase 4 (Analytics)"
else
  echo "⚠️  $((TOTAL - PASSED)) test(s) ont échoué"
  echo "📝 Consultez le rapport HTML pour plus de détails"
fi
echo "=========================================="

# Nettoyer si on a démarré le serveur
if [ ! -z "$SERVER_PID" ]; then
  echo ""
  echo "🧹 Nettoyage: arrêt du serveur (PID: $SERVER_PID)"
  kill $SERVER_PID 2>/dev/null || true
fi

exit 0
