#!/bin/bash

# 🤖 Script d'exécution AUTONOME et FRACTIONNÉE des tests Playwright
# Lance les tests UN PAR UN avec rapport après chaque mission

set -e

echo "🤖 EXÉCUTION AUTONOME FRACTIONNÉE - TESTS PLAYWRIGHT"
echo "======================================================"
echo ""

# Vérifier que le serveur dev tourne
echo "🔍 Mission 0/4: Vérification du serveur..."
if ! curl -s http://localhost:5173 > /dev/null; then
  echo "⚠️  Serveur non démarré"
  echo "📝 Démarrage automatique..."
  npm run dev &
  SERVER_PID=$!
  sleep 5
  echo "✅ Serveur démarré (PID: $SERVER_PID)"
else
  echo "✅ Serveur déjà actif"
fi

# Installer Playwright si nécessaire
echo ""
echo "🔍 Vérification de Playwright..."
if ! npx playwright --version > /dev/null 2>&1; then
  echo "📦 Installation de Playwright..."
  npx playwright install chromium
  echo "✅ Playwright installé"
else
  echo "✅ Playwright prêt"
fi

# Attendre la disponibilité
echo ""
echo "⏳ Attente du serveur (max 30s)..."
max_attempts=30
attempt=0
while ! curl -s http://localhost:5173 > /dev/null; do
  attempt=$((attempt + 1))
  if [ $attempt -eq $max_attempts ]; then
    echo "❌ Timeout après 30s"
    exit 1
  fi
  sleep 1
  echo -n "."
done
echo ""
echo "✅ Serveur prêt à recevoir les tests"

# Array pour stocker les résultats
declare -a TEST_RESULTS=()
declare -a TEST_NAMES=(
  "Persistance Journal"
  "Synchronisation Cross-Device"
  "Déblocage Items par Niveau"
  "Résilience LocalStorage"
)
declare -a TEST_PATTERNS=(
  "should persist journal progress after refresh"
  "should persist meditation progress across devices"
  "should unlock items based on level"
  "should not lose data on localStorage clear"
)

# Fonction pour afficher un rapport de mission
report_mission() {
  local mission_num=$1
  local mission_name=$2
  local result=$3
  
  echo ""
  echo "======================================================"
  echo "📊 RAPPORT MISSION $mission_num/4: $mission_name"
  echo "======================================================"
  
  if [ $result -eq 0 ]; then
    echo "✅ SUCCÈS - Mission accomplie"
    echo "🎯 Test validé avec succès"
  else
    echo "❌ ÉCHEC - Mission non accomplie"
    echo "⚠️  Vérifier les logs ci-dessus"
    echo "💡 Astuce: Relancer avec --debug pour plus d'infos"
  fi
  
  echo "======================================================"
  echo ""
  
  # Pause de 2 secondes entre chaque mission
  echo "⏸️  Pause avant la prochaine mission (2s)..."
  sleep 2
}

# Exécuter les tests UN PAR UN
echo ""
echo "🚀 LANCEMENT DES MISSIONS FRACTIONNÉES"
echo "======================================================"

for i in "${!TEST_PATTERNS[@]}"; do
  mission_num=$((i + 1))
  mission_name="${TEST_NAMES[$i]}"
  test_pattern="${TEST_PATTERNS[$i]}"
  
  echo ""
  echo "🎯 MISSION $mission_num/4: $mission_name"
  echo "------------------------------------------------------"
  echo "📝 Pattern: '$test_pattern'"
  echo "⏱️  Démarrage: $(date '+%H:%M:%S')"
  echo ""
  
  # Exécuter le test
  if npx playwright test tests/migration.spec.ts -g "$test_pattern" --reporter=list; then
    TEST_RESULTS+=("PASS")
    report_mission $mission_num "$mission_name" 0
  else
    TEST_RESULTS+=("FAIL")
    report_mission $mission_num "$mission_name" 1
  fi
done

# Rapport final consolidé
echo ""
echo "======================================================"
echo "📊 RAPPORT FINAL CONSOLIDÉ"
echo "======================================================"
echo ""

PASSED=0
TOTAL=4

for i in "${!TEST_RESULTS[@]}"; do
  mission_num=$((i + 1))
  result="${TEST_RESULTS[$i]}"
  name="${TEST_NAMES[$i]}"
  
  if [ "$result" = "PASS" ]; then
    echo "✅ Mission $mission_num: PASS - $name"
    PASSED=$((PASSED + 1))
  else
    echo "❌ Mission $mission_num: FAIL - $name"
  fi
done

echo ""
echo "======================================================"
echo "🎯 Score Global: $PASSED/$TOTAL missions réussies"

if [ $PASSED -eq $TOTAL ]; then
  echo "🎉 SUCCÈS TOTAL! Toutes les missions accomplies"
  echo "✅ Migration validée - Prêt pour Phase 4"
elif [ $PASSED -ge 3 ]; then
  echo "⚠️  Presque parfait - 1 mission à revoir"
  echo "💡 Vérifier les logs de la mission échouée"
elif [ $PASSED -ge 2 ]; then
  echo "⚠️  Succès partiel - $((TOTAL - PASSED)) missions échouées"
  echo "📝 Nécessite des ajustements"
else
  echo "❌ Échec global - $((TOTAL - PASSED)) missions échouées"
  echo "🔧 Révision complète nécessaire"
fi

echo "======================================================"

# Générer le rapport HTML
echo ""
echo "📄 Génération du rapport HTML détaillé..."
npx playwright show-report &
REPORT_PID=$!

echo ""
echo "✅ Rapport HTML disponible (ouverture automatique)"
echo "📊 Consultez les détails, screenshots et traces"

# Nettoyer si on a démarré le serveur
if [ ! -z "$SERVER_PID" ]; then
  echo ""
  echo "🧹 Nettoyage: arrêt du serveur (PID: $SERVER_PID)"
  kill $SERVER_PID 2>/dev/null || true
fi

echo ""
echo "🏁 Exécution fractionnée terminée"
echo "⏱️  Fin: $(date '+%H:%M:%S')"

exit 0
