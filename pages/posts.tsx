import { GetServerSideProps } from 'next'
import nookies from 'nookies'
import React, { useEffect, useRef, useState } from 'react'
import api from 'services/api'
import styles from '../styles/posts.module.scss'
import { FiArrowDown, FiArrowUp } from 'react-icons/fi'

interface PostType {
  id: string
  from_name: string
  from_id: string
  message: string
  type: string
  created_time: string
}

function PostsPage({ postsParsed, userList }) {
  const [userSearch, setUserSearch] = useState('')
  const [postSearch, setPostSearch] = useState('')
  const [usersList, setUsersList] = useState(userList)
  const [activePosts, setActivePosts] = useState<Array<PostType>>(postsParsed)
  const [filteredActivePosts, setFilteredActivePosts] =
    useState<Array<PostType>>(postsParsed)
  const [activeUser, setActiveUser] = useState('Britany Heise')
  const [activeOrder, setActiveOrder] = useState<'newest' | 'oldest'>('newest')

  //FILTER ON CLICK USERS
  useEffect(() => {
    const selectedPosts = postsParsed.filter(
      (post) => post.from_name == activeUser
    )
    setActivePosts(selectedPosts)
    setFilteredActivePosts(selectedPosts)
  }, [activeUser, postsParsed])

  //SORT POSTS
  const sortPosts = () => {
    const tempFilteredActivePosts = filteredActivePosts
    if (activeOrder == 'newest') {
      tempFilteredActivePosts.sort((a, b) =>
        a.created_time.localeCompare(b.created_time)
      )
      setActiveOrder('oldest')
    } else {
      tempFilteredActivePosts.sort((a, b) =>
        b.created_time.localeCompare(a.created_time)
      )
      setActiveOrder('newest')
    }
    setFilteredActivePosts(tempFilteredActivePosts)
  }

  //SEARCH USERS
  useEffect(() => {
    if (userSearch == '') {
      setUsersList(userList)
      return
    }
    const tempUserList = userList.filter((str) => {
      return str.includes(userSearch)
    })
    setUsersList(tempUserList)
  }, [userSearch])

  //SEARCH POSTS
  useEffect(() => {
    if (postSearch == '') {
      setFilteredActivePosts(activePosts)
      return
    }
    const tempPostsList = activePosts.filter((str) => {
      return str.message.includes(postSearch)
    })
    setFilteredActivePosts(tempPostsList)
  }, [postSearch])

  function handleChangeUser(event) {
    setUserSearch(event.target.value)
  }

  function handleChangePost(event) {
    setPostSearch(event.target.value)
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1>Supermetrics Assignment</h1>
        <div>
          <label>Search user:</label>
          <input value={userSearch} onChange={handleChangeUser}></input>
        </div>
        <div>
          <label>Search post:</label>
          <input value={postSearch} onChange={handleChangePost}></input>
        </div>
        <div>
          <span>Order:</span>
          <button onClick={sortPosts}>
            {activeOrder !== 'oldest' ? <FiArrowDown /> : <FiArrowUp />}
          </button>
        </div>
      </div>

      <div className={styles.postsContainer}>
        <div className={styles.userList}>
          {usersList.map((author, index) => {
            return (
              <div
                key={index}
                className={styles.userContainer}
                onClick={() => setActiveUser(author)}
              >
                <p>{author}</p>
              </div>
            )
          })}
        </div>
        <div className={styles.postsList}>
          {filteredActivePosts.map((post, index) => {
            return (
              <div key={index} className={styles.individualPostContainer}>
                <p>
                  {new Date(post.created_time).toLocaleTimeString('en-EN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour12: false,
                  })}
                </p>
                <p>{post.message}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { 'supermetrics-auth': sl_token } = nookies.get(ctx)
  console.log('redirected')
  if (sl_token) {
    const requestPosts = {
      params: {
        sl_token,
        page: 1,
      },
    }
    try {
      const { data: posts } = await api.get('/posts', requestPosts)
      const postsParsed = posts.data.posts

      const userList = [
        ...new Set(postsParsed.map((item) => item.from_name)),
      ].sort()
      return {
        props: { postsParsed, userList },
      }
    } catch (err) {
      return {
        props: { postsParsed: [], userList: [] },
      }
    }
  } else {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}

export default PostsPage
