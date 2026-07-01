export const libraryDashboardUrl = "/library/dashboard";

export const libraryCategoriesUrl = "/library/categories";
export const libraryCategoryDetailUrl = (id: string) => `/library/categories/${id}`;

export const libraryShelvesUrl = "/library/shelves";
export const libraryShelfDetailUrl = (id: string) => `/library/shelves/${id}`;

export const libraryBooksUrl = "/library/books";
export const libraryBookDetailUrl = (id: string) => `/library/books/${id}`;
export const libraryBookCopiesUrl = (bookId: string) => `/library/books/${bookId}/copies`;
export const libraryCopyStatusUrl = (id: string) => `/library/copies/${id}/status`;

export const libraryIssuesUrl = "/library/issues";
export const libraryIssueReturnUrl = (id: string) => `/library/issues/${id}/return`;

export const librarySettingsUrl = "/library/settings";
