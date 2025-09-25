// src/lib/data/products.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  rating: number;
  sold: number;
}


export const products: Product[] = [
  {
    id: "1",
    name: "Produk A",
    price: 100000,
    imageUrl: "/src/lib/assets/Product/celana.jpeg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam aliquam lectus consequat posuere luctus. Etiam pretium, ligula ut accumsan facilisis, est felis tristique leo, at feugiat nunc justo in velit. Proin quis tempus magna. Suspendisse scelerisque tortor in nunc pharetra aliquam. Fusce cursus vulputate arcu id pulvinar. Sed vitae est fringilla, euismod leo eget, vestibulum risus. Pellentesque lorem eros, sagittis sit amet venenatis gravida, congue vel libero. ",
    rating: 4.6,
    sold: 600,
  },
  {
    id: "2",
    name: "Produk B",
    price: 150000,
    imageUrl: "/src/lib/assets/Product/HP.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam aliquam lectus consequat posuere luctus. Etiam pretium, ligula ut accumsan facilisis, est felis tristique leo, at feugiat nunc justo in velit. Proin quis tempus magna. Suspendisse scelerisque tortor in nunc pharetra aliquam. Fusce cursus vulputate arcu id pulvinar. Sed vitae est fringilla, euismod leo eget, vestibulum risus. Pellentesque lorem eros, sagittis sit amet venenatis gravida, congue vel libero. ",
    rating: 4.3,
    sold: 34,
  },
  {
    id: "3",
    name: "Produk B",
    price: 150000,
    imageUrl: "/src/lib/assets/Product/HP2.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam aliquam lectus consequat posuere luctus. Etiam pretium, ligula ut accumsan facilisis, est felis tristique leo, at feugiat nunc justo in velit. Proin quis tempus magna. Suspendisse scelerisque tortor in nunc pharetra aliquam. Fusce cursus vulputate arcu id pulvinar. Sed vitae est fringilla, euismod leo eget, vestibulum risus. Pellentesque lorem eros, sagittis sit amet venenatis gravida, congue vel libero. ",
    rating: 4.3,
    sold: 34,
  },
  {
    id: "4",
    name: "Produk B",
    price: 150000,
    imageUrl: "/src/lib/assets/Product/laptop.jpeg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam aliquam lectus consequat posuere luctus. Etiam pretium, ligula ut accumsan facilisis, est felis tristique leo, at feugiat nunc justo in velit. Proin quis tempus magna. Suspendisse scelerisque tortor in nunc pharetra aliquam. Fusce cursus vulputate arcu id pulvinar. Sed vitae est fringilla, euismod leo eget, vestibulum risus. Pellentesque lorem eros, sagittis sit amet venenatis gravida, congue vel libero. ",
    rating: 4.3,
    sold: 34,
  },
  {
    id: "5",
    name: "Produk B",
    price: 150000,
    imageUrl: "/src/lib/assets/Product/sweater.jpeg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam aliquam lectus consequat posuere luctus. Etiam pretium, ligula ut accumsan facilisis, est felis tristique leo, at feugiat nunc justo in velit. Proin quis tempus magna. Suspendisse scelerisque tortor in nunc pharetra aliquam. Fusce cursus vulputate arcu id pulvinar. Sed vitae est fringilla, euismod leo eget, vestibulum risus. Pellentesque lorem eros, sagittis sit amet venenatis gravida, congue vel libero. ",
    rating: 4.3,
    sold: 34,
  },
  {
    id: "6",
    name: "Produk B",
    price: 150000,
    imageUrl: "/src/lib/assets/Product/celana.jpeg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam aliquam lectus consequat posuere luctus. Etiam pretium, ligula ut accumsan facilisis, est felis tristique leo, at feugiat nunc justo in velit. Proin quis tempus magna. Suspendisse scelerisque tortor in nunc pharetra aliquam. Fusce cursus vulputate arcu id pulvinar. Sed vitae est fringilla, euismod leo eget, vestibulum risus. Pellentesque lorem eros, sagittis sit amet venenatis gravida, congue vel libero. ",
    rating: 4.3,
    sold: 34,
  },
  {
    id: "7",
    name: "Produk B",
    price: 150000,
    imageUrl: "/src/lib/assets/Product/HP2.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam aliquam lectus consequat posuere luctus. Etiam pretium, ligula ut accumsan facilisis, est felis tristique leo, at feugiat nunc justo in velit. Proin quis tempus magna. Suspendisse scelerisque tortor in nunc pharetra aliquam. Fusce cursus vulputate arcu id pulvinar. Sed vitae est fringilla, euismod leo eget, vestibulum risus. Pellentesque lorem eros, sagittis sit amet venenatis gravida, congue vel libero. ",
    rating: 4.3,
    sold: 34,
  },
  // dst. sampai sekitar 20 produk
];
