## Reverb Audio Player

## Live URL : [https://reverb-audio-player.vercel.app/](https://reverb-audio-player.vercel.app/)

## Which languages/frameworks were used?

This is a web audio player made using HTML, CSS and JS. No additional library/framework were used.

## What are the features of this audio player?

This audio player uses one of my playlist from Spotify. It has effects such as 5 band Equalizer, 3d Surround effect, Reverb etc. This player includes all the necessary media controls as well as a button to display cover art with reflection effect.

## What API is used to fetch the audio source for the project?

For the audio source, it uses spotify user API to fetch one of my playlist's data.

## Is it possible to play full audio tracks using the project's player?

Since full audio tracks can only be played using Spotify's own player, I used the preview tracks which has a duration of only 29 seconds.

## How does the project fetch data from a specific playlist in Spotify?

First, an HTTP request is made using the Spotify API to get the access token(by sending client ID and secret). After successfully retrieving the access token, another HTTP request is made using the Spotify user API. It takes the access token and client playlist ID to retrieve the full data of the playlist.

## Is it necessary to have a Spotify account to use the project's audio feature?

Currently it uses my own playlist data as the source and anyone can use the player without a Spotify account. Although it is possible to change the playlist using different user credentials.
