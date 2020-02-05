import { eventChannel } from 'redux-saga'
import { Socket } from 'phoenix'

export const createSocket = (socketUrl) => {
  let socket = new Socket(socketUrl)
  socket.connect()
  return socket
}

export const createChannel = (socket, channelName, filter) => {
  const channel = socket.channel(channelName, filter)
  socket.onOpen(() => channel.push('filter', filter))

  return channel
}

export const createEventChannel = channel => {
  return eventChannel(emit => {
    channel.on('update', emit)

    channel.join()
      .receive('ok', () => console.log('Connection Successful'))
      .receive('error', ({ reason }) => console.log('failed join', reason))
      .receive('timeout', () => console.log('Networking issue. Still waiting...'))

    return unsubscribe
  })
}

const unsubscribe = () => { }
