#!/bin/bash

# Script pour exécuter les tests Playwright individuellement
# Usage: bash tests/run-tests-individually.sh

echo "🚀 Exécution des tests de migration individuellement"
echo "================================================"

# Test 1: Persistance Journal
echo ""
echo "📝 Test 1/4: Persistance Journal après Refresh"
npx playwright test tests/migration.spec.ts -g "should persist journal progress after refresh"
TEST1=$?

# Test 2: Synchronisation Cross-Device
echo ""
echo "🔄 Test 2/4: Synchronisation Méditation Cross-Device"
npx playwright test tests/migration.spec.ts -g "should persist meditation progress across devices"
TEST2=$?

# Test 3: Déblocage Items
echo ""
echo "🔓 Test 3/4: Déblocage d'Items par Niveau"
npx playwright test tests/migration.spec.ts -g "should unlock items based on level"
TEST3=$?

# Test 4: Résilience LocalStorage
echo ""
echo "💾 Test 4/4: Résilience après Clear LocalStorage"
npx playwright test tests/migration.spec.ts -g "should not lose data on localStorage clear"
TEST4=$?

# Résumé
echo ""
echo "================================================"
echo "📊 RÉSUMÉ DES TESTS"
echo "================================================"

TOTAL=0
PASSED=0

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
echo "Résultat: $PASSED/4 tests réussis"
echo "================================================"

# Générer le rapport HTML
echo ""
echo "📄 Génération du rapport HTML..."
npx playwright show-report

exit 0
