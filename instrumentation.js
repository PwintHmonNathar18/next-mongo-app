// instrumentation.js
// instrumentation.js - Remove database connection
export async function register() {
  console.log("🔧 Instrumentation hook registered");
  
  // You can add other instrumentation here, but avoid DB connections
  // Database connections should be handled in API routes on-demand
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Development instrumentation active');
  }
}