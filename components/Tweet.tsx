import {
  ChatAlt2Icon,
  HeartIcon,
  SwitchHorizontalIcon,
  UploadIcon,
} from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import React, { ReactFragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import TimeAgo from 'react-timeago'
import { Comment, CommentBody, Tweet } from '../typings'
import { fetchComments } from '../utils/fetchComments'

interface Props {
  tweet: Tweet
}

const Tweet = ({ tweet }: Props) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [commentBoxVisible, setCommentBoxVisible] = useState<boolean>(false)
  const [commentInput, setCommentInput] = useState<string>('')

  const { data: session } = useSession()

  const refreshComments = async () => {
    const comments: Comment[] = await fetchComments(tweet._id)
    setComments(comments)
  }

  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const commentToast = toast.loading('Posting Comment...')

    // Comment logic
    const comment: CommentBody = {
      comment: commentInput,
      tweetId: tweet._id,
      username: session?.user?.name || 'Unknown User',
      profileImg: session?.user?.image || 'https://links.papareact.com/gll',
    }

    const result = await fetch(`/api/addComment`, {
      body: JSON.stringify(comment),
      method: 'POST',
    })

    toast.success('Comment Posted!', {
      id: commentToast,
    })

    setCommentInput('')
    setCommentBoxVisible(false)
    refreshComments()
  }

  useEffect(() => {
    refreshComments()
  }, [])

  return (
    <div className="flex flex-col border-y border-gray-100 p-5">
      <div className="flex space-x-3 ">
        <img
          className="h-10 w-10 rounded-full object-cover"
          src={tweet.profileImg}
          alt="avatar"
        />

        <div>
          <div className="flex items-center space-x-1">
            <p className="text-xl">{tweet.username}</p>
            {/* this regex is replacing all of the spaces with empty string   */}
            <p>@{tweet.username.replace(/\s+/g, '').toLowerCase()}</p>
            <TimeAgo
              date={tweet._createdAt}
              className="text-sm text-gray-500"
            />
          </div>

          <p className="pt-1">{tweet.text}</p>

          {tweet.image && (
            <img
              src={tweet.image}
              alt=""
              className="m-5 ml-0 mb-1 max-h-60 rounded-lg object-cover shadow-sm"
            />
          )}
        </div>
      </div>

      <div className="mt-5 flex justify-between">
        <div
          onClick={() => session && setCommentBoxVisible(!commentBoxVisible)}
          className="flex cursor-pointer items-center space-x-3 text-gray-400"
        >
          <ChatAlt2Icon className="h-5 w-5" />
          <p>{comments.length}</p>
        </div>

        <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
          <SwitchHorizontalIcon className="h-5 w-5" />
        </div>

        <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
          <HeartIcon className="h-5 w-5" />
        </div>

        <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
          <UploadIcon className="h-5 w-5" />
        </div>
      </div>

      {/* Comment Box logic */}
      {commentBoxVisible && (
        <form className="mt-3 flex space-x-3" onSubmit={handleComment}>
          <input
            className="flex-1 rounded-lg bg-gray-100 p-2 outline-none"
            type="text"
            placeholder="write a comment"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <button
            disabled={!commentInput}
            className="text-twitterBlue disabled:text-gray-200"
            type="submit"
          >
            Post
          </button>
        </form>
      )}

      {comments.length > 0 && (
        <div className="my-2 mt-5 max-h-44 space-y-5 overflow-y-scroll border-t border-gray-100 p-5 scrollbar-hide">
          {comments.map((comment) => (
            <div key={comment._id} className="relative flex space-x-2">
              <hr className="absolute left-5 top-10 h-8 border-x border-twitterBlue/30" />
              <img
                src={comment.profileImg}
                className="mt-2 h-7 w-7 rounded-full object-cover"
                alt=""
              />
              <div>
                <div className="flex items-center space-x-1">
                  <p className="mr-1 font-bold">{comment.username}</p>
                  <p className="hidden text-sm text-gray-500 lg:inline">
                    @{comment.username.replace(/\s+/g, '').toLowerCase()}
                  </p>

                  <TimeAgo
                    date={comment._createdAt}
                    className="text-sm text-gray-500"
                  />
                </div>
                <p>{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Tweet
