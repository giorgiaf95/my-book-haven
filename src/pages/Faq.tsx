import { HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  {
    q: "Come aggiungo un libro alla libreria?",
    a: "Apri la scheda del libro e clicca su 'Aggiungi alla libreria'. Dal popup puoi scegliere stato lettura, valutazione, tag e liste.",
  },
  {
    q: "Posso creare gruppi community?",
    a: "Sì, dalla sezione Community usa il pulsante 'Crea gruppo' e compila i campi richiesti.",
  },
  {
    q: "Come cambio nome profilo?",
    a: "Vai in Impostazioni > Profilo, modifica Nome e salva. Il cambiamento viene confermato con un messaggio.",
  },
  {
    q: "Come contatto il supporto?",
    a: "Scrivi a support@bixblion.app.",
  },
];

const Faq = () => {
  return (
    <div className="container py-6 md:py-10 max-w-4xl space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" /> FAQ
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Domande frequenti su Bixblion</p>
      </motion.div>

      <section className="rounded-2xl bg-card border border-border p-5 md:p-6 shadow-card space-y-3">
        {items.map((item) => (
          <article key={item.q} className="rounded-xl bg-background border border-border p-4">
            <h2 className="text-sm font-semibold text-foreground">{item.q}</h2>
            <p className="text-sm text-muted-foreground mt-1">{item.a}</p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Faq;

