import type { Locale } from "@/lib/i18n/config";

export type Messages = {
  meta: { title: string; description: string };
  brand: string;
  guest: string;
  nav: {
    home: string;
    search: string;
    pocket: string;
    trades: string;
    profile: string;
  };
  menu: {
    settings: string;
    support: string;
    close: string;
  };
  common: {
    seeAll: string;
    back: string;
    unavailable: string;
    emptyCatalog: string;
    authRequired: string;
    authAction: string;
    distanceUnavailable: string;
    anywhere: string;
    loading: string;
    skip: string;
  };
  home: {
    title: string;
    subtitle: string;
    search: string;
    featured: string;
    discover: string;
    nearby: string;
    yours: string;
    cards: string;
  };
  search: {
    title: string;
    results: string;
    placeholder: string;
    game: string;
    number: string;
    numberPlaceholder: string;
    distance: string;
    apply: string;
    reset: string;
    sortRecent: string;
    sortName: string;
    empty: string;
    available: string;
    viewProfile: string;
    previous: string;
    next: string;
    kinds: { all: string; cards: string; stickers: string; collections: string };
  };
  card: {
    collectionState: string;
    owned: string;
    duplicates: string;
    publish: string;
    viewPocket: string;
    offers: string;
  };
  pocket: {
    title: string;
    collections: string;
    duplicates: string;
    missing: string;
    yours: string;
    available: string;
    empty: string;
  };
  collection: {
    progress: string;
    all: string;
    owned: string;
    missing: string;
    duplicates: string;
    stuck: string;
    checklist: string;
    grid: string;
    empty: string;
    legendOwned: string;
    legendMissing: string;
    legendDuplicate: string;
    legendStuck: string;
  };
  trade: {
    title: string;
    proposal: string;
    offer: string;
    request: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    sent: string;
    received: string;
    active: string;
    completed: string;
    cancelled: string;
    empty: string;
    missingListing: string;
  };
  profile: {
    title: string;
    publicTitle: string;
    catalog: string;
    reviews: string;
    info: string;
    follow: string;
    trades: string;
    distance: string;
    empty: string;
    noReviews: string;
    guestBody: string;
  };
  settings: {
    title: string;
    account: string;
    editProfile: string;
    notifications: string;
    privacy: string;
    collections: string;
    manage: string;
    import: string;
    app: string;
    appearance: string;
    language: string;
    appearanceBody: string;
    support: string;
    supportBody: string;
  };
};

const it: Messages = {
  meta: {
    title: "Switch Card",
    description: "Gestisci e scambia carte e figurine da collezione.",
  },
  brand: "Switch Card",
  guest: "Ospite",
  nav: {
    home: "Home",
    search: "Cerca",
    pocket: "Pocket",
    trades: "Scambi",
    profile: "Profilo",
  },
  menu: {
    settings: "Impostazioni",
    support: "Aiuto e supporto",
    close: "Chiudi menu",
  },
  common: {
    seeAll: "Vedi tutti",
    back: "Indietro",
    unavailable: "Il catalogo non è raggiungibile in questo momento.",
    emptyCatalog: "Nessuna collezione pubblicata.",
    authRequired:
      "Per salvare il Pocket e proporre scambi serve un account. L'accesso non è ancora attivo.",
    authAction: "Richiede un account",
    distanceUnavailable:
      "La distanza resta vuota finché non c'è una posizione consensita.",
    anywhere: "Ovunque",
    loading: "Caricamento",
    skip: "Vai al contenuto",
  },
  home: {
    title: "Le tue passioni meritano di essere condivise",
    subtitle: "Collezioni, scambio, completa. Tutto in un'unica app.",
    search: "Cerca una carta, una collezione...",
    featured: "In evidenza",
    discover: "Scopri",
    nearby: "Doppioni vicino a te",
    yours: "Le tue collezioni",
    cards: "carte",
  },
  search: {
    title: "Cerca",
    results: "Risultati",
    placeholder: "Cerca una carta, un giocatore, una collezione...",
    game: "Gioco / Collezione",
    number: "Numero carta",
    numberPlaceholder: "Es. 127",
    distance: "Distanza massima",
    apply: "Applica filtri",
    reset: "Reset",
    sortRecent: "Più recenti",
    sortName: "Nome",
    empty: "Nessun annuncio corrisponde ai filtri.",
    available: "Disponibile",
    viewProfile: "Vedi profilo",
    previous: "Precedenti",
    next: "Successivi",
    kinds: {
      all: "Tutte",
      cards: "Carte",
      stickers: "Figurine",
      collections: "Collezioni",
    },
  },
  card: {
    collectionState: "Stato nella tua collezione",
    owned: "Possedute",
    duplicates: "Doppioni",
    publish: "Pubblica per lo scambio",
    viewPocket: "Vedi nella tua collezione",
    offers: "Chi la offre",
  },
  pocket: {
    title: "Il mio Pocket",
    collections: "Collezioni",
    duplicates: "Doppioni",
    missing: "Mancanti",
    yours: "Le mie collezioni",
    available: "Doppioni disponibili",
    empty: "Il Pocket è vuoto. Le copie compaiono qui dopo l'accesso.",
  },
  collection: {
    progress: "Progresso",
    all: "Tutte",
    owned: "Possedute",
    missing: "Mancanti",
    duplicates: "Doppioni",
    stuck: "Incollate",
    checklist: "Checklist rapida",
    grid: "Griglia",
    empty: "Questa collezione non ha ancora carte pubblicate.",
    legendOwned: "Posseduta",
    legendMissing: "Mancante",
    legendDuplicate: "Doppione",
    legendStuck: "Incollata",
  },
  trade: {
    title: "I miei scambi",
    proposal: "Proposta di scambio",
    offer: "Tu offri",
    request: "Chiedi in cambio",
    message: "Messaggio (opzionale)",
    messagePlaceholder: "Ciao! Ti va di fare questo scambio?",
    send: "Invia proposta",
    sent: "Proposte inviate",
    received: "Proposte ricevute",
    active: "In corso",
    completed: "Completati",
    cancelled: "Annullati",
    empty: "Nessuno scambio.",
    missingListing: "Scegli un annuncio reale per preparare una proposta.",
  },
  profile: {
    title: "Profilo",
    publicTitle: "Profilo pubblico",
    catalog: "Catalogo",
    reviews: "Recensioni",
    info: "Informazioni",
    follow: "Segui",
    trades: "Scambi",
    distance: "Distanza",
    empty: "Nessun doppione pubblicato.",
    noReviews: "Nessuna recensione.",
    guestBody: "Il profilo personale si apre con l'account. I profili pubblici restano consultabili.",
  },
  settings: {
    title: "Impostazioni",
    account: "Account",
    editProfile: "Modifica profilo",
    notifications: "Notifiche",
    privacy: "Privacy",
    collections: "Collezioni",
    manage: "Gestisci collezioni",
    import: "Importa da file",
    app: "App",
    appearance: "Aspetto",
    language: "Lingua",
    appearanceBody: "L'interfaccia segue il layout mobile scuro della home e le schede chiare interne.",
    support: "Aiuto e supporto",
    supportBody: "Per il catalogo ufficiale usa un import autorizzato. Switch Card non inventa checklist.",
  },
};

