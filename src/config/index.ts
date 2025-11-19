export default {
  node_env: process.env.NEXT_PUBLIC_NODE_ENV,
  api_url:
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_API_URL_DEV
      : process.env.NEXT_PUBLIC_API_URL,
  // app_url: process.env.NEXT_PUBLIC_APP_URL,
  next_auth_secret: process.env.NEXTAUTH_SECRET,
};
