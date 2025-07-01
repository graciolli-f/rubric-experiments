// Mock data for the blog dashboard - contains sample posts and comments for demonstration
export const mockData = {
  posts: [
    {
      id: 1,
      title: "Getting Started with JavaScript ES6",
      date: "2024-01-15",
      views: 324,
      comments: 12,
      shares: 45,
      // Added cover image for 2-column grid display - enhances visual appeal and provides better content preview
      coverImage: "https://via.placeholder.com/300x200/4f46e5/ffffff?text=JavaScript+ES6"
    },
    {
      id: 2,
      title: "CSS Grid vs Flexbox: When to Use Each",
      date: "2024-01-12",
      views: 256,
      comments: 8,
      shares: 32,
      // Added cover image for 2-column grid display - enhances visual appeal and provides better content preview
      coverImage: "https://via.placeholder.com/300x200/10b981/ffffff?text=CSS+Grid+Flexbox"
    },
    {
      id: 3,
      title: "Building Responsive Web Applications",
      date: "2024-01-10",
      views: 189,
      comments: 15,
      shares: 28,
      // Added cover image for 2-column grid display - enhances visual appeal and provides better content preview
      coverImage: "https://via.placeholder.com/300x200/f59e0b/ffffff?text=Responsive+Web"
    },
    {
      id: 4,
      title: "Understanding Async/Await in JavaScript",
      date: "2024-01-08",
      views: 298,
      comments: 7,
      shares: 39,
      // Added cover image for 2-column grid display - enhances visual appeal and provides better content preview
      coverImage: "https://via.placeholder.com/300x200/ef4444/ffffff?text=Async+Await"
    },
    {
      id: 5,
      title: "Modern Web Development Best Practices",
      date: "2024-01-05",
      views: 180,
      comments: 11,
      shares: 22,
      // Added cover image for 2-column grid display - enhances visual appeal and provides better content preview
      coverImage: "https://via.placeholder.com/300x200/7b1fa2/ffffff?text=Best+Practices"
    }
  ],
  comments: [
    {
      id: 1,
      author: "Sarah Wilson",
      content: "Great explanation of ES6 features! This really helped me understand arrow functions better.",
      date: "2024-01-16",
      postTitle: "Getting Started with JavaScript ES6"
    },
    {
      id: 2,
      author: "Mike Chen",
      content: "Could you provide more examples of CSS Grid in practice?",
      date: "2024-01-15",
      postTitle: "CSS Grid vs Flexbox: When to Use Each"
    },
    {
      id: 3,
      author: "Emily Rodriguez",
      content: "Excellent article! The responsive design tips are exactly what I needed.",
      date: "2024-01-14",
      postTitle: "Building Responsive Web Applications"
    },
    {
      id: 4,
      author: "David Park",
      content: "Thanks for the async/await tutorial. Finally makes sense now!",
      date: "2024-01-13",
      postTitle: "Understanding Async/Await in JavaScript"
    },
    {
      id: 5,
      author: "Lisa Thompson",
      content: "These best practices have improved my workflow significantly.",
      date: "2024-01-12",
      postTitle: "Modern Web Development Best Practices"
    }
  ]
} 