export interface LeadershipProfile {
  name: string;
  role: string;
  organization?: string;
  image: string;
  bio: string;
  /** Profile URL on X; shows a "Follow on X" link on the leadership banner. */
  twitter?: string;
  /** Locale-neutral path of this leader's own profile page, if the site has one. */
  profilePath?: string;
}

export interface LeadershipPageSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

export type LeadershipGroup = "chairman" | "board" | "management";

export interface LeadershipPageProfile {
  name: string;
  role: string;
  // Which section of /leadership/ the profile appears in.
  group: LeadershipGroup;
  image?: string;
  imagePosition?: string;
  bio?: string;
  sections?: LeadershipPageSection[];
}

export const chairman: LeadershipProfile = {
  name: "Mr. Dileep Sanghani",
  role: "Chairman",
  image: "/images/leadership/iffco/Mr.-Dileep-Sanghani_desktop.jpg",
  bio: "Mr. Dileep Sanghani is the Chairman of IFFCO. He is an eminent cooperator who has been deeply involved in providing strength to the Indian cooperative movement since the last three decades. Mr Sanghani is currently holding key positions in various top national and state level cooperative organisations like NAFED, NCUI and GUJCOMASOL. Mr. Sanghani has represented Amreli constituency four times in the Lok Sabha from 1991-2004. He has also served as an MLA from Amreli and has headed various key ministries like Agriculture, Cooperation, Animal Husbandry, etc in Gujarat. Mr. Sanghani has been instrumental in formulating farmer oriented policies of IFFCO.",
  twitter: "https://x.com/Dileep_Sanghani",
  profilePath: "/leadership/dileep-sanghani/",
};

export const managingDirector: LeadershipProfile = {
  name: "Mr. K. J. Patel",
  role: "Managing Director",
  image: "/images/leadership/iffco/mr-k-j-patel.jpg",
  bio: "Mr. K. J. Patel is a highly accomplished mechanical engineer with over three decades of specialized experience in the maintenance and operation of Nitrogenous and Phosphatic fertiliser plants. An engineering graduate from Saurashtra University, Gujarat, he assumed charge as Managing Director of IFFCO on 1st August 2025. He began his career at IFFCO’s Kalol Unit, where he served in various technical and leadership roles for 23 years. In 2012, he moved to the Paradeep Unit and was later elevated as Unit Head in March 2019. His tenure has been marked by significant improvements in plant reliability, efficiency, and technology adoption.",
  twitter: "https://x.com/KiritkrJPatel",
  profilePath: "/leadership/k-j-patel/",
};

export const directors: LeadershipProfile[] = [
  {
    name: "Mr. Ramesh Kumar",
    role: "Director - HR & Legal",
    image: "/images/leadership/iffco/Mr.Ramesh_0.png",
    bio: "Mr. Kumar leads human resources and legal functions with extensive experience in industrial relations and people-centric systems.",
  },
];

