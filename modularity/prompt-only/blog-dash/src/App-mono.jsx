import { useState, useEffect } from 'react'
import Header from './components/Header'
import SearchSection from './components/SearchSection'
import StatsSection from './components/StatsSection'
import PostsSection from './components/PostsSection'
import CommentsSection from './components/CommentsSection'
import Footer from './components/Footer'
import { mockData } from './utils/mockData'

function App() {
  // State management for the dashboard data using React hooks
  const [posts, setPosts] = useState(mockData.posts)
  const [comments, setComments] = useState(mockData.comments)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPosts, setFilteredPosts] = useState(mockData.posts)
  const [filteredComments, setFilteredComments] = useState(mockData.comments)

  // Effect hook to handle search filtering - filters both posts and comments based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      // Show all data when search is empty - necessary to restore full view when search is cleared
      setFilteredPosts(posts)
      setFilteredComments(comments)
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase()
      
      // Filter posts by title - case-insensitive matching for better user experience
      const postsFiltered = posts.filter(post =>
        post.title.toLowerCase().includes(lowerSearchTerm)
      )
      
      // Filter comments by content, author name, or post title - comprehensive search coverage
      const commentsFiltered = comments.filter(comment =>
        comment.content.toLowerCase().includes(lowerSearchTerm) ||
        comment.author.toLowerCase().includes(lowerSearchTerm) ||
        comment.postTitle.toLowerCase().includes(lowerSearchTerm)
      )
      
      setFilteredPosts(postsFiltered)
      setFilteredComments(commentsFiltered)
    }
  }, [searchTerm, posts, comments])

  // Post action handlers - these provide functional feedback for the dashboard buttons
  const handleViewPost = (postId) => {
    const post = posts.find(p => p.id === postId)
    alert(`Viewing post: "${post.title}"\n\nThis would navigate to the full post view.`)
    // Comment: Alert provides immediate feedback; in a real app, this would navigate to the post detail page
  }

  const handleEditPost = (postId) => {
    const post = posts.find(p => p.id === postId)
    alert(`Editing post: "${post.title}"\n\nThis would open the post editor.`)
    // Comment: Alert simulates navigation to edit mode; in a real app, this would open an editor interface
  }

  const handleDeletePost = (postId) => {
    const post = posts.find(p => p.id === postId)
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      // Remove post from state to demonstrate functionality - updates React state immutably
      const updatedPosts = posts.filter(p => p.id !== postId)
      setPosts(updatedPosts)
      alert('Post deleted successfully!')
      // Comment: In a real app, this would send a delete request to the server
    }
  }

  const handleProfileClick = () => {
    alert('Profile Settings\n\n• Edit personal information\n• Change password\n• Notification preferences\n• Account settings')
    // Comment: Alert simulates profile modal; in a real app, this would open a profile management interface
  }

  // Calculate stats dynamically from current posts - necessary to keep dashboard metrics current
  const stats = {
    totalPosts: posts.length,
    totalViews: posts.reduce((sum, post) => sum + post.views, 0),
    totalComments: posts.reduce((sum, post) => sum + post.comments, 0),
    totalShares: posts.reduce((sum, post) => sum + post.shares, 0)
  }

  return (
    <div className="App">
      <Header onProfileClick={handleProfileClick} />
      <SearchSection searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      
      <div className="container">
        <StatsSection stats={stats} />
        <PostsSection 
          posts={filteredPosts}
          searchTerm={searchTerm}
          onViewPost={handleViewPost}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
        />
        <CommentsSection 
          comments={filteredComments}
          searchTerm={searchTerm}
        />
      </div>
      
      <Footer />
    </div>
  )
}

export default App 