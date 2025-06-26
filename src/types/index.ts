
export interface SignupRequest {
    username: string;
    name: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface SigninRequest {
    accessToken: any;
    username: string;
    password: string;
  }
  
export interface AuthResponse {
  user: {
    username: string;
    name: string;
  };
  accessToken: string;
  refreshToken: string;
}

  
  export interface RefreshRequest {
    refreshToken: string;
  }
  
  export interface BoardRequest {
    title: string;
    content: string;
    category: string;
  }
  
  export interface BoardResponse {
    id: number;
  }
  
  export interface BoardDetail {
    name: ReactNode;
    category: string;
    id: number;
    title: string;
    content: string;
    boardCategory: string;
    imageUrl?: string;
    createdAt: string;
  }
  
  export interface BoardListItem {
    id: number;
    title: string;
    category: string;
    createdAt: string;
  }
  
  export interface BoardListResponse {
    content: BoardListItem[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: {
        unsorted: boolean;
        sorted: boolean;
        empty: boolean;
      };
      offset: number;
      unpaged: boolean;
      paged: boolean;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    numberOfElements: number;
    size: number;
    number: number;
    sort: {
      unsorted: boolean;
      sorted: boolean;
      empty: boolean;
    };
    first: boolean;
    empty: boolean;
  }
  
  export interface CategoryResponse {
    [key: string]: string;
  }
  
  export interface User {
    username: string;
    name: string;
  }