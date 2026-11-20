import { queryOptions } from "@tanstack/react-query";
import {
  adminGetCharacter,
  adminGetPost,
  adminListCharacters,
  adminListPosts,
  getCharacter,
  getMyAccess,
  getPost,
  listCharacters,
  listPosts,
} from "@/lib/content.functions";

export const postsQuery = () => queryOptions({ queryKey: ["posts"], queryFn: () => listPosts() });
export const postQuery = (slug: string) =>
  queryOptions({ queryKey: ["post", slug], queryFn: () => getPost({ data: { slug } }) });
export const charactersQuery = () =>
  queryOptions({ queryKey: ["characters"], queryFn: () => listCharacters() });
export const characterQuery = (slug: string) =>
  queryOptions({ queryKey: ["character", slug], queryFn: () => getCharacter({ data: { slug } }) });

export const accessQuery = () =>
  queryOptions({ queryKey: ["admin", "access"], queryFn: () => getMyAccess() });
export const adminPostsQuery = () =>
  queryOptions({ queryKey: ["admin", "posts"], queryFn: () => adminListPosts() });
export const adminPostQuery = (id: string) =>
  queryOptions({ queryKey: ["admin", "post", id], queryFn: () => adminGetPost({ data: { id } }) });
export const adminCharactersQuery = () =>
  queryOptions({ queryKey: ["admin", "characters"], queryFn: () => adminListCharacters() });
export const adminCharacterQuery = (id: string) =>
  queryOptions({
    queryKey: ["admin", "character", id],
    queryFn: () => adminGetCharacter({ data: { id } }),
  });
