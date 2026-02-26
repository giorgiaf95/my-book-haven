import { Shield } from "lucide-react";
import { motion } from "framer-motion";

const Privacy = () => {
  return (
    <div className="container py-6 md:py-10 max-w-4xl space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" /> Privacy
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Ultimo aggiornamento: 26 febbraio 2026</p>
      </motion.div>

      <section className="rounded-2xl bg-card border border-border p-5 md:p-6 shadow-card space-y-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">Dati raccolti</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Raccogliamo informazioni di account, preferenze di lettura e dati tecnici minimi necessari al funzionamento della piattaforma.
          </p>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">Utilizzo dei dati</h2>
          <p className="text-sm text-muted-foreground mt-1">
            I dati vengono usati per mostrare il profilo, personalizzare l&apos;esperienza, migliorare i suggerimenti e garantire sicurezza del servizio.
          </p>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">Diritti utente</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Puoi richiedere modifica o cancellazione dei tuoi dati contattando il supporto: support@bixblion.app.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Privacy;