const en: Messages = {
  meta: {
    title: "Switch Card",
    description: "Manage and trade physical collectible cards and stickers.",
  },
  brand: "Switch Card",
  guest: "Guest",
  nav: {
    home: "Home",
    search: "Search",
    pocket: "Pocket",
    trades: "Trades",
    profile: "Profile",
  },
  menu: {
    settings: "Settings",
    support: "Help and support",
    close: "Close menu",
  },
  common: {
    seeAll: "See all",
    back: "Back",
    unavailable: "The catalog is unreachable right now.",
    emptyCatalog: "No published collection yet.",
    authRequired:
      "Saving a Pocket and proposing trades needs an account. Sign-in is not available yet.",
    authAction: "Account required",
    distanceUnavailable:
      "Distance stays empty until a consented location exists.",
    anywhere: "Anywhere",
    loading: "Loading",
    skip: "Skip to content",
  },
  home: {
    title: "Your passions deserve to be shared",
    subtitle: "Collections, trades, completion. All in one app.",
    search: "Search a card, a collection...",
    featured: "Featured",
    discover: "Discover",
    nearby: "Duplicates near you",
    yours: "Your collections",
    cards: "cards",
  },
  search: {
    title: "Search",
    results: "Results",
    placeholder: "Search a card, a player, a collection...",
    game: "Game / Collection",
    number: "Card number",
    numberPlaceholder: "E.g. 127",
    distance: "Maximum distance",
    apply: "Apply filters",
    reset: "Reset",
    sortRecent: "Newest",
    sortName: "Name",
    empty: "No listing matches these filters.",
    available: "Available",
    viewProfile: "View profile",
    previous: "Previous",
    next: "Next",
    kinds: {
      all: "All",
      cards: "Cards",
      stickers: "Stickers",
      collections: "Collections",
    },
  },
  card: {
    collectionState: "Status in your collection",
    owned: "Owned",
    duplicates: "Duplicates",
    publish: "Publish for trade",
    viewPocket: "View in your collection",
    offers: "Offered by",
  },
  pocket: {
    title: "My Pocket",
    collections: "Collections",
    duplicates: "Duplicates",
    missing: "Missing",
    yours: "My collections",
    available: "Available duplicates",
    empty: "The Pocket is empty. Copies appear here after sign-in.",
  },
  collection: {
    progress: "Progress",
    all: "All",
    owned: "Owned",
    missing: "Missing",
    duplicates: "Duplicates",
    stuck: "Stuck",
    checklist: "Quick checklist",
    grid: "Grid",
    empty: "This collection has no published cards yet.",
    legendOwned: "Owned",
    legendMissing: "Missing",
    legendDuplicate: "Duplicate",
    legendStuck: "Stuck",
  },
  trade: {
    title: "My trades",
    proposal: "Trade proposal",
    offer: "You offer",
    request: "You ask for",
    message: "Message (optional)",
    messagePlaceholder: "Hi! Want to make this trade?",
    send: "Send proposal",
    sent: "Sent proposals",
    received: "Received proposals",
    active: "In progress",
    completed: "Completed",
    cancelled: "Cancelled",
    empty: "No trades.",
    missingListing: "Choose a real listing to prepare a proposal.",
  },
  profile: {
    title: "Profile",
    publicTitle: "Public profile",
    catalog: "Catalog",
    reviews: "Reviews",
    info: "Information",
    follow: "Follow",
    trades: "Trades",
    distance: "Distance",
    empty: "No published duplicates.",
    noReviews: "No reviews.",
    guestBody: "Your personal profile opens with an account. Public profiles stay browsable.",
  },
  settings: {
    title: "Settings",
    account: "Account",
    editProfile: "Edit profile",
    notifications: "Notifications",
    privacy: "Privacy",
    collections: "Collections",
    manage: "Manage collections",
    import: "Import from file",
    app: "App",
    appearance: "Appearance",
    language: "Language",
    appearanceBody: "The interface keeps the dark mobile home and the light inner screens.",
    support: "Help and support",
    supportBody: "Use an authorized import for an official catalog. Switch Card does not invent checklists.",
  },
};

const dictionaries: Record<Locale, Messages> = { it, en };

export function getMessages(locale: Locale) {
  return dictionaries[locale];
}
