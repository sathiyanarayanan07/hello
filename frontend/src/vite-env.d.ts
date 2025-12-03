// vite/client contains types for things like:    
//      import.meta.env → Vite environment variables.

// Without this, TypeScript would complain when you try to do things like: 
//      console.log(import.meta.env.VITE_API_URL);

/// <reference types="vite/client" />
