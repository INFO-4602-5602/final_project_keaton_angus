from twitter_scraper import get_tweets
print('What would you like to search on twitter?')
x = input()
print('How many pages would you like?')
y = input()
count = 0;
for tweet in get_tweets(x,pages=int(y)):
    print("---------------------------------------------")
    print(tweet['tweetId'])
    print(tweet['time'])
    print("Tweet number:",count)
    print(tweet['text'])
    print("Replies")
    print(">>>")
    print(tweet['replies'])
    print("Likes")
    print("<3<3<3",tweet['likes'])

    print("---------------------------------------------")

    count = count + 1
