import {
  ChatAlt2Icon,
  HeartIcon,
  SwitchHorizontalIcon,
  UploadIcon,
} from '@heroicons/react/outline'
import React from 'react'
import TimeAgo from 'react-timeago'
import { Tweet } from '../typings'

interface Props {
  tweet: Tweet
}

const Tweet = ({ tweet }: Props) => {
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
        <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
          <ChatAlt2Icon className="h-5 w-5" />
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
    </div>
  )
}

export default Tweet
