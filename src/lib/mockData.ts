export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  pages: number;
  genre: string[];
  tags: string[];
  status: 'reading' | 'read' | 'to-read' | 'abandoned';
  dateAdded: string;
  progress?: number;
  description?: string;
  isbn?: string;
  publisher?: string;
  year?: number;
  language?: string;
  synopsis?: string;
}

export interface BookReview {
  id: string;
  bookId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  text: string;
  date: string;
  likes: number;
}


export interface ReadingChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  endDate: string;
  participants: number;
  icon: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  image: string;
  category: string;
  isJoined: boolean;
}

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Il nome della rosa',
    author: 'Umberto Eco',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
    rating: 4.5,
    pages: 512,
    genre: ['Storico', 'Giallo'],
    tags: ['medievale', 'monastero', 'preferiti'],
    status: 'read',
    dateAdded: '2024-01-15',
    description: 'Un thriller ambientato in un monastero medievale.',
    isbn: '978-88-452-4640-0',
    publisher: 'Bompiani',
    year: 1980,
    language: 'Italiano',
    synopsis: 'Siamo nel 1327. Il frate francescano Guglielmo da Baskerville, accompagnato dal giovane novizio Adso da Melk, arriva in un\'abbazia benedettina dell\'Italia settentrionale per partecipare a un\'importante disputa teologica. Ma il monastero è scosso da una serie di morti misteriose. I monaci muoiono uno dopo l\'altro in circostanze inspiegabili, e Guglielmo, con il suo acume da investigatore, inizia a indagare. La chiave del mistero sembra celarsi nella biblioteca, un immenso labirinto di conoscenza proibita. Un romanzo che intreccia giallo, storia, filosofia e semiotica.',
  },
  {
    id: '2',
    title: 'Cent\'anni di solitudine',
    author: 'Gabriel García Márquez',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop',
    rating: 4.8,
    pages: 448,
    genre: ['Realismo magico', 'Narrativa'],
    tags: ['classico', 'latinoamerica'],
    status: 'read',
    dateAdded: '2024-02-20',
    description: 'La saga della famiglia Buendía a Macondo.',
    isbn: '978-88-04-57835-6',
    publisher: 'Mondadori',
    year: 1967,
    language: 'Italiano',
    synopsis: 'La storia della famiglia Buendía, dalla fondazione del villaggio di Macondo fino alla sua distruzione, attraverso sette generazioni. Un affresco epico dove il reale e il fantastico si fondono in un racconto di amori impossibili, guerre civili, solitudine e destino ciclico.',
  },
  {
    id: '3',
    title: 'Norwegian Wood',
    author: 'Haruki Murakami',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop',
    rating: 4.2,
    pages: 386,
    genre: ['Narrativa', 'Romanzo'],
    tags: ['giappone', 'amore'],
    status: 'reading',
    dateAdded: '2024-03-10',
    progress: 65,
    description: 'Una storia d\'amore e perdita nella Tokyo degli anni \'60.',
  },
  {
    id: '4',
    title: 'Dune',
    author: 'Frank Herbert',
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=450&fit=crop',
    rating: 4.6,
    pages: 688,
    genre: ['Fantascienza', 'Avventura'],
    tags: ['spazio', 'epico', 'preferiti'],
    status: 'read',
    dateAdded: '2024-04-05',
    description: 'L\'epica saga di Paul Atreides su Arrakis.',
  },
  {
    id: '5',
    title: 'L\'ombra del vento',
    author: 'Carlos Ruiz Zafón',
    cover: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=300&h=450&fit=crop',
    rating: 4.4,
    pages: 487,
    genre: ['Mistero', 'Storico'],
    tags: ['barcellona', 'libri', 'preferiti'],
    status: 'reading',
    dateAdded: '2024-05-12',
    progress: 30,
    description: 'Un ragazzo scopre un libro misterioso nel Cimitero dei Libri Dimenticati.',
  },
  {
    id: '6',
    title: 'Il Piccolo Principe',
    author: 'Antoine de Saint-Exupéry',
    cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=450&fit=crop',
    rating: 4.9,
    pages: 96,
    genre: ['Fiaba', 'Filosofia'],
    tags: ['classico', 'breve', 'preferiti'],
    status: 'read',
    dateAdded: '2024-06-01',
    description: 'Un pilota incontra un piccolo principe nel deserto.',
  },
  {
    id: '7',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=450&fit=crop',
    rating: 4.3,
    pages: 464,
    genre: ['Saggistica', 'Storia'],
    tags: ['scienza', 'evoluzione'],
    status: 'to-read',
    dateAdded: '2024-07-15',
    description: 'Una breve storia dell\'umanità.',
  },
  {
    id: '8',
    title: '1984',
    author: 'George Orwell',
    cover: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=450&fit=crop',
    rating: 4.7,
    pages: 328,
    genre: ['Distopia', 'Fantascienza'],
    tags: ['classico', 'politica'],
    status: 'to-read',
    dateAdded: '2024-08-20',
    description: 'Un mondo totalitario dove il Grande Fratello controlla tutto.',
  },
];

