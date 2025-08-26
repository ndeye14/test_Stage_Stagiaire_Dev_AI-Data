import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AnomalyDetectorService {
  detect(data: any[]) {
    const anomalies: { index: number; reason: string }[] = [];
    const seen = new Set<string>(); // Pour la détection des doublons

    data.forEach((row, i) => {
      // Vérification du prix
      if (parseFloat(row.price) < 0) {
        anomalies.push({ index: i, reason: 'Prix négatif' });
      }
      // Vérification de la quantité
      if (parseInt(row.quantity) > 1000) {
        anomalies.push({ index: i, reason: 'Quantité aberrante' });
      }
      // Vérification de l'email
      // if (row.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(row.email)) {
      //   anomalies.push({ index: i, reason: 'Email invalide' });
      // }
      if (row.email) {
        // Détection des espaces parasites
        if (row.email.trim() !== row.email) {
          anomalies.push({ index: i, reason: 'Espaces parasites (email)' });
        }
        // Validation de l'email
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(row.email.trim())) {
          anomalies.push({ index: i, reason: 'Email invalide' });
        }
      }
      if (row.name && row.name !== row.name.trim()) {
        anomalies.push({ index: i, reason: 'Espaces parasites (nom)' });
      }
      // Vérification de la date
      if (row.date && isNaN(Date.parse(row.date))) {
        anomalies.push({ index: i, reason: 'Date invalide' });
      }
      // Détection des doublons
      // Utiliser une clé unique pour identifier chaque ligne
      // Si la clé est déjà présente dans le set, c'est un doublon
      const rowId = row.order_id || JSON.stringify(row);
      if (seen.has(rowId)) {
        // Si c'est un doublon, ajouter une anomalie
        anomalies.push({ index: i, reason: 'Donnée dupliquée' });
      } else {
        // Sinon, ajouter la clé au set pour ne pas la détecter à nouveau
        seen.add(rowId);
      }





    });

    return anomalies;
  }
}
