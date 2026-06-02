export type ItemType = "링크" | "스킬" | "로컬";

export type Category =
  | "교회"
  | "블로그"
  | "고객소통"
  | "콘텐츠 제작";

export interface HubItem {
  id: string;
  name: string;
  description?: string;
  url?: string;
  categories: Category[];
  type: ItemType;
}

export const CATEGORY_ORDER: Category[] = [
  "교회",
  "블로그",
  "고객소통",
  "콘텐츠 제작",
];

export const TYPE_ORDER: ItemType[] = ["링크", "스킬", "로컬"];

export const TYPE_STYLE: Record<
  ItemType,
  { bg: string; text: string; label: string }
> = {
  링크: { bg: "bg-blue-50", text: "text-blue-700", label: "링크" },
  스킬: { bg: "bg-violet-50", text: "text-violet-700", label: "스킬" },
  로컬: { bg: "bg-amber-50", text: "text-amber-700", label: "로컬" },
};

export const CATEGORY_STYLE: Record<Category, string> = {
  "교회": "bg-rose-50 text-rose-700",
  "블로그": "bg-emerald-50 text-emerald-700",
  "고객소통": "bg-sky-50 text-sky-700",
  "콘텐츠 제작": "bg-indigo-50 text-indigo-700",
};
