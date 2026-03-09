export const isDevelopment = process.env.NODE_ENV === "development";
export const defaultProtocol = isDevelopment ? "http" : "https";
