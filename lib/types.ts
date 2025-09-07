export interface Profile {
  id: string
  email: string
  username?: string
  full_name?: string
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface Prompt {
  id: string
  title: string
  description?: string
  content: string
  category?: string
  tags: string[]
  image_url?: string
  image_public_id?: string
  is_public: boolean
  user_id: string
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Collection {
  id: string
  name: string
  description?: string
  is_public: boolean
  user_id: string
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface CollectionPrompt {
  id: string
  collection_id: string
  prompt_id: string
  added_at: string
  prompts?: Prompt
  collections?: Collection
}
