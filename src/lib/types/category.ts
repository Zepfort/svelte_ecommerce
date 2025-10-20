export type Category = {
    id: string;
    name: string;
    slug: string;
    parent_id: string | null;
    order_index?: number | null;
  };