export const leadershipPageProfiles: LeadershipPageProfile[] = [
  {
    name: "Mr. Dileep Sanghani",
    group: "chairman",
    role: "Chairman, IFFCO Kisan SEZ Limited",
    image: "/images/leadership/iffco/Mr.-Dileep-Sanghani_desktop.jpg",
    imagePosition: "30% center",
    bio: "Mr. Dileep Sanghani is Chairman of IFFCO Kisan SEZ Limited. He is a well-known figure in the cooperative sector with exceptional experience across agriculture, rural banking, insurance, cooperative governance, public administration and global cooperative diplomacy. He has served four terms in Lok Sabha along with several cabinet portfolios in the Government of Gujarat. He has been elected as an At-Large Director on the Global Board of the International Cooperative Alliance (ICA) for the 2026–2030 term.",
    sections: [
      {
        title: "The Torchbearer of Change",
        items: [
          "Chairman: Indian Farmers Fertiliser Cooperative Limited (IFFCO), IFFCO eBazar, IFFCO MC, IFFCO-TOKIO, IFFCO Kisan Finance Limited, IFFCO Kisan Logistics, Kisan International Trading FZE, Cooperative Rural Development Trust, IFFCO Kisan Sewa Trust, Gujarat State Cooperative Marketing Federation Ltd. (GUJCOMASOL), Amreli Jilla Madhyashtha Sahakari Bank Ltd., and National Institute of Rural Banking, Bengaluru.",
          "Executive Chairman: Network for the Development of Agricultural Cooperatives in Asia and the Pacific (NEDAC).",
          "Deputy Chairman: Jordan India Fertiliser Company (JIFCO).",
          "Director: National Cooperative Union of India (NCUI), National Agricultural Cooperative Marketing Federation of India (NAFED), Indian Potash Ltd. (IPL), Oman India Fertiliser Company (OMIFCO) and Jordan Phosphate Mines Company (JPMC).",
          "Trustee: IFFCO Foundation and Baba Baidyanath Dharmarth Trust.",
        ],
      },
      {
        title: "Farmer's Chairman",
        paragraphs: [
          "Shri Sanghani Ji has played an important role in shaping farmer-focused initiatives at IFFCO and is guiding the organisation through its next phase of growth and innovation. His focus includes expanding the crop nutrition and crop protection portfolio, strengthening farmer outreach through knowledge-based initiatives, and reinforcing IFFCO’s commitment to sustainable agriculture.",
        ],
      },
      {
        title: "Awards & Recognition",
        paragraphs: [
          "In recognition of his long-standing contribution to India’s cooperative sector, Shri Sanghani received the prestigious Lifetime Achievement Award at the Ingenious Banking Leadership Summit & Iconic Leaders Awards held in Goa in December 2024.",
          "He has also been honoured with the “Sahakarita Shiromani” Award by KRIBHCO.",
        ],
      },
      {
        title: "A Leader Connected to the Grassroots",
        paragraphs: [
          "Shri Dileep Sanghani is widely recognised for his close connection with farmers and rural communities. Beyond leadership roles and institutions, he has remained committed to grassroots engagement and public service. After being elected Chairman of IFFCO, he reaffirmed the organisation’s commitment to farmers and cooperatives and its dedication to working in line with the Prime Minister’s vision of “Sahkar se Samridhi.”",
          "Through his work in cooperative banking, rural development, and agricultural support, Shri Sanghani has consistently focused on creating meaningful and lasting impact for farmers and communities across the country.",
        ],
      },
    ],
  },
  {
    name: "Mr. K. J. Patel",
    group: "board",
    role: "Managing Director",
    image: "/images/leadership/iffco/mr-k-j-patel.jpg",
    bio: "Mr. K. J. Patel is the Managing Director of IKSEZ with effect from 31 July 2026 and the Managing Director of IFFCO. He is a highly accomplished mechanical engineer with over four decades of specialized experience in the maintenance and operation of Nitrogenous and Phosphatic fertiliser plants. He holds an engineering degree from Saurashtra University, Gujarat.",
    sections: [
      {
        title: "Leadership & Experience",
        paragraphs: [
          "Mr. Patel began his career at IFFCO's Kalol Unit in 1985 and later served as Director (Technical) at IFFCO, where he oversaw technical operations across all units. He is known for his strong domain expertise, strategic leadership, and hands-on approach to operational excellence.",
          "Mr. Patel has represented IFFCO at several national and international forums, where he has presented papers and shared insights on advanced maintenance technologies. His contributions have been instrumental in shaping IFFCO's technical roadmap and enhancing its performance standards.",
        ],
      },
    ],
  },
  {
    name: "Mr. Ramesh Kumar",
    group: "board",
    role: "Director",
    image: "/images/leadership/iffco/Mr.Ramesh_0.png",
    bio: "Mr. Ramesh Kumar is a Director on the Board of IFFCO Kisan SEZ Limited. He brings with him over 43 years of rich and diverse experience in the field of Human Resource Management and Industrial Relations, with a proven track record in building and strengthening people-centric institutions. Over the course of his career, Mr. Kumar has played a pivotal role in the design and implementation of robust HR systems, including strategic manpower planning and sourcing, performance management systems (PMS), learning & development (L&D) frameworks, and legal & industrial relations mechanisms. His leadership has contributed significantly to organizational effectiveness, workforce capability building, and harmonious industrial relations. Mr. Kumar has been recognized with several awards for his outstanding contributions to the HR function, reflecting his commitment to excellence, ethical governance and employee development. He holds a Post Graduate degree in Personnel Management and Industrial Relations from Xavier Institute of Social Service (XISS), Ranchi.",
  },
  {
    name: "Smt. D. Lakshmi Parthasarathy",
    group: "board",
    role: "Retired I.A.S.",
    image: "/images/leadership/lakshmi-parthasarathy.jpg",
  },
  {
    name: "Mr. Balvinder Kumar",
    group: "board",
    role: "Retired I.A.S.",
    image: "/images/leadership/balvinder-kumar.jpg",
  },
  {
    name: "Dr. T. Sudhakar",
    group: "management",
    role: "Chief Executive Officer – IFFCO Kisan SEZ Limited",
    image: "/images/leadership/t-sudhakar.jpg",
    bio: "Dr. T. Sudhakar brings together a unique blend of academic excellence, technological expertise, business development experience and a deep-rooted passion for agriculture and nature. Holding a Doctorate in Statistics, he possesses a strong analytical foundation and a keen interest in applying data-driven thinking and strategic insights to organisational growth and development.",
    sections: [
      {
        title: "Professional Journey",
        paragraphs: [
          "During his professional journey with Indian Farmers Fertiliser Cooperative Limited (IFFCO), he has gained valuable experience across diverse business functions. His earlier association with IFFCO's IT Services provided him with exposure to information technology, systems and digital transformation. Subsequently, his role in the Business Development Team of IFFCO Kisan Sanchar Limited further strengthened his experience in business strategy, market development, stakeholder engagement and exploring new business opportunities.",
          "His professional journey reflects a combination of analytical thinking, technological understanding and entrepreneurial vision. As Chief Executive Officer of IFFCO Kisan SEZ Limited, he is focused on advancing the industrial development objectives of the organisation, strengthening investor engagement and creating opportunities for sustainable industrial growth.",
        ],
      },
      {
        title: "Vision",
        paragraphs: [
          "Beyond his professional commitments, Dr. Sudhakar has a keen passion for agronomy, agriculture and nature. His appreciation for the natural environment and interest in agricultural practices reflect his belief in the importance of balancing industrial progress with environmental sustainability.",
          "Guided by the cooperative philosophy and institutional legacy of IFFCO, he aspires to contribute towards building a progressive industrial ecosystem that creates lasting value for investors, farmers, local communities and future generations.",
        ],
      },
    ],
  },
];