export const mockReviews: BookReview[] = [
  {
    id: 'r1',
    bookId: '1',
    userName: 'Maria R.',
    userAvatar: 'MR',
    rating: 5,
    text: 'Un capolavoro assoluto. La costruzione del mistero è magistrale e la descrizione dell\'abbazia ti trasporta nel medioevo. Eco riesce a mescolare erudizione e suspense in modo unico.',
    date: '2024-11-20',
    likes: 24,
  },
  {
    id: 'r2',
    bookId: '1',
    userName: 'Luca P.',
    userAvatar: 'LP',
    rating: 4,
    text: 'Affascinante ma impegnativo. Le digressioni filosofiche a volte rallentano la trama, ma il finale ripaga ogni sforzo. Consigliato a lettori pazienti.',
    date: '2024-10-15',
    likes: 18,
  },
  {
    id: 'r3',
    bookId: '1',
    userName: 'Sofia V.',
    userAvatar: 'SV',
    rating: 5,
    text: 'Lo rileggo ogni anno e ogni volta scopro dettagli nuovi. La biblioteca labirintica è una delle immagini più potenti della letteratura moderna.',
    date: '2024-09-08',
    likes: 31,
  },
  {
    id: 'r4',
    bookId: '2',
    userName: 'Andrea M.',
    userAvatar: 'AM',
    rating: 5,
    text: 'Poesia pura. Márquez crea un universo dove il tempo è circolare e la magia è quotidiana. Un libro che ti cambia il modo di leggere.',
    date: '2024-12-01',
    likes: 42,
  },
  {
    id: 'r5',
    bookId: '3',
    userName: 'Giulia F.',
    userAvatar: 'GF',
    rating: 4,
    text: 'Murakami sa raccontare la malinconia come nessun altro. Toru Watanabe è un personaggio indimenticabile. Lettura perfetta per le sere d\'autunno.',
    date: '2025-01-10',
    likes: 15,
  },
];


export const mockChallenges: ReadingChallenge[] = [
  {
    id: '1',
    title: 'Sfida 52 Libri',
    description: 'Leggi 52 libri in un anno, uno a settimana!',
    target: 52,
    current: 34,
    endDate: '2026-12-31',
    participants: 2847,
    icon: '🏆',
  },
  {
    id: '2',
    title: 'Classici Italiani',
    description: 'Scopri 12 capolavori della letteratura italiana',
    target: 12,
    current: 7,
    endDate: '2026-06-30',
    participants: 1203,
    icon: '🇮🇹',
  },
  {
    id: '3',
    title: 'Around the World',
    description: 'Leggi un libro da ogni continente',
    target: 7,
    current: 4,
    endDate: '2026-12-31',
    participants: 956,
    icon: '🌍',
  },
  {
    id: '4',
    title: 'Pagine d\'Oro',
    description: 'Raggiungi 10.000 pagine lette quest\'anno',
    target: 10000,
    current: 6780,
    endDate: '2026-12-31',
    participants: 4521,
    icon: '📖',
  },
];

export const mockCommunities: CommunityGroup[] = [
  {
    id: '1',
    name: 'Lettori Notturni',
    description: 'Per chi ama leggere fino a tarda notte. Condividiamo atmosfere e consigli.',
    members: 3421,
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=200&fit=crop',
    category: 'Generale',
    isJoined: true,
  },
  {
    id: '2',
    name: 'Sci-Fi Italia',
    description: 'Fantascienza, distopie e mondi futuri. Il club per sognatori tecnologici.',
    members: 1876,
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=200&fit=crop',
    category: 'Fantascienza',
    isJoined: false,
  },
  {
    id: '3',
    name: 'Book & Coffee',
    description: 'Recensioni accompagnate da un buon caffè. Meetup mensili virtuali.',
    members: 5234,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop',
    category: 'Lifestyle',
    isJoined: true,
  },
  {
    id: '4',
    name: 'Autori Emergenti',
    description: 'Scopri nuovi autori indipendenti e vota i tuoi preferiti.',
    members: 2145,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=200&fit=crop',
    category: 'Autori',
    isJoined: false,
  },
  {
    id: '5',
    name: 'Gialli & Thriller',
    description: 'Intrighi, misteri e colpi di scena. Discutiamo insieme le nostre letture.',
    members: 4102,
    image: 'https://images.unsplash.com/photo-1587876931567-564ce588bfbd?w=400&h=200&fit=crop',
    category: 'Gialli',
    isJoined: false,
  },
  {
    id: '6',
    name: 'Manga & Fumetti',
    description: 'Dal Giappone all\'Italia, tutto il mondo del fumetto e del manga.',
    members: 6789,
    image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=200&fit=crop',
    category: 'Fumetti',
    isJoined: true,
  },
];

export const allGenres = ['Storico', 'Giallo', 'Realismo magico', 'Narrativa', 'Romanzo', 'Fantascienza', 'Avventura', 'Mistero', 'Fiaba', 'Filosofia', 'Saggistica', 'Storia', 'Distopia'];
export const allTags = ['medievale', 'monastero', 'preferiti', 'classico', 'latinoamerica', 'giappone', 'amore', 'spazio', 'epico', 'barcellona', 'libri', 'breve', 'scienza', 'evoluzione', 'politica'];
