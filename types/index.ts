export interface WishlistItem {
  id: string;
  title: string;
  link: string;
  /** Resized/compressed image, stored inline as a data URL. */
  imageUrl?: string;
}

export interface Guest {
  id: string;
  name: string;
  wishlist: WishlistItem[];
}

export interface SecretSantaSession {
  id: string;
  name: string;
  createdAt: string;
  guests: Guest[];
  /** Maps a guest id (drawer) to the guest id they drew (recipient). */
  draws: Record<string, string>;
}